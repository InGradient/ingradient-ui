import { describe, expect, it } from 'vitest'
import { renderTokensCss } from '../globals/css-contract'
import { fontLeading, textRoles, typographyScale } from './typography'

describe('text roles', () => {
  it('match DESIGN.md §3 sizes and line heights', () => {
    const table = Object.fromEntries(Object.entries(textRoles).map(([k, v]) => [k, `${v.size}/${v.leading}`]))
    expect(table).toEqual({
      micro: '11px/16px',
      caption: '12px/16px',
      'body-sm': '13px/20px',
      body: '14px/20px',
      'title-sm': '16px/24px',
      title: '20px/28px',
      display: '24px/32px',
    })
  })

  it('equal the size tiers they replace, so migration changes no pixels', () => {
    expect(textRoles.caption.size).toBe(typographyScale.sizeXs)
    expect(textRoles['title-sm'].size).toBe(typographyScale.sizeXl)
    expect(textRoles.title.size).toBe(typographyScale.size3xl)
    expect(textRoles.display.size).toBe(typographyScale.size5xl)
    expect(textRoles.micro.leading).toBe(fontLeading['3xs'])
  })

  it('emit size and leading variables', () => {
    const css = renderTokensCss().replace(/\s/g, '')
    expect(css).toContain('--ig-text-body-sm:13px')
    expect(css).toContain('--ig-text-body-sm-leading:20px')
    expect(css).toContain('--ig-text-display-leading:32px')
  })
})
