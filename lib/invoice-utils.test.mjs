import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addDaysToDateInputValue,
  computeDashboardKpis,
  computeMonthlyInvoiceTotals,
  createInvoiceNumber,
  formatInvoiceDate,
  getInvoiceDraftError,
  getInvoiceStatus,
  toDateInputValue,
} from './invoice-utils.mjs'

test('creates a date-prefixed invoice number from a unique identifier', () => {
  const date = new Date(2026, 0, 1, 12)
  assert.equal(createInvoiceNumber(date, 'abcdef12-3456-7890'), 'FAC-2026-ABCDEF1234567890')
  assert.notEqual(
    createInvoiceNumber(date, 'abcdef12-3456-7890'),
    createInvoiceNumber(date, '12345678-abcd-ef00')
  )
})

test('rejects invalid invoice quantities, negative prices, and invalid dates', () => {
  const validDraft = {
    clientId: 'client-1',
    issueDate: '2026-11-10',
    dueDate: '2026-11-12',
    lines: [{ description: 'Prestation', quantity: 1, unit_price: 20000 }],
    taxRate: 18,
  }

  assert.equal(getInvoiceDraftError(validDraft), '')
  assert.match(getInvoiceDraftError({
    ...validDraft,
    lines: [{ ...validDraft.lines[0], quantity: 0 }],
  }), /quantité/)
  assert.match(getInvoiceDraftError({
    ...validDraft,
    lines: [{ ...validDraft.lines[0], unit_price: -20000 }],
  }), /négatif/)
  assert.match(getInvoiceDraftError({ ...validDraft, dueDate: '2026-11-09' }), /postérieure/)
})

test('preserves date-only values when formatting and creating date inputs', () => {
  assert.equal(formatInvoiceDate('2026-03-10'), '10/03/2026')
  assert.equal(formatInvoiceDate(null), null)
  assert.equal(toDateInputValue(new Date(2026, 2, 10, 0)), '2026-03-10')
})

test('adds days using the local calendar across month and year boundaries', () => {
  assert.equal(addDaysToDateInputValue(14, new Date(2026, 11, 24, 12)), '2027-01-07')
})

test('derives overdue status from the due date without changing terminal states', () => {
  const today = new Date(2026, 10, 12, 12)

  assert.equal(getInvoiceStatus({ status: 'sent', due_date: '2026-11-11' }, today), 'overdue')
  assert.equal(getInvoiceStatus({ status: 'sent', due_date: '2026-11-12' }, today), 'sent')
  assert.equal(getInvoiceStatus({ status: 'overdue', due_date: '2026-11-13' }, today), 'sent')
  assert.equal(getInvoiceStatus({ status: 'paid', due_date: '2026-11-01' }, today), 'paid')
  assert.equal(getInvoiceStatus({ status: 'cancelled', due_date: '2026-11-01' }, today), 'cancelled')
  assert.equal(getInvoiceStatus({ status: 'draft', due_date: '2026-11-01' }, today), 'draft')
})

test('calculates dashboard totals from paid dates and current due dates', () => {
  const now = new Date(2026, 10, 12, 12)
  const invoices = [
    {
      status: 'paid',
      total_amount: 236000,
      paid_at: '2026-11-05T12:00:00.000Z',
      due_date: '2026-11-10',
      created_at: '2026-11-05T12:00:00.000Z',
    },
    {
      status: 'sent',
      total_amount: 40000,
      due_date: '2026-11-11',
      created_at: '2026-11-01T12:00:00.000Z',
    },
    {
      status: 'sent',
      total_amount: 20000,
      due_date: '2026-11-12',
      created_at: '2026-11-10T12:00:00.000Z',
    },
    {
      status: 'paid',
      total_amount: 50000,
      due_date: '2026-11-10',
      created_at: '2026-10-01T12:00:00.000Z',
    },
    {
      status: 'paid',
      total_amount: 80000,
      paid_at: '2026-10-31T12:00:00.000Z',
      due_date: '2026-10-30',
      created_at: '2026-10-01T12:00:00.000Z',
    },
    {
      status: 'cancelled',
      total_amount: 90000,
      due_date: '2026-11-01',
      created_at: '2026-11-01T12:00:00.000Z',
    },
  ]

  assert.deepEqual(computeDashboardKpis(invoices, now), {
    encaisse: 236000,
    attente: 20000,
    retard: 40000,
    tauxRecouvrement: 50,
  })
})

test('groups paid invoices into the six displayed calendar months', () => {
  const invoices = [
    { status: 'paid', total_amount: 236000, paid_at: '2026-11-05T12:00:00.000Z' },
    { status: 'sent', total_amount: 50000, paid_at: '2026-11-06T12:00:00.000Z' },
  ]

  assert.deepEqual(
    computeMonthlyInvoiceTotals(invoices, new Date(2026, 10, 12, 12)).map(({ total }) => total),
    [0, 0, 0, 0, 0, 236000]
  )
})
