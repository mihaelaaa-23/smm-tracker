import { useQuery } from '@tanstack/react-query'
import { clientsDB, tasksDB, paymentsDB, formatPeriod } from '../db'
import { Users, CheckSquare, CreditCard, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const { data: clients = [] } = useQuery({
        queryKey: ['clients'],
        queryFn: clientsDB.getAll,
    })

    const { data: tasks = [] } = useQuery({
        queryKey: ['tasks'],
        queryFn: tasksDB.getAll,
    })

    const { data: payments = [] } = useQuery({
        queryKey: ['payments'],
        queryFn: paymentsDB.getAll,
    })

    const activeClients = clients.filter(c => c.status === 'active').length
    const pendingTasks = tasks.filter(t => t.status !== 'done').length
    const currentMonthPayments = payments.filter(p => p.month === currentMonth && p.year === currentYear)
    const unpaidCount = currentMonthPayments.filter(p => p.status !== 'paid').length
    const collectedMDL = currentMonthPayments
        .filter(p => p.currency === 'MDL' && p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0)
    const collectedUSD = currentMonthPayments
        .filter(p => p.currency === 'USD' && p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0)

    const stats = [
        {
            label: 'Active Clients',
            value: String(activeClients),
            sub: `${clients.length} total`,
            highlight: false,
        },
        {
            label: 'Pending Tasks',
            value: String(pendingTasks),
            sub: `${tasks.length} total`,
            highlight: false,
        },
        {
            label: 'Collected',
            value: collectedMDL > 0 ? `${collectedMDL.toLocaleString()} MDL` : collectedUSD > 0 ? `${collectedUSD} USD` : '—',
            sub: formatPeriod(currentMonth, currentYear),
            highlight: false,
        },
        {
            label: 'Unpaid',
            value: String(unpaidCount),
            sub: 'this month',
            highlight: unpaidCount > 0,
        },
    ]

    return (
        <div className="flex flex-col gap-8">

            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
                    >
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            {stat.label}
                        </span>
                        <span className={`text-3xl font-bold tracking-tight ${stat.highlight
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                            {stat.value}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {stat.sub}
                        </span>
                    </div>
                ))}
            </div>

            {/* Placeholder for charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 h-64 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Revenue chart — coming next</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 h-64 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Payment status chart — coming next</p>
                </div>
            </div>

            {/* Placeholder for lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 h-48 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Tasks due this week — coming next</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 h-48 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Unpaid payments — coming next</p>
                </div>
            </div>
        </div>
    )
}