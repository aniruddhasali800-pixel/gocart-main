'use client'
import api from "@/lib/api"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import {
    CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon,
    CreditCardIcon, TruckIcon, PercentIcon
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Dashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
    const router   = useRouter()

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        totalProducts:  0,
        totalEarnings:  0,
        totalOrders:    0,
        onlineRevenue:  0,
        codRevenue:     0,
        sellerEarnings: 0,
        commissionPaid: 0,
        commissionRate: 10,
        allOrders:      [],
        ratings:        [],
    })

    const fetchDashboardData = async () => {
        try {
            const data = await api.getSellerDashboard()
            if (data.success) setDashboardData(data.dashboard)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchDashboardData() }, [])

    if (loading) return <Loading />

    const fmt = (val) => currency + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })

    const cards = [
        {
            title: 'Total Products',
            value: dashboardData.totalProducts,
            icon: ShoppingBasketIcon,
            color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
        },
        {
            title: 'Total Orders',
            value: dashboardData.totalOrders,
            icon: TagsIcon,
            color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100',
        },
        {
            title: 'Total Revenue',
            value: fmt(dashboardData.totalEarnings),
            icon: CircleDollarSignIcon,
            color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100',
        },
        {
            title: 'Total Ratings',
            value: dashboardData.ratings.length,
            icon: StarIcon,
            color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100',
        },
        {
            title: 'Online Revenue',
            value: fmt(dashboardData.onlineRevenue),
            icon: CreditCardIcon,
            color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100',
            sub: 'Stripe / Card Payments',
        },
        {
            title: 'COD Revenue',
            value: fmt(dashboardData.codRevenue),
            icon: TruckIcon,
            color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100',
            sub: 'Cash on Delivery',
        },
        {
            title: `Your Earnings (after ${dashboardData.commissionRate}% commission)`,
            value: fmt(dashboardData.sellerEarnings),
            icon: PercentIcon,
            color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100',
            sub: `Platform commission: ${fmt(dashboardData.commissionPaid)}`,
        },
    ]

    return (
        <div className="text-slate-500 mb-28">
            <div className="mb-6">
                <h1 className="text-2xl text-slate-800 font-semibold">Seller Dashboard</h1>
                <p className="text-sm text-slate-400">Welcome back! Here's your store overview.</p>
            </div>

            {/* Top 4 cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {cards.slice(0, 4).map((card, i) => (
                    <StatCard key={i} card={card} />
                ))}
            </div>

            {/* Revenue split cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {cards.slice(4).map((card, i) => (
                    <StatCard key={i} card={card} />
                ))}
            </div>

            {/* Orders Graph */}
            {dashboardData.allOrders?.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-700">Orders Overview</h2>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
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
            )}

            {/* Reviews */}
            {dashboardData.ratings.length > 0 && (
                <>
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">Customer Reviews</h2>
                    <div>
                        {dashboardData.ratings.map((review, index) => (
                            <div key={index} className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-5 border-b border-slate-200 text-sm text-slate-600 max-w-4xl">
                                <div>
                                    <div className="flex gap-3">
                                        <Image src={review.user.image} alt="" className="w-10 aspect-square rounded-full" width={100} height={100} />
                                        <div>
                                            <p className="font-medium">{review.user.name}</p>
                                            <p className="font-light text-slate-400">{new Date(review.createdAt).toDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-slate-500 max-w-xs leading-6">{review.review}</p>
                                </div>
                                <div className="flex flex-col justify-between gap-4 sm:items-end">
                                    <div className="flex flex-col sm:items-end">
                                        <p className="text-slate-400 text-xs">{review.product?.category}</p>
                                        <p className="font-medium">{review.product?.name}</p>
                                        <div className="flex items-center mt-1">
                                            {Array(5).fill('').map((_, i) => (
                                                <StarIcon key={i} size={15} className="text-transparent" fill={review.rating >= i + 1 ? "#00C950" : "#D1D5DB"} />
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => router.push(`/product/${review.product.id}`)} className="bg-slate-100 px-5 py-2 hover:bg-slate-200 rounded transition-all text-xs">
                                        View Product
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
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
                {card.sub && <p className="text-xs text-slate-400 mt-0.5 truncate">{card.sub}</p>}
            </div>
        </div>
    )
}