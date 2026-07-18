import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BillSplitter } from './BillSplitter'

const data = {
  store_name: 'Test Diner',
  date: '2026-07-17',
  items: [
    { name: 'Fries', quantity: 1, price: 10 },
    { name: 'Soda', quantity: 1, price: 5 },
  ],
  subtotal: 15,
  tax: 2,
  tip: 3,
  total: 20,
}

describe('BillSplitter', () => {
  it('renders store name and all items', () => {
    render(<BillSplitter data={data} />)
    expect(screen.getByText('Test Diner')).toBeTruthy()
    expect(screen.getByText('Fries')).toBeTruthy()
    expect(screen.getByText('Soda')).toBeTruthy()
  })

  it('shows the grand total', () => {
    render(<BillSplitter data={data} />)
    expect(screen.getAllByText(/20\.00/).length).toBeGreaterThan(0)
  })

  it('splits proportional tax+tip across default assignees', () => {
    // both items default to "You" => You owes the full 20.00, Friend owes 0.00
    render(<BillSplitter data={data} />)
    expect(screen.getByText('Settle $0.00')).toBeTruthy()
  })
})
