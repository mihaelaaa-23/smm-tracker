import { X, Trash2 } from 'lucide-react'

interface ActiveFilter {
  label: string
  onRemove: () => void
}

interface ActiveFiltersProps {
  filters: ActiveFilter[]
  onClearAll: () => void
}

export default function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300"
        >
          {filter.label}
          <button
            onClick={filter.onRemove}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={13} />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors underline underline-offset-2"
      >
        <Trash2 size={13} />
        Remove all filters
      </button>
    </div>
  )
}