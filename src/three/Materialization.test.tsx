import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// mock the 3D layer so jsdom never touches WebGL
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: () => {},
}))
vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Bloom: () => null,
}))

import { Materialization } from './Materialization'

describe('Materialization', () => {
  it('fires onComplete after durationMs', () => {
    vi.useFakeTimers()
    const done = vi.fn()
    render(<Materialization onComplete={done} durationMs={2500} />)
    expect(done).not.toHaveBeenCalled()
    vi.advanceTimersByTime(2600)
    expect(done).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })
})
