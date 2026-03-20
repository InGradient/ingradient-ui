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
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {pages.map((item) => (
        <Button key={item} type="button" variant={item === page ? 'solid' : 'secondary'} size="sm" onClick={() => onChange(item)}>
          {item}
        </Button>
      ))}
    </div>
  )
}
