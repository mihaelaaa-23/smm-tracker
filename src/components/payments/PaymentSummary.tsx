import type { Payment } from '../../types'

interface PaymentSummaryProps {
  payments: Payment[]
}

export default function PaymentSummary({ payments }: PaymentSummaryProps) {
  const totalMDL = payments
    .filter(p => p.currency === 'MDL')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalUSD = payments
    .filter(p => p.currency === 'USD')
    .reduce((sum, p) => sum + p.amount, 0)

  const paidMDL = payments
    .filter(p => p.currency === 'MDL' && p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const paidUSD = payments
    .filter(p => p.currency === 'USD' && p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const unpaidCount = payments.filter(p => p.status === 'unpaid').length
  const partialCount = payments.filter(p => p.status === 'partial').length

  const stats = [
    {
      label: 'Total MDL',
      value: `${totalMDL.toLocaleString()} MDL`,
      sub: `${paidMDL.toLocaleString()} collected`,
      highlight: false,
    },
    {
      label: 'Total USD',
      value: `${totalUSD.toLocaleString()} USD`,
      sub: `${paidUSD.toLocaleString()} collected`,
      highlight: false,
    },
    {
      label: 'Pending',
      value: `${unpaidCount + partialCount}`,
      sub: `${unpaidCount} unpaid · ${partialCount} partial`,
      highlight: unpaidCount + partialCount > 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(stat => (
        <div
          key={stat.label}
          className={`rounded-2xl p-5 border flex flex-col gap-1 ${
            stat.highlight
              ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
              : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)]'
          }`}
        >
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            {stat.label}
          </span>
          <span className={`text-2xl font-bold ${
            stat.highlight
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {stat.value}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {stat.sub}
          </span>
        </div>
      ))}
    </div>
  )
}