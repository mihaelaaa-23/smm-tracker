import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2 } from 'lucide-react'
import type { Task, Client } from '../../types'

interface KanbanCardProps {
    task: Task
    client?: Client
    onEdit: (task: Task) => void
    onDelete: (id: number) => void
    isDragging?: boolean
}

const priorityStyles: Record<Task['priority'], string> = {
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

const typeStyles: Record<Task['type'], string> = {
    post: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    story: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
    reel: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
    'content-plan': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export default function KanbanCard({ task, client, onEdit, onDelete, isDragging }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: task.id! })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const deadline = new Date(task.deadline)
    const isOverdue = deadline < new Date() && task.status !== 'done'

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-all cursor-grab active:cursor-grabbing ${isSortableDragging || isDragging
                    ? 'opacity-50 shadow-xl scale-105'
                    : 'hover:shadow-md'
                }`}
            {...attributes}
            {...listeners}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                    {task.title}
                </p>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                        onClick={e => { e.stopPropagation(); onEdit(task) }}
                        className="p-1 rounded-lg text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                    >
                        <Pencil size={12} />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onDelete(task.id!) }}
                        className="p-1 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 transition-all"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            {/* Client */}
            {client && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{client.name}</p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeStyles[task.type]}`}>
                    {task.type}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${priorityStyles[task.priority]}`}>
                    {task.priority}
                </span>
                {task.needsApproval && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                        Approval
                    </span>
                )}
            </div>

            {/* Deadline */}
            <p className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-600'}`}>
                {isOverdue ? 'Overdue · ' : ''}{deadline.toLocaleDateString('en-GB')}
            </p>
        </div>
    )
}