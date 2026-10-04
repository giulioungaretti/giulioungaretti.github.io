import { readFile, readdir } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import type { Plugin } from 'vite'
import { publishPosts } from '../src/lib/blog-content.ts'

export async function readPublishedPosts(
  directory: string,
  today = new Date().toISOString().slice(0, 10),
  watchSource?: (path: string) => void,
) {
  const entries = await readdir(directory, { withFileTypes: true })
  const sources = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map(async (entry) => {
        const path = resolve(directory, entry.name)
        watchSource?.(path)
        return [entry.name, await readFile(path, 'utf8')] as const
      }),
  )
  return publishPosts(Object.fromEntries(sources), today)
}

export function markdownPosts(): Plugin {
  const moduleId = '\0virtual:posts'
  let directory: string
  return {
    name: 'published-markdown-posts',
    configResolved(config) {
      directory = resolve(config.root, '_posts')
    },
    resolveId(id) {
      if (id === 'virtual:posts') return moduleId
    },
    async load(id) {
      if (id !== moduleId) return
      const posts = await readPublishedPosts(directory, undefined, (file) =>
        this.addWatchFile(file),
      )
      return `export default ${JSON.stringify(posts)};`
    },
    configureServer(server) {
      server.watcher.add(directory)
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(`${directory}${sep}`) || !file.endsWith('.md'))
          return
        const module = server.moduleGraph.getModuleById(moduleId)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}
