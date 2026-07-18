import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KanbanBoard } from './KanbanBoard'
import { GenericView } from './GenericView'

const wb = {
  columns: [
    { title: 'To Do', cards: ['Task A'] },
    { title: 'Done', cards: ['Task B'] },
  ],
}
const gen = { description: 'A business card', fields: { name: 'Ada', email: 'ada@x.io' } }

describe('fallback templates', () => {
  it('KanbanBoard renders columns and cards', () => {
    render(<KanbanBoard data={wb} />)
    expect(screen.getByText('To Do')).toBeTruthy()
    expect(screen.getByText('Task A')).toBeTruthy()
  })

  it('GenericView renders fields', () => {
    render(<GenericView data={gen} />)
    expect(screen.getByText(/Ada/)).toBeTruthy()
    expect(screen.getByText(/ada@x.io/)).toBeTruthy()
  })
})
