import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Star } from 'lucide-react'
import { clientsDB, tasksDB, paymentsDB } from '../db'

const platformColors: Record<string, string> = {
  Instagram: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
  TikTok: 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300',
  Facebook: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  LinkedIn: 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const clientId = Number(id)

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientsDB.getAll().then(clients => clients.find(c => c.id === clientId)),
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', clientId],
    queryFn: () => tasksDB.getByClient(clientId),
  })

  const { data: payments = [] } = useQuery({
    queryKey: ['payments', clientId],
    queryFn: () => paymentsDB.getByClient(clientId),
  })

  if (isLoading) return <div className="text-sm text-gray-400">Loading...</div>
  if (!client) return <div className="text-sm text-gray-400">Client not found.</div>

  return (
    <div className="flex flex-col gap-8">

      {/* Back + header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Back to clients
        </button>

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
              {client.priority && (
                <Star size={16} className="text-amber-400" fill="currentColor" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{client.brand}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                client.status === 'active'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-gray-500'
              }`}>
                {client.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              {client.platforms.map(p => (
                <span key={p} className={`text-xs font-medium px-2.5 py-1 rounded-full ${platformColors[p]}`}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {client.notes && (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">{client.notes}</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-zinc-800" />

      {/* Tasks section — placeholder */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Tasks · {tasks.length}
        </p>
        <p className="text-sm text-gray-400">Coming in next commit</p>
      </div>

      {/* Payments section — placeholder */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Payments · {payments.length}
        </p>
        <p className="text-sm text-gray-400">Coming in next commit</p>
      </div>
    </div>
  )
}