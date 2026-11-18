function parseDateKey(value) {
  if (value == null || value === '') return null

  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (match) {
      const year = Number(match[1])
      const month = Number(match[2])
      const day = Number(match[3])
      const date = new Date(year, month - 1, day, 12)

      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        return value
      }

      return null
    }
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDate(value) {
  const dateKey = parseDateKey(value)
  if (!dateKey) return null

  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

export function formatInvoiceDate(value, options = {}) {
  const date = parseDate(value)
  if (!date) return null

  return new Intl.DateTimeFormat('fr-FR', options).format(date)
}

export function toDateInputValue(value = new Date()) {
  return parseDateKey(value) || ''
}

export function addDaysToDateInputValue(days, from = new Date()) {
  if (!Number.isInteger(days)) {
    throw new RangeError('Le nombre de jours doit être un entier.')
  }

  const date = parseDate(from)
  if (!date) {
    throw new RangeError('La date de départ est invalide.')
  }

  date.setDate(date.getDate() + days)
  return toDateInputValue(date)
}

export function createInvoiceNumber(date = new Date(), uniqueId = globalThis.crypto?.randomUUID?.()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new RangeError('La date de facturation est invalide.')
  }
  const suffix = String(uniqueId || '').replace(/-/g, '').slice(0, 16).toUpperCase()
  if (suffix.length !== 16) {
    throw new RangeError('Un identifiant unique est nécessaire pour numéroter la facture.')
  }
  return `FAC-${date.getFullYear()}-${suffix}`
}

export function getInvoiceDraftError({ clientId, issueDate, dueDate, lines, taxRate }) {
  if (!clientId) return 'Sélectionnez un client.'
  const issueDateKey = parseDateKey(issueDate)
  const dueDateKey = parseDateKey(dueDate)
  if (!issueDateKey) return 'La date d’émission est invalide.'
  if (!dueDateKey) return 'La date d’échéance est obligatoire.'
  if (dueDateKey < issueDateKey) return 'La date d’échéance doit être égale ou postérieure à la date d’émission.'

  const describedLines = (Array.isArray(lines) ? lines : []).filter((line) => line.description?.trim())
  if (!describedLines.length) return 'Ajoutez au moins une ligne avec une description.'
  for (const line of describedLines) {
    const quantity = Number(line.quantity)
    const unitPrice = Number(line.unit_price)
    if (!Number.isFinite(quantity) || quantity <= 0) return 'La quantité doit être supérieure à zéro.'
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return 'Le prix unitaire ne peut pas être négatif.'
  }

  const rate = Number(taxRate)
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) return 'Le taux de TVA doit être compris entre 0 et 100 %.'
  const subtotal = describedLines.reduce((sum, line) => sum + Number(line.quantity) * Number(line.unit_price), 0)
  if (!Number.isFinite(subtotal) || !Number.isSafeInteger(Math.round(subtotal))) {
    return 'Le montant de la facture dépasse la limite autorisée.'
  }
  return ''
}

export function getInvoiceStatus(invoice, today = new Date()) {
  if (!invoice || (invoice.status !== 'sent' && invoice.status !== 'overdue')) {
    return invoice?.status
  }

  const dueDate = parseDateKey(invoice.due_date)
  const todayKey = parseDateKey(today)
  if (!dueDate || !todayKey) return invoice.status

  return dueDate < todayKey ? 'overdue' : 'sent'
}

function sumAmounts(invoices) {
  return invoices.reduce((sum, invoice) => {
    const amount = Number(invoice.total_amount)
    return sum + (Number.isFinite(amount) ? amount : 0)
  }, 0)
}

export function computeDashboardKpis(invoices, now = new Date()) {
  const today = parseDateKey(now)
  if (!today) {
    throw new RangeError('La date de calcul est invalide.')
  }

  const startOfMonth = today.slice(0, 7)
  const last30Days = new Date(now.getTime())
  last30Days.setDate(last30Days.getDate() - 30)

  const paidThisMonth = invoices.filter((invoice) => {
    if (invoice.status !== 'paid' || !invoice.paid_at) return false
    return parseDateKey(invoice.paid_at)?.slice(0, 7) === startOfMonth
  })

  const pendingInvoices = invoices.filter((invoice) => getInvoiceStatus(invoice, now) === 'sent')
  const overdueInvoices = invoices.filter((invoice) => getInvoiceStatus(invoice, now) === 'overdue')
  const recentSentOrPaid = invoices.filter((invoice) => {
    const createdAt = invoice.created_at ? new Date(invoice.created_at) : null
    if (!createdAt || Number.isNaN(createdAt.getTime()) || createdAt < last30Days) return false

    const status = getInvoiceStatus(invoice, now)
    return status === 'paid' || status === 'overdue'
  })
  const paidOnTime = recentSentOrPaid.filter((invoice) => {
    if (invoice.status !== 'paid' || !invoice.paid_at || !invoice.due_date) return false
    const paidDate = parseDateKey(invoice.paid_at)
    const dueDate = parseDateKey(invoice.due_date)
    return paidDate && dueDate && paidDate <= dueDate
  })

  return {
    encaisse: sumAmounts(paidThisMonth),
    attente: sumAmounts(pendingInvoices),
    retard: sumAmounts(overdueInvoices),
    tauxRecouvrement: recentSentOrPaid.length
      ? Math.round((paidOnTime.length / recentSentOrPaid.length) * 100)
      : 0,
  }
}

export function computeMonthlyInvoiceTotals(invoices, now = new Date()) {
  const buckets = []

  for (let offset = 5; offset >= 0; offset--) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    buckets.push({ year: date.getFullYear(), month: date.getMonth(), total: 0 })
  }

  invoices.forEach((invoice) => {
    if (invoice.status !== 'paid' || !invoice.paid_at) return

    const paidAt = parseDateKey(invoice.paid_at)
    if (!paidAt) return
    const [year, month] = paidAt.split('-').map(Number)

    const bucket = buckets.find(
      (item) => item.year === year && item.month === month - 1
    )
    if (bucket) {
      const amount = Number(invoice.total_amount)
      if (Number.isFinite(amount)) bucket.total += amount
    }
  })

  return buckets
}
