import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PageHeading } from '@/components/system'
import { MarkdownBody } from '@/components/MarkdownBody'
import { formatPostDate, getPostByPath } from '@/lib/blog'

export function BlogArticle() {
  const location = useLocation()
  const post = getPostByPath(location.pathname)
  if (!post)
    return (
      <>
        <PageHeading title="This post isn’t here.">
          It may be a draft, scheduled for later, or the address may be
          incorrect.
        </PageHeading>
        <Button asChild variant="outline">
          <Link to="/blog/">Back to writing</Link>
        </Button>
      </>
    )

  return (
    <div className="article-layout">
      <Link to="/blog/" className="text-link article-back">
        <ArrowLeft size={15} aria-hidden="true" />
        All writing
      </Link>
      <article aria-labelledby="post-title">
        <header className="article-heading">
          <h1 id="post-title" className="page-title">
            {post.title}
          </h1>
          <p className="article-meta">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span>About {post.readingMinutes} min read</span>
          </p>
          <p className="article-description">{post.description}</p>
        </header>
        <MarkdownBody>{post.markdown}</MarkdownBody>
        <footer className="article-footer">
          <span>{post.tags.join(' · ')}</span>
          <Link to="/blog/" className="text-link">
            Back to writing
            <ArrowLeft size={15} aria-hidden="true" />
          </Link>
        </footer>
      </article>
    </div>
  )
}
