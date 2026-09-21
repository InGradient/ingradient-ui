import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { focusAfterMenuTab } from './context-menu-focus'

describe('menu Tab traversal', () => {
  it('moves before or after the trigger and excludes hidden, disabled and popup controls', () => {
    render(<><button>Previous</button><button>Trigger</button><button disabled>Disabled</button>
      <div hidden><button>Hidden</button></div><div style={{ display: 'none' }}><button>CSS hidden</button></div>
      <div role="menu"><button role="menuitem">Popup</button></div><button>Next</button></>)
    const trigger = screen.getByRole('button', { name: 'Trigger' })
    focusAfterMenuTab(trigger, false)
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
    focusAfterMenuTab(trigger, true)
    expect(screen.getByRole('button', { name: 'Previous' })).toHaveFocus()
  })
  it('respects the enclosing dialog focus boundary in both directions', () => {
    render(<><button>Outside</button><div role="dialog" aria-label="Parent"><button>First</button><button>Last</button></div></>)
    focusAfterMenuTab(screen.getByRole('button', { name: 'Last' }), false)
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
    focusAfterMenuTab(screen.getByRole('button', { name: 'First' }), true)
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
  })
})
