import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'
import { GlassPanel } from './GlassPanel'

describe('ui primitives', () => {
  it('Button renders label and is >=44px tall', () => {
    render(<Button>Settle Up</Button>)
    const btn = screen.getByRole('button', { name: 'Settle Up' })
    expect(btn.className).toMatch(/min-h-\[44px\]/)
  })

  it('GlassPanel renders children', () => {
    render(
      <GlassPanel>
        <span>hi</span>
      </GlassPanel>,
    )
    expect(screen.getByText('hi')).toBeTruthy()
  })
})
