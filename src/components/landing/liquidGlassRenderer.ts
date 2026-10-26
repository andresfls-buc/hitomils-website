// Original WebGL treatment based on the visible curved/glass carousel reference.
// The DOM carousel remains available when WebGL or motion effects are disabled.
const vertexSource = `
attribute vec2 a_uv;
uniform mediump vec2 u_viewport;
uniform vec2 u_card;
uniform float u_center;
uniform mediump float u_motion;
varying mediump vec2 v_uv;
varying mediump float v_edge;
varying mediump float v_side;
void main() {
  float worldX = u_center + (a_uv.x - 0.5) * u_card.x;
  float relative = worldX - u_viewport.x * 0.5;
  float radius = u_viewport.x * 0.72;
  float angle = clamp(relative / radius, -1.570796, 1.570796);
  float edge = abs(relative / (u_viewport.x * 0.5));
  float curve = smoothstep(0.6, 1.2, edge);
  float x = mix(worldX, u_viewport.x * 0.5 + sin(angle) * radius, curve);
  float lens = pow(smoothstep(0.64, 1.22, edge), 2.5);
  // Only the outer glass pulls upward; the central photographs stay flat.
  float lift = lens * u_card.y * (0.45 + u_motion * 0.035);
  float y = u_viewport.y * 0.62 + (a_uv.y - 0.5) * u_card.y;
  y -= lift * pow(1.0 - a_uv.y, 2.0);
  y += lift * 0.08 * pow(a_uv.y, 3.0);
  gl_Position = vec4(x / u_viewport.x * 2.0 - 1.0, 1.0 - y / u_viewport.y * 2.0, 0.0, 1.0);
  v_uv = a_uv;
  v_side = (x - u_viewport.x * 0.5) / (u_viewport.x * 0.5);
  v_edge = abs(v_side);
}`

const fragmentSource = `
precision mediump float;
uniform sampler2D u_image;
uniform float u_imageAspect;
uniform float u_cardAspect;
uniform mediump float u_motion;
varying mediump vec2 v_uv;
varying mediump float v_edge;
varying mediump float v_side;
vec2 cover(vec2 uv) {
  if (u_imageAspect > u_cardAspect) uv.x = 0.5 + (uv.x - 0.5) * u_cardAspect / u_imageAspect;
  else uv.y = 0.5 + (uv.y - 0.5) * u_imageAspect / u_cardAspect;
  return uv;
}
vec3 softImage(vec2 uv, vec2 spread) {
  vec3 color = texture2D(u_image, uv).rgb * 0.2;
  color += texture2D(u_image, uv + vec2(spread.x, 0.0)).rgb * 0.12;
  color += texture2D(u_image, uv - vec2(spread.x, 0.0)).rgb * 0.12;
  color += texture2D(u_image, uv + vec2(0.0, spread.y)).rgb * 0.12;
  color += texture2D(u_image, uv - vec2(0.0, spread.y)).rgb * 0.12;
  color += texture2D(u_image, uv + spread).rgb * 0.08;
  color += texture2D(u_image, uv - spread).rgb * 0.08;
  color += texture2D(u_image, uv + vec2(spread.x, -spread.y)).rgb * 0.08;
  color += texture2D(u_image, uv + vec2(-spread.x, spread.y)).rgb * 0.08;
  return color;
}
void main() {
  float glass = smoothstep(0.68, 1.02, v_edge);
  if (glass < 0.001) {
    gl_FragColor = vec4(texture2D(u_image, cover(v_uv)).rgb, 1.0);
    return;
  }
  float side = sign(v_side);
  vec2 uv = v_uv;
  // Thick edge lenses magnify and refract the photo, rather than rippling it.
  uv.x -= side * glass * glass * 0.08;
  uv.x += sin(uv.y * 4.5 + v_side * 3.0) * glass * (0.035 + u_motion * 0.02);
  uv.y = 0.5 + (uv.y - 0.5) * (1.0 - glass * 0.22);
  uv.y += sin(uv.x * 5.0 + uv.y * 3.0) * glass * 0.035;
  uv = cover(uv);
  vec2 spread = vec2(0.006, 0.008) * glass * (1.0 + u_motion * 0.4);
  float dispersion = pow(glass, 1.4) * (0.026 + u_motion * 0.01);
  vec2 prism = vec2(side, cos(v_uv.y * 3.14159) * 0.45) * dispersion;
  vec3 color = softImage(uv, spread);
  color.r = softImage(uv + prism, spread).r;
  color.b = softImage(uv - prism, spread).b;
  // A soft surface reflection gives the side lenses their milky glass finish.
  float sheen = glass * (0.04 + pow(1.0 - v_uv.y, 3.0) * 0.18);
  color = mix(color, vec3(0.97, 0.96, 0.93), sheen);
  float rim = pow(1.0 - min(v_uv.x, 1.0 - v_uv.x) * 2.0, 18.0) * glass;
  color += vec3(0.11, 0.09, 0.07) * rim;
  gl_FragColor = vec4(color, 1.0);
}`

