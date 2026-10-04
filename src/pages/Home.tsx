import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PostList } from '@/components/PostList'
import { posts } from '@/lib/blog'

export function Home() {
  return (
    <>
      <section
        className="writing-preview"
        aria-labelledby="latest-writing-heading"
      >
        <div className="writing-heading">
          <h2 id="latest-writing-heading" className="section-heading">
            Latest writing
          </h2>
          <Link to="/blog" className="text-link">
            All posts
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <PostList posts={posts.slice(0, 3)} headingLevel={3} />
      </section>
    </>
  )
}
