import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { paymentsDB, clientsDB } from '../db'
import PaymentList from '../components/payments/PaymentList'
import PaymentForm from '../components/payments/PaymentForm'
import PaymentSummary from '../components/payments/PaymentSummary'
import FilterDropdown from '../components/ui/FilterDropdown'
import ActiveFilters from '../components/ui/ActiveFilters'
import type { Payment } from '../types'

type FilterStatus = 'all' | 'paid' | 'unpaid' | 'partial'
type FilterCurrency = 'all' | 'MDL' | 'USD'

export default function PaymentsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Payment | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterCurrency, setFilterCurrency] = useState<FilterCurrency>('all')
  const [filterClient, setFilterClient] = useState<number | 'all'>('all')

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsDB.getAll,
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsDB.getAll,
  })

  const addMutation = useMutation({
    mutationFn: (data: Omit<Payment, 'id'>) => paymentsDB.add(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: Partial<Payment> }) =>
      paymentsDB.update(id, changes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => paymentsDB.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }),
  })

  const handleSubmit = (data: Omit<Payment, 'id'>) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id!, changes: data })
    } else {
      addMutation.mutate(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (payment: Payment) => {
    setEditing(payment)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Delete this payment?')) {
      deleteMutation.mutate(id)
    }
  }

  const clientOptions = [
    { value: 'all', label: 'All clients' },
    ...clients.map(c => ({ value: c.id!, label: c.name })),
  ]

  const filtered = payments
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => filterCurrency === 'all' || p.currency === filterCurrency)
    .filter(p => filterClient === 'all' || p.clientId === filterClient)

  return (
    <div className="flex flex-col gap-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {payments.length} total · {payments.filter(p => p.status === 'unpaid').length} unpaid
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Payment
        </button>
      </div>

      {/* Summary */}
      <PaymentSummary payments={payments} />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          label="Status"
          value={filterStatus}
          onChange={v => setFilterStatus(v as FilterStatus)}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'paid', label: 'Paid' },
            { value: 'unpaid', label: 'Unpaid' },
            { value: 'partial', label: 'Partial' },
          ]}
        />
        <FilterDropdown
          label="Currency"
          value={filterCurrency}
          onChange={v => setFilterCurrency(v as FilterCurrency)}
          options={[
            { value: 'all', label: 'All currencies' },
            { value: 'MDL', label: 'MDL' },
            { value: 'USD', label: 'USD' },
          ]}
        />
        <FilterDropdown
          label="Client"
          value={filterClient}
          onChange={v => setFilterClient(v === 'all' ? 'all' : Number(v))}
          options={clientOptions}
        />
      </div>

      {/* Active filters */}
      <ActiveFilters
        filters={[
          ...(filterStatus !== 'all' ? [{ label: filterStatus, onRemove: () => setFilterStatus('all') }] : []),
          ...(filterCurrency !== 'all' ? [{ label: filterCurrency, onRemove: () => setFilterCurrency('all') }] : []),
          ...(filterClient !== 'all' ? [{
            label: clients.find(c => c.id === filterClient)?.name ?? '',
            onRemove: () => setFilterClient('all')
          }] : []),
        ]}
        onClearAll={() => {
          setFilterStatus('all')
          setFilterCurrency('all')
          setFilterClient('all')
        }}
      />

      {/* List */}
      {isLoading ? (
        <div className="text-sm text-gray-400 dark:text-gray-600">Loading...</div>
      ) : (
        <PaymentList
          payments={filtered}
          clients={clients}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {/* Modal */}
      {showForm && (
        <PaymentForm
          initial={editing ?? undefined}
          clients={clients}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}