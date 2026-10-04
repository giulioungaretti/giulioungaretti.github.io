import { PostList } from '@/components/PostList'
import { posts } from '@/lib/blog'

export function Blog() {
  return (
    <section className="blog-archive" aria-labelledby="archive-heading">
      <h2 id="archive-heading" className="section-heading">
        All posts
      </h2>
      <PostList posts={posts} />
    </section>
  )
}
