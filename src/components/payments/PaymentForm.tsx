import { useState } from 'react'
import { X } from 'lucide-react'
import type { Payment, Client } from '../../types'

interface PaymentFormProps {
  initial?: Payment
  clients: Client[]
  onSubmit: (data: Omit<Payment, 'id'>) => void
  onClose: () => void
}

export default function PaymentForm({ initial, clients, onSubmit, onClose }: PaymentFormProps) {
  const [clientId, setClientId] = useState<number>(initial?.clientId ?? clients[0]?.id ?? 0)
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? '')
  const [currency, setCurrency] = useState<Payment['currency']>(initial?.currency ?? 'MDL')
  const [period, setPeriod] = useState(initial?.period ?? '')
  const [status, setStatus] = useState<Payment['status']>(initial?.status ?? 'unpaid')
  const [date, setDate] = useState(
    initial?.date
      ? new Date(initial.date).toISOString().split('T')[0]
      : ''
  )
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const handleSubmit = () => {
    if (!amount || !period || !date || !clientId) return
    onSubmit({
      clientId,
      amount: Number(amount),
      currency,
      period,
      status,
      date: new Date(date),
      notes,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initial ? 'Edit Payment' : 'New Payment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Client */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
          <select
            value={clientId}
            onChange={e => setClientId(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} · {c.brand}</option>
            ))}
          </select>
        </div>

        {/* Amount + Currency */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 3000"
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
            <div className="flex gap-2">
              {(['MDL', 'USD'] as Payment['currency'][]).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currency === c
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Period */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Period</label>
          <input
            value={period}
            onChange={e => setPeriod(e.target.value)}
            placeholder="e.g. April 2026"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <div className="flex gap-2">
            {(['paid', 'unpaid', 'partial'] as Payment['status'][]).map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors capitalize ${
                  status === s
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            rows={3}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || !period || !date || !clientId}
            className="flex-1 py-2.5 rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-gray-900 text-sm font-medium transition-colors"
          >
            {initial ? 'Save Changes' : 'Add Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}