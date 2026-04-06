import { Trash2, Pencil } from 'lucide-react'
import type { Payment, Client } from '../../types'

interface PaymentCardProps {
  payment: Payment
  client?: Client
  onDelete: (id: number) => void
  onEdit: (payment: Payment) => void
}

const statusStyles: Record<Payment['status'], string> = {
  paid: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  unpaid: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
  partial: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400',
}

export default function PaymentCard({ payment, client, onDelete, onEdit }: PaymentCardProps) {
  return (
    <div className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-200">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {client?.name ?? 'Unknown'}
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-400 font-medium">
            {client?.brand}
          </span>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(payment)}
            className="p-1.5 rounded-lg text-gray-300 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(payment.id!)}
            className="p-1.5 rounded-lg text-gray-300 dark:text-gray-500 hover:text-red-400 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {payment.amount.toLocaleString()}
        </span>
        <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
          {payment.currency}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-zinc-800">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[payment.status]}`}>
          {payment.status}
        </span>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs text-gray-400 dark:text-gray-400 font-medium">
            {payment.period}
          </span>
          {payment.notes && (
            <span className="text-xs text-gray-300 dark:text-gray-500 truncate max-w-[120px]">
              {payment.notes}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}