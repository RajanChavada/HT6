import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TemplateSwitch } from './TemplateSwitch'

const receipt = { store_name: 'Diner', date: 'd', items: [], subtotal: 0, tax: 0, tip: 0, total: 0 }

describe('TemplateSwitch', () => {
  it('renders BillSplitter for bill-splitter id', () => {
    render(<TemplateSwitch templateId="bill-splitter" data={receipt} />)
    expect(screen.getByText('Diner')).toBeTruthy()
  })

  it('renders GenericView for unknown id', () => {
    render(<TemplateSwitch templateId="generic-view" data={{ description: 'x', fields: {} }} />)
    expect(screen.getByText('x')).toBeTruthy()
  })
})
