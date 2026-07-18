import { describe, it, expect } from 'vitest'
import { ReceiptSchema, schemaFor } from './types'

describe('schemas', () => {
  it('validates a receipt', () => {
    const r = ReceiptSchema.parse({
      store_name: "Joe's",
      date: '2026-07-17',
      items: [{ name: 'Burger', quantity: 1, price: 12.5 }],
      subtotal: 12.5,
      tax: 1.6,
      tip: 2,
      total: 16.1,
    })
    expect(r.total).toBe(16.1)
  })

  it('schemaFor returns the receipt schema', () => {
    expect(() =>
      schemaFor('receipt').parse({
        store_name: 'x',
        date: 'd',
        items: [],
        subtotal: 0,
        tax: 0,
        tip: 0,
        total: 0,
      }),
    ).not.toThrow()
  })
})
