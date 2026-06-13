'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/api'
import Loading from '@/components/Loading'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import {
    UsersIcon, UserCheckIcon, CircleDollarSignIcon, ShoppingCartIcon,
    TrendingUpIcon, ArrowRightIcon, SearchIcon
} from 'lucide-react'
import {
    DailyActivityChart, TopSpendersChart, OrderDistributionChart
} from '@/components/admin/UserAnalyticsCharts'

export default function AdminUsersAnalytics() {
    const router = useRouter()
    const { symbol: currencySymbol, rate: currencyRate, code: currencyCode } = useSelector(state => state.currency)

    const [loading, setLoading] = useState(true)
    const [analytics, setAnalytics] = useState(null)
    const [clerkUsers, setClerkUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getUsersAnalytics()
                if (res.success) setAnalytics(res.analytics)
            } catch (error) {
                toast.error(error.message)
            }

            // Fetch Clerk users via Next.js API route
            try {
                const res = await fetch('/api/clerk-users')
                const data = await res.json()
                if (data.users) setClerkUsers(data.users)
            } catch { /* Clerk users optional */ }

            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) return <Loading />

    const fmt = (val) => {
        const converted = Number(val) * currencyRate
        if (currencyCode === 'USD') {
            return currencySymbol + converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
        return currencySymbol + converted.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }

    // Merge Clerk user data with analytics data
    const mergedUsers = (analytics?.userSummaries || []).map(u => {
        const clerk = clerkUsers.find(c => c.id === u.userId)
        return {
            ...u,
            name: clerk ? `${clerk.firstName || ''} ${clerk.lastName || ''}`.trim() : u.userId.slice(0, 12) + '…',
            email: clerk?.email || '—',
            image: clerk?.imageUrl || null,
            joinedAt: clerk?.createdAt || null,
        }
    })

    // Filter by search
    const filteredUsers = mergedUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.userId.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalClerkUsers = clerkUsers.length || analytics?.activeUsers || 0

    const statCards = [
        {
            title: 'Total Users',
            value: totalClerkUsers,
            icon: UsersIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            sub: 'Registered accounts',
        },
        {
            title: 'Active Users',
            value: analytics?.activeUsers || 0,
            icon: UserCheckIcon,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            sub: 'Users with orders',
        },
        {
            title: 'Total Spending',
            value: fmt(analytics?.totalSpending || 0),
            icon: CircleDollarSignIcon,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            border: 'border-violet-100',
            sub: 'All user spending',
        },
        {
            title: 'Avg Orders/User',
            value: analytics?.avgOrdersPerUser || 0,
            icon: ShoppingCartIcon,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            sub: 'Per active user',
        },
    ]

    return (
        <div className="text-slate-500 mb-10">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl text-slate-800 font-semibold">User Analytics</h1>
                    <p className="text-sm text-slate-400">Vercel-style insights across all users</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <TrendingUpIcon size={14} className="text-emerald-500" />
                    <span className="text-slate-500">{analytics?.totalOrders || 0} total orders tracked</span>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <div key={i} className={`flex items-center gap-4 bg-white border ${card.border} p-4 rounded-xl shadow-sm hover:shadow-md transition`}>
                        <div className={`${card.bg} ${card.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                            <card.icon size={22} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate-400 truncate">{card.title}</p>
                            <b className="text-lg font-bold text-slate-700 block truncate">{card.value}</b>
                            {card.sub && <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Daily Activity */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">Daily Activity</h2>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                                Orders
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                Revenue
                            </span>
                        </div>
                    </div>
                    <DailyActivityChart data={analytics?.dailyActivity || []} />
                </div>

                {/* Order Distribution */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Orders Distribution</h2>
                    <p className="text-xs text-slate-400 mb-2">Users grouped by number of orders placed</p>
                    <OrderDistributionChart data={analytics?.orderDistribution || []} />
                </div>

                {/* Top Spenders — Full Width */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Top 10 Spenders</h2>
                    <TopSpendersChart data={analytics?.topSpenders || []} currencySymbol={currencySymbol} />
                </div>
            </div>

            {/* ── Enhanced User Table ── */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-700">All Users</h2>
                    <div className="relative w-full sm:w-64">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider">User</th>
                                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Email</th>
                                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider text-center">Orders</th>
                                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider text-right">Total Spent</th>
                                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider text-center">Last Order</th>
                                <th className="px-5 py-3.5 font-medium text-xs uppercase tracking-wider text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.userId}
                                    className="hover:bg-indigo-50/40 transition cursor-pointer group"
                                    onClick={() => router.push(`/admin/users/${user.userId}`)}
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name} width={36} height={36} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-sm">
                                                        {user.name?.[0] || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-medium text-slate-800 text-sm">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-500">{user.email}</td>
                                    <td className="px-5 py-4 text-sm text-center">
                                        <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                                            {user.orderCount}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-right font-semibold text-slate-700">
                                        {fmt(user.totalSpent)}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-center text-slate-400">
                                        {user.lastOrder ? new Date(user.lastOrder).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <ArrowRightIcon size={14} className="text-slate-300 group-hover:text-indigo-500 transition mx-auto" />
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                                        {searchTerm ? 'No users match your search' : 'No active users found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
