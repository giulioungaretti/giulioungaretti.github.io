import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPostDate, postPath } from '@/lib/blog'
import type { BlogPost } from '@/types/blog'

export function PostList({
  posts,
  headingLevel = 2,
}: {
  posts: readonly BlogPost[]
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  if (!posts.length)
    return (
      <p className="reading-empty">
        No posts published yet. New writing will appear here when it is ready.
      </p>
    )
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li className="post-row" key={post.slug}>
          <time className="post-date" dateTime={post.date}>
            {formatPostDate(post.date)}
          </time>
          <div>
            <Heading className="post-title">
              <Link to={postPath(post)}>
                <span>{post.title}</span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Heading>
            <p className="post-description">{post.description}</p>
            <p className="post-details">
              {post.tags.join(' · ')}
              {post.tags.length > 0 && ' · '}About {post.readingMinutes} min
              read
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
