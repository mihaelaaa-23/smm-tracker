import type { Payment, Client } from '../../types'
import PaymentCard from './PaymentCard'

interface PaymentListProps {
  payments: Payment[]
  clients: Client[]
  onDelete: (id: number) => void
  onEdit: (payment: Payment) => void
}

export default function PaymentList({ payments, clients, onDelete, onEdit }: PaymentListProps) {
  const getClient = (clientId: number) => clients.find(c => c.id === clientId)

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
        <p className="text-lg font-medium">No payments yet</p>
        <p className="text-sm mt-1">Add your first payment to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {payments.map(payment => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          client={getClient(payment.clientId)}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}   