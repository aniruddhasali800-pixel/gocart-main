'use client'
import api from "@/lib/api"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import {
    CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon,
    CreditCardIcon, TruckIcon, PercentIcon, Clock
} from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Link from "next/link"
import { useSelector } from "react-redux"

export default function AdminDashboard() {
    const { symbol: currencySymbol, rate: currencyRate, code: currencyCode } = useSelector(state => state.currency)

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0, revenue: 0, orders: 0, stores: 0,
        onlineRevenue: 0, codRevenue: 0, commissionRevenue: 0,
        allOrders: [],
    })
    const [pendingSellers, setPendingSellers] = useState(0)

    const fetchDashboardData = async () => {
        try {
            const [dashRes, storeRes] = await Promise.all([
                api.getAdminDashboard(),
                api.getAllStores(),
            ])
            if (dashRes.success) setDashboardData(dashRes.dashboard)
            if (storeRes.success) {
                const pending = storeRes.stores.filter(s => s.status === 'pending').length
                setPendingSellers(pending)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchDashboardData() }, [])

    if (loading) return <Loading />

    const fmt = (val) => {
        const converted = Number(val) * currencyRate
        if (currencyCode === 'USD') {
            return currencySymbol + converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        } else {
            return currencySymbol + converted.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        }
    }

    const statCards = [
        {
            title: 'Total Products',
            value: dashboardData.products,
            icon: ShoppingBasketIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
        },
        {
            title: 'Total Orders',
            value: dashboardData.orders,
            icon: TagsIcon,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
        },
        {
            title: 'Active Stores',
            value: dashboardData.stores,
            icon: StoreIcon,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
        },
        {
            title: 'Total Revenue',
            value: fmt(dashboardData.revenue),
            icon: CircleDollarSignIcon,
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-100',
        },
        {
            title: 'Online Revenue',
            value: fmt(dashboardData.onlineRevenue),
            icon: CreditCardIcon,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            sub: 'Stripe / Card Payments',
        },
        {
            title: 'COD Revenue',
            value: fmt(dashboardData.codRevenue),
            icon: TruckIcon,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-100',
            sub: 'Cash on Delivery',
        },
        {
            title: 'Commission Earned',
            value: fmt(dashboardData.commissionRevenue),
            icon: PercentIcon,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100',
            sub: 'Platform Commission',
        },
    ]

    return (
        <div className="text-slate-500 mb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl text-slate-800 font-semibold">Admin Dashboard</h1>
                    <p className="text-sm text-slate-400">Welcome back, Admin</p>
                </div>

                {pendingSellers > 0 && (
                    <Link
                        href="/admin/stores"
                        className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-700 px-4 py-2.5 rounded-xl hover:bg-amber-100 transition group"
                    >
                        <Clock size={16} className="shrink-0" />
                        <div className="text-sm">
                            <span className="font-bold">{pendingSellers}</span> seller{pendingSellers > 1 ? 's' : ''} pending approval
                        </div>
                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full ml-1 group-hover:bg-amber-300 transition">
                            Review →
                        </span>
                    </Link>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {statCards.slice(0, 4).map((card, i) => (
                    <StatCard key={i} card={card} />
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statCards.slice(4).map((card, i) => (
                    <StatCard key={i} card={card} />
                ))}
            </div>

            {/* Orders Area Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-700">Orders Overview</h2>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                            All Orders
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                            Online
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                            COD
                        </span>
                    </div>
                </div>
                <OrdersAreaChart allOrders={dashboardData.allOrders} />
            </div>
        </div>
    )
}

function StatCard({ card }) {
    return (
        <div className={`flex items-center gap-4 bg-white border ${card.border} p-4 rounded-xl shadow-sm hover:shadow-md transition`}>
            <div className={`${card.bg} ${card.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                <card.icon size={22} />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-400 truncate">{card.title}</p>
                <b className="text-lg font-bold text-slate-700 block truncate">{card.value}</b>
                {card.sub && <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>}
            </div>
        </div>
    )
}