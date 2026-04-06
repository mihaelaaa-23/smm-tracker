import { Trash2, Pencil } from 'lucide-react'
import type { Payment, Client } from '../../types'

interface PaymentListProps {
    payments: Payment[]
    clients: Client[]
    onDelete: (id: number) => void
    onEdit: (payment: Payment) => void
}

const statusStyles: Record<Payment['status'], { dot: string; text: string; bg: string }> = {
    paid: {
        dot: 'bg-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    unpaid: {
        dot: 'bg-red-500',
        text: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-950/30',
    },
    partial: {
        dot: 'bg-yellow-500',
        text: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    },
}

export default function PaymentList({ payments, clients, onDelete, onEdit }: PaymentListProps) {
    if (payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                <p className="text-lg font-medium">No payments yet</p>
                <p className="text-sm mt-1">Add your first payment to get started</p>
            </div>
        )
    }

    // Group payments by client
    const grouped = clients
        .map(client => ({
            client,
            payments: payments.filter(p => p.clientId === client.id),
        }))
        .filter(g => g.payments.length > 0)

    return (
        <div className="flex flex-col gap-6">
            {grouped.map(({ client, payments: clientPayments }) => (
                <div
                    key={client.id}
                    className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
                >
                    {/* Client header */}
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{client.brand}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                            {clientPayments.length} {clientPayments.length === 1 ? 'payment' : 'payments'}
                        </span>
                    </div>

                    {/* Payments rows */}
                    <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                        {clientPayments.map(payment => {
                            const style = statusStyles[payment.status]
                            return (
                                <div
                                    key={payment.id}
                                    className="group px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                                >
                                    {/* Period */}
                                    <div className="w-36 shrink-0">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {payment.period}
                                        </span>
                                    </div>

                                    {/* Amount */}
                                    <div className="w-32 shrink-0">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {payment.amount.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                                            {payment.currency}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="w-24 shrink-0">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${style.text} ${style.bg}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                            {payment.status}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="w-24 shrink-0 hidden sm:block">
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {new Date(payment.date).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>

                                    {/* Notes */}
                                    <div className="flex-1 hidden md:block">
                                        {payment.notes && (
                                            <span className="text-xs text-gray-300 dark:text-gray-600 truncate">
                                                {payment.notes}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}