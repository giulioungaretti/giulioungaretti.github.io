import { PageFrame, type LayoutProps } from '@/layouts/PageFrame'

export function ShowcaseLayout(props: LayoutProps) {
  return (
    <PageFrame
      {...props}
      header={
        <>
          <span className="wordmark">
            form<span>.</span>
          </span>
          <span className="page-label">Component reference</span>
        </>
      }
      footer={
        <>
          <span>Home design system</span>
          <span>Inspired by Braun. Not affiliated.</span>
        </>
      }
    />
  )
}
