import posts from 'virtual:posts'
import type { BlogPost } from '@/types/blog'

export { posts }

export function postPath(post: BlogPost) {
  return `/blog/${post.slug}/`
}

export function normalizePath(path: string) {
  return path === '/' ? path : path.replace(/\/+$/, '')
}

export function getPostByPath(path: string) {
  const normalized = normalizePath(path)
  return posts.find(
    (post) =>
      normalizePath(postPath(post)) === normalized ||
      normalizePath(post.legacyPath) === normalized,
  )
}

export function formatPostDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}
