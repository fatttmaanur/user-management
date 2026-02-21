import Link from 'next/link'

type PageHeaderProps = {
  title: string
  description?: string
  backHref?: string
}

export default function PageHeader({ title, description, backHref = '/dashboard' }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link
        href={backHref}
        className="text-xs text-gray-400 hover:text-gray-600 transition shrink-0"
      >
        ← Geri
      </Link>
      <div className="border-l border-gray-200 pl-4">
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}