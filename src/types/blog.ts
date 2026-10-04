export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  markdown: string
  readingMinutes: number
  legacyPath: string
}
