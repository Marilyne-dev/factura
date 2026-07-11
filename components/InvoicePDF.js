"use client"

import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

const formatXOF = (amount) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(amount || 0)) + ' XOF'

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—')

const STATUS_LABELS = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  overdue: 'En retard',
  paid: 'Payée',
  cancelled: 'Annulée',
}

export default function InvoicePDF({ company, invoice, client, items }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {company?.logo_url ? (
              <Image src={company.logo_url} style={styles.logo} />
            ) : (
              <Text style={styles.companyName}>{company?.name || 'Votre entreprise'}</Text>
            )}
            {company?.logo_url && <Text style={styles.companyName}>{company?.name}</Text>}
            {company?.address && <Text style={styles.smallText}>{company.address}</Text>}
            {company?.phone && <Text style={styles.smallText}>{company.phone}</Text>}
            {company?.country && <Text style={styles.smallText}>{company.country}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceLabel}>FACTURE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <Text style={styles.statusBadge}>{STATUS_LABELS[invoice.status] || invoice.status}</Text>
          </View>
        </View>

        {/* Infos client / dates */}
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Facturé à</Text>
            <Text style={styles.metaValue}>{client?.full_name || 'Client'}</Text>
            {client?.company_name && <Text style={styles.smallText}>{client.company_name}</Text>}
            {client?.email && <Text style={styles.smallText}>{client.email}</Text>}
            {client?.whatsapp_number && <Text style={styles.smallText}>{client.whatsapp_number}</Text>}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Date d&apos;émission</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.issue_date)}</Text>
            <Text style={[styles.metaLabel, { marginTop: 8 }]}>Date d&apos;échéance</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.due_date)}</Text>
          </View>
        </View>

        {/* Tableau des lignes */}
        <View style={styles.table}>
          <View style={styles.tableHeadRow}>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>
            <Text style={[styles.th, styles.colQty]}>Qté</Text>
            <Text style={[styles.th, styles.colPrice]}>Prix unitaire</Text>
            <Text style={[styles.th, styles.colTotal]}>Sous-total</Text>
          </View>
          {items.map((line) => (
            <View style={styles.tableRow} key={line.id}>
              <Text style={[styles.td, styles.colDesc]}>{line.description}</Text>
              <Text style={[styles.td, styles.colQty]}>{line.quantity}</Text>
              <Text style={[styles.td, styles.colPrice]}>{formatXOF(line.unit_price)}</Text>
              <Text style={[styles.td, styles.colTotal]}>
                {formatXOF(line.quantity * line.unit_price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totaux */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Sous-total HT</Text>
            <Text style={styles.totalsValue}>{formatXOF(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Taxe ({invoice.tax_rate || 0}%)</Text>
            <Text style={styles.totalsValue}>{formatXOF(invoice.tax_amount)}</Text>
          </View>
          <View style={[styles.totalsRow, styles.totalsFinal]}>
            <Text style={styles.totalsFinalLabel}>Total TTC</Text>
            <Text style={styles.totalsFinalValue}>{formatXOF(invoice.total_amount)}</Text>
          </View>
        </View>

        {/* Coordonnées de paiement */}
        {(company?.bank_details || company?.mobile_money_number) && (
          <View style={styles.paymentBlock}>
            <Text style={styles.metaLabel}>Coordonnées de paiement</Text>
            {company?.bank_details && <Text style={styles.smallText}>{company.bank_details}</Text>}
            {company?.mobile_money_number && (
              <Text style={styles.smallText}>Mobile Money : {company.mobile_money_number}</Text>
            )}
          </View>
        )}

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesBlock}>
            <Text style={styles.metaLabel}>Note</Text>
            <Text style={styles.smallText}>{invoice.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Facture générée via Factura — {company?.name || ''}
        </Text>
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  headerLeft: { flexDirection: 'column', maxWidth: 280 },
  logo: { width: 90, height: 50, objectFit: 'contain', marginBottom: 8 },
  companyName: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  headerRight: { alignItems: 'flex-end' },
  invoiceLabel: { fontSize: 11, letterSpacing: 2, color: '#666', marginBottom: 4 },
  invoiceNumber: { fontSize: 16, fontWeight: 700, marginBottom: 6 },
  statusBadge: {
    fontSize: 9, fontWeight: 700, backgroundColor: '#f0f0f0',
    color: '#333', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10,
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  metaBlock: { maxWidth: 250 },
  metaLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 4 },
  metaValue: { fontSize: 11, fontWeight: 700 },
  smallText: { fontSize: 9.5, color: '#444', marginBottom: 2, lineHeight: 1.4 },

  table: { marginBottom: 20, borderTop: '1pt solid #ddd' },
  tableHeadRow: {
    flexDirection: 'row', paddingVertical: 8, borderBottom: '1pt solid #ddd',
    backgroundColor: '#f7f7f7',
  },
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottom: '0.5pt solid #eee' },
  th: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#666' },
  td: { fontSize: 10 },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 1.4, textAlign: 'right' },
  colTotal: { flex: 1.4, textAlign: 'right' },

  totalsBlock: { alignSelf: 'flex-end', width: 220, marginBottom: 20 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalsLabel: { fontSize: 9.5, color: '#666' },
  totalsValue: { fontSize: 9.5 },
  totalsFinal: { borderTop: '1pt solid #ddd', marginTop: 4, paddingTop: 8 },
  totalsFinalLabel: { fontSize: 11, fontWeight: 700 },
  totalsFinalValue: { fontSize: 11, fontWeight: 700 },

  paymentBlock: { marginBottom: 16 },
  notesBlock: { marginBottom: 16 },

  footer: {
    position: 'absolute', bottom: 30, left: 40, right: 40,
    fontSize: 8, color: '#aaa', textAlign: 'center',
  },
})