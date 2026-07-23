import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CommentsPanel } from './comments-panel'

describe('CommentsPanel', () => {
  it('allows the comment list height to be expanded for detail layouts', () => {
    const { container } = render(
      <CommentsPanel
        comments={[
          {
            id: 'comment-1',
            authorName: 'June Lee',
            body: 'Ready for review.',
            createdAt: 'now',
          },
        ]}
        listMaxHeight="190px"
      />,
    )

    expect(container.querySelector('[style*="max-height"]')).toHaveStyle({ maxHeight: '190px' })
  })
})
