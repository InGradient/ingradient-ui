import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EdgeAppShellView } from './EdgeAppShellView'

describe('EdgeAppShellView landmarks', () => {
  it('puts the title bar in a banner, the screen in one main, and the status bar in a contentinfo', () => {
    render(
      <EdgeAppShellView
        isResolving={false}
        isShuttingDown={false}
        showFooter
        titleBar={<span>Title bar</span>}
        content={<h1>Workspace</h1>}
        bottomBar={<span>Status</span>}
      />,
    )
    expect(screen.getByRole('banner')).toHaveTextContent('Title bar')
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1, name: 'Workspace' }))
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Status')
  })

  it('omits the banner when no title bar is supplied', () => {
    render(
      <EdgeAppShellView isResolving={false} isShuttingDown={false} showFooter={false} titleBar={null} content={<p>Body</p>} />,
    )
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveTextContent('Body')
  })
})
