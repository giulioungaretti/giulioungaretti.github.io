import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownBody({ children }: { children: string }) {
  return (
    <div className="prose-appliance">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          pre: ({ children }) => (
            <pre tabIndex={0} role="region" aria-label="Article code example">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div
              className="article-table"
              tabIndex={0}
              role="region"
              aria-label="Article table"
            >
              <table>{children}</table>
            </div>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt ?? ''} loading="lazy" />
          ),
          li: ({ className, children }) => (
            <li className={className}>
              {className?.includes('task-list-item') ? (
                <label>{children}</label>
              ) : (
                children
              )}
            </li>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
