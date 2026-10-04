import { PageFrame, type LayoutProps } from '@/layouts/PageFrame'

export function AdminLayout(props: LayoutProps) {
  return (
    <PageFrame
      {...props}
      header={
        <>
          <span className="wordmark">
            home<span>.</span>
          </span>
          <span className="page-label">Demo control panel</span>
        </>
      }
      footer={
        <>
          <span>Home server demo</span>
          <span>Illustrative services. Local memory only.</span>
        </>
      }
    />
  )
}
