import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { ImageResponse } from 'next/og.js'

// Keep the supplied artwork intact; compose browser/search icons around it.
const root = new URL('../', import.meta.url)
const original = await readFile(new URL('public/brand/icon-512.png', root))
const artwork = `data:image/png;base64,${original.toString('base64')}`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <title>Hitomi Landazabal</title>
  <style>
    @media (prefers-color-scheme: dark) {
      image { filter: brightness(0) invert(1); }
    }
  </style>
  <image width="512" height="512" href="${artwork}"/>
</svg>
`
await writeFile(new URL('src/app/icon.svg', root), svg)

async function backedIcon(size) {
  const response = new ImageResponse(
    createElement('div', {
      style: { display: 'flex', width: size, height: size, background: '#FAF7F4' },
    }, createElement('img', { src: artwork, width: size, height: size })),
    { width: size, height: size },
  )
  return Buffer.from(await response.arrayBuffer())
}

await writeFile(new URL('src/app/icon.png', root), await backedIcon(192))
await writeFile(new URL('src/app/apple-icon.png', root), await backedIcon(180))

// ICO embeds PNG frames, retaining a crisp, light-backed fallback at small sizes.
const sizes = [16, 32, 48]
const frames = await Promise.all(sizes.map(backedIcon))
const directory = Buffer.alloc(6 + frames.length * 16)
directory.writeUInt16LE(1, 2)
directory.writeUInt16LE(frames.length, 4)
let offset = directory.length
frames.forEach((frame, index) => {
  const entry = 6 + index * 16
  directory[entry] = sizes[index]
  directory[entry + 1] = sizes[index]
  directory.writeUInt16LE(1, entry + 4)
  directory.writeUInt16LE(32, entry + 6)
  directory.writeUInt32LE(frame.length, entry + 8)
  directory.writeUInt32LE(offset, entry + 12)
  offset += frame.length
})
await writeFile(new URL('src/app/favicon.ico', root), Buffer.concat([directory, ...frames]))
console.log(`Generated adaptive SVG and light-backed icons in ${fileURLToPath(new URL('src/app/', root))}`)
