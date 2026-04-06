import { Trash2, Pencil } from 'lucide-react'
import type { Task, Client } from '../../types'

interface TaskCardProps {
  task: Task
  client?: Client
  onDelete: (id: number) => void
  onEdit: (task: Task) => void
  onStatusChange: (id: number, status: Task['status']) => void
}

const priorityStyles: Record<Task['priority'], string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const typeStyles: Record<Task['type'], string> = {
  post: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  story: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  reel: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'content-plan': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const statusOptions: Task['status'][] = ['todo', 'in-progress', 'done']

export default function TaskCard({ task, client, onDelete, onEdit, onStatusChange }: TaskCardProps) {
  const deadline = new Date(task.deadline)
  const isOverdue = deadline < new Date() && task.status !== 'done'

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h3>
          {client && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{client.name} · {client.brand}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id!)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${typeStyles[task.type]}`}>
          {task.type}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        {task.needsApproval && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            Needs approval
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
          {isOverdue ? 'Overdue · ' : ''}{deadline.toLocaleDateString('en-GB')}
        </span>
        <select
          value={task.status}
          onChange={e => onStatusChange(task.id!, e.target.value as Task['status'])}
          className="text-xs font-medium px-2.5 py-1 rounded-full border-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  )
}