export function createLiquidGlassRenderer(canvas: HTMLCanvasElement) {
  // Frames are drawn on demand, so keep the last photo while the carousel is idle.
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false, preserveDrawingBuffer: true })
  if (!gl) return null
  const shaders: WebGLShader[] = []
  const buffers: WebGLBuffer[] = []
  const textures = new Map<number, { texture: WebGLTexture; aspect: number }>()
  let program: WebGLProgram | null = null
  const dispose = () => {
    textures.forEach(({ texture }) => gl.deleteTexture(texture))
    buffers.forEach(buffer => gl.deleteBuffer(buffer))
    shaders.forEach(shader => gl.deleteShader(shader))
    if (program) gl.deleteProgram(program)
  }
  try {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error('Shader unavailable')
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader compilation failed')
      return shader
    }
    program = gl.createProgram()
    if (!program) throw new Error('WebGL program unavailable')
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader linking failed')
    gl.useProgram(program)
    const positions: number[] = []
    const indices: number[] = []
    const columns = 36, rows = 18
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= columns; x++) positions.push(x / columns, y / rows)
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const start = y * (columns + 1) + x
        indices.push(start, start + 1, start + columns + 1, start + 1, start + columns + 2, start + columns + 1)
      }
    }
    const vertexBuffer = gl.createBuffer(), indexBuffer = gl.createBuffer()
    if (!vertexBuffer || !indexBuffer) throw new Error('WebGL buffers unavailable')
    buffers.push(vertexBuffer, indexBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    const attribute = gl.getAttribLocation(program, 'a_uv')
    gl.enableVertexAttribArray(attribute)
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    const uniform = (name: string) => gl.getUniformLocation(program!, name)
    const locations = Object.fromEntries(['u_viewport', 'u_card', 'u_center', 'u_motion', 'u_image', 'u_imageAspect', 'u_cardAspect'].map(name => [name, uniform(name)]))
    gl.uniform1i(locations.u_image, 0)
    gl.clearColor(0, 0, 0, 0)
    const upload = (image: HTMLImageElement, key: number) => {
      // Safari can report complete/naturalWidth before decoded pixels are usable.
      // Next Image's onLoad runs after decode; never cache an earlier blank copy.
      if (textures.has(key) || image.dataset.glassReady !== 'true' || !image.complete || !image.naturalWidth) return
      const texture = gl.createTexture()
      if (!texture) return
      // Bound texture memory even on high-DPR phones; retain the sharp DOM fallback.
      const source = document.createElement('canvas')
      source.width = Math.min(image.naturalWidth, 640)
      source.height = Math.round(source.width * image.naturalHeight / image.naturalWidth)
      const context = source.getContext('2d', { willReadFrequently: true })
      if (!context) { gl.deleteTexture(texture); return }
      try {
        context.drawImage(image, 0, 0, source.width, source.height)
        // Upload explicit pixels instead of sharing a 2D canvas's GPU surface.
        // A failed upload must never count as a ready photo and hide the DOM image.
        const pixels = context.getImageData(0, 0, source.width, source.height)
        if (!pixels.data.some((value, index) => index % 4 === 3 && value !== 0)) {
          gl.deleteTexture(texture)
          return
        }
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, source.width, source.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels.data)
        if (gl.getError() !== gl.NO_ERROR) { gl.deleteTexture(texture); return }
        textures.set(key, { texture, aspect: image.naturalWidth / image.naturalHeight })
      } catch {
        gl.deleteTexture(texture)
      }
    }
    return {
      draw({ width, height, cardWidth, cardHeight, step, inset, scroll, count, motion, images }: {
        width: number; height: number; cardWidth: number; cardHeight: number; step: number; inset: number
        scroll: number; count: number; motion: number; images: HTMLImageElement[]
      }) {
        if (gl.isContextLost() || !width || !height) return false
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr)
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth; canvas.height = pixelHeight
        }
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clear(gl.COLOR_BUFFER_BIT)
        images.forEach(image => upload(image, Number(image.dataset.galleryIndex)))
        gl.uniform2f(locations.u_viewport, width, height)
        gl.uniform2f(locations.u_card, cardWidth, cardHeight)
        gl.uniform1f(locations.u_cardAspect, cardWidth / cardHeight)
        gl.uniform1f(locations.u_motion, motion)
        const current = Math.round(scroll / step)
        let centerReady = false
        for (let index = current - 3; index <= current + 3; index++) {
          if (index < 0 || index >= count * 3) continue
          const center = inset + index * step + cardWidth / 2 - scroll
          // Keep distant cards outside the curved viewport, especially on phones.
          if (Math.abs(center - width / 2) > width * 0.65 + cardWidth / 2) continue
          const asset = textures.get(index % count)
          if (!asset) continue
          gl.bindTexture(gl.TEXTURE_2D, asset.texture)
          gl.uniform1f(locations.u_imageAspect, asset.aspect)
          gl.uniform1f(locations.u_center, center)
          gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
          if (index === current) centerReady = true
        }
        return centerReady && gl.getError() === gl.NO_ERROR
      },
      dispose,
    }
  } catch {
    dispose()
    return null
  }
}
