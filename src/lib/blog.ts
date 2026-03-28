import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  dateFormatted: string
  category: string
  tags: string[]
  readingTime: string
  featured: boolean
  coverAlt: string
}

export interface BlogPostWithContent extends BlogPost {
  content: string
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8')
    const { data, content } = matter(raw)
    const rt = readingTime(content)

    return {
      slug,
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      dateFormatted: formatDate(data.date as string),
      category: data.category as string,
      tags: (data.tags as string[]) || [],
      readingTime: rt.text,
      featured: (data.featured as boolean) || false,
      coverAlt: (data.coverAlt as string) || data.title as string,
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPostWithContent {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    dateFormatted: formatDate(data.date as string),
    category: data.category as string,
    tags: (data.tags as string[]) || [],
    readingTime: rt.text,
    featured: (data.featured as boolean) || false,
    coverAlt: (data.coverAlt as string) || data.title as string,
    content,
  }
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}
