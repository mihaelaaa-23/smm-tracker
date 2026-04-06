import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { tasksDB, clientsDB } from '../db'
import TaskList from '../components/tasks/TaskList'
import TaskForm from '../components/tasks/TaskForm'
import type { Task } from '../types'

type FilterStatus = 'all' | 'todo' | 'in-progress' | 'done'
type FilterPriority = 'all' | 'low' | 'medium' | 'high'

export default function TasksPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all')
  const [filterClient, setFilterClient] = useState<number | 'all'>('all')

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksDB.getAll,
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsDB.getAll,
  })

  const addMutation = useMutation({
    mutationFn: (data: Omit<Task, 'id'>) => tasksDB.add(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: Partial<Task> }) =>
      tasksDB.update(id, changes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tasksDB.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const handleSubmit = (data: Omit<Task, 'id' | 'createdAt'>) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id!, changes: data })
    } else {
      addMutation.mutate({ ...data, createdAt: new Date() })
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (task: Task) => {
    setEditing(task)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Delete this task?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleStatusChange = (id: number, status: Task['status']) => {
    updateMutation.mutate({ id, changes: { status } })
  }

  const filtered = tasks
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .filter(t => filterClient === 'all' || t.clientId === filterClient)

  return (
    <div className="flex flex-col gap-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {tasks.length} total · {tasks.filter(t => t.status !== 'done').length} pending
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'todo', 'in-progress', 'done'] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                filterStatus === s
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'low', 'medium', 'high'] as FilterPriority[]).map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                filterPriority === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Client filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterClient('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterClient === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All clients
          </button>
          {clients.map(c => (
            <button
              key={c.id}
              onClick={() => setFilterClient(c.id!)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterClient === c.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-sm text-gray-400 dark:text-gray-600">Loading...</div>
      ) : (
        <TaskList
          tasks={filtered}
          clients={clients}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modal */}
      {showForm && (
        <TaskForm
          initial={editing ?? undefined}
          clients={clients}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}