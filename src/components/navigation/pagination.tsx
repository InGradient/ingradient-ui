import { Button } from '../inputs/button'

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', gap: 'var(--ig-space-2)', flexWrap: 'wrap' }}>
      {pages.map((item) => (
        <Button
          key={item}
          type="button"
          variant={item === page ? 'solid' : 'secondary'}
          size="sm"
          aria-current={item === page ? 'page' : undefined}
          onClick={() => onChange(item)}
        >
          {item}
        </Button>
      ))}
    </nav>
  )
}
