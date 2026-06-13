'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/api'
import Loading from '@/components/Loading'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import {
    ArrowLeftIcon, ShoppingCartIcon, CircleDollarSignIcon,
    TrendingUpIcon, CreditCardIcon
} from 'lucide-react'
import {
    SpendingOverTimeChart, OrderStatusChart, PaymentMethodChart
} from '@/components/admin/UserAnalyticsCharts'

export default function UserAnalyticsDetail() {
    const { userId } = useParams()
    const router = useRouter()
    const { symbol: currencySymbol, rate: currencyRate, code: currencyCode } = useSelector(state => state.currency)

    const [loading, setLoading] = useState(true)
    const [analytics, setAnalytics] = useState(null)
    const [clerkUser, setClerkUser] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getUserAnalytics(userId)
                if (res.success) setAnalytics(res.analytics)
            } catch (error) {
                toast.error(error.message)
            }

            // Fetch Clerk user info
            try {
                const res = await fetch(`/api/clerk-users?userId=${userId}`)
                const data = await res.json()
                if (data.user) setClerkUser(data.user)
            } catch { /* Optional Clerk data */ }

            setLoading(false)
        }
        fetchData()
    }, [userId])

    if (loading) return <Loading />

    const fmt = (val) => {
        const converted = Number(val) * currencyRate
        if (currencyCode === 'USD') {
            return currencySymbol + converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
        return currencySymbol + converted.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }

    const userName = clerkUser
        ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
        : userId.slice(0, 16) + '…'

    const STATUS_BADGE = {
        ORDER_PLACED: 'bg-indigo-50 text-indigo-600',
        PROCESSING:   'bg-amber-50 text-amber-600',
        SHIPPED:      'bg-blue-50 text-blue-600',
        DELIVERED:    'bg-emerald-50 text-emerald-600',
        CANCELLED:    'bg-red-50 text-red-600',
    }

    const statCards = [
        {
            title: 'Total Orders',
            value: analytics?.totalOrders || 0,
            icon: ShoppingCartIcon,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
        },
        {
            title: 'Total Spent',
            value: fmt(analytics?.totalSpent || 0),
            icon: CircleDollarSignIcon,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
        },
        {
            title: 'Avg Order Value',
            value: fmt(analytics?.avgOrderValue || 0),
            icon: TrendingUpIcon,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            border: 'border-violet-100',
        },
        {
            title: 'Preferred Payment',
            value: analytics?.preferredPayment || 'N/A',
            icon: CreditCardIcon,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
        },
    ]

    return (
        <div className="text-slate-500 mb-10">
            {/* ── Back + User Header ── */}
            <button
                onClick={() => router.push('/admin/users')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition mb-5"
            >
                <ArrowLeftIcon size={16} />
                Back to Users
            </button>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 ring-2 ring-indigo-100">
                    {clerkUser?.imageUrl ? (
                        <Image src={clerkUser.imageUrl} alt={userName} width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-2xl">
                            {userName[0] || 'U'}
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl text-slate-800 font-semibold">{userName}</h1>
                    <p className="text-sm text-slate-400">{clerkUser?.email || userId}</p>
                    {clerkUser?.createdAt && (
                        <p className="text-xs text-slate-400 mt-0.5">
                            Joined {new Date(clerkUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    )}
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
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Spending Over Time */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
                    <h2 className="text-sm font-semibold text-slate-700 mb-1">Spending Over Time</h2>
                    <p className="text-xs text-slate-400 mb-4">Monthly spend and order frequency</p>
                    <SpendingOverTimeChart data={analytics?.spendingOverTime || []} currencySymbol={currencySymbol} />
                </div>

                {/* Order Status */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Order Status Breakdown</h2>
                    <OrderStatusChart data={analytics?.statusBreakdown || []} />
                </div>

                {/* Payment Split */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Payment Method Split</h2>
                    <PaymentMethodChart data={analytics?.paymentSplit || []} currencySymbol={currencySymbol} />
                </div>
            </div>

            {/* ── Recent Orders Table ── */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-700">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Order ID</th>
                                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider text-center">Items</th>
                                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider text-right">Amount</th>
                                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider text-center">Payment</th>
                                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider text-center">Status</th>
                                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(analytics?.recentOrders || []).map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/60 transition">
                                    <td className="px-5 py-3.5 text-xs font-mono text-slate-600">
                                        {String(order.id).slice(-8)}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-center text-slate-500">
                                        {order.itemCount}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-right font-semibold text-slate-700">
                                        {fmt(order.total)}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentMethod === 'STRIPE' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {order.paymentMethod === 'STRIPE' ? 'Online' : 'COD'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[order.status] || 'bg-slate-100 text-slate-500'}`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-center text-slate-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {(!analytics?.recentOrders || analytics.recentOrders.length === 0) && (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                                        No orders found for this user
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
