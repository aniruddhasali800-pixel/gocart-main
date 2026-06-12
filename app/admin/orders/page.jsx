'use client'
import api from "@/lib/api"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Price from "@/components/Price"

const STATUS_COLORS = {
    ORDER_PLACED: 'bg-blue-100 text-blue-700',
    PROCESSING:   'bg-amber-100 text-amber-700',
    SHIPPED:      'bg-indigo-100 text-indigo-700',
    DELIVERED:    'bg-green-100 text-green-700',
    CANCELLED:    'bg-red-100 text-red-600',
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)

    const fetchOrders = async () => {
        try {
            const data = await api.getAdminOrders()
            if (data.success) setOrders(data.orders)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOrders() }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl text-slate-800 font-semibold mb-1">All Orders</h1>
            <p className="text-sm text-slate-400 mb-6">{orders.length} total orders across all sellers</p>

            {orders.length === 0 ? (
                <div className="flex items-center justify-center h-60 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-2xl text-slate-300 font-medium">No orders yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow border border-slate-200 max-w-5xl">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                {['#', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map((h, i) => (
                                    <th key={i} className="px-4 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order, idx) => (
                                <tr key={order.id} onClick={() => setSelected(selected?.id === order.id ? null : order)}
                                    className="hover:bg-slate-50 cursor-pointer transition">
                                    <td className="px-4 py-3 text-green-600 font-medium">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-700">{order.address?.name || '—'}</p>
                                        <p className="text-xs text-slate-400">{order.address?.email || '—'}</p>
                                    </td>
                                    <td className="px-4 py-3">{order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800"><Price value={order.total} /></td>
                                    <td className="px-4 py-3">{order.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {order.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400 text-xs">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Detail Panel */}
            {selected && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">✕</button>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Order Details</h2>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs text-slate-400 mb-1">Customer</p>
                                <p className="font-medium text-slate-700">{selected.address?.name || '—'}</p>
                                <p className="text-slate-500">{selected.address?.email || '—'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs text-slate-400 mb-1">Payment</p>
                                <p className="font-medium text-slate-700">{selected.paymentMethod}</p>
                                <p className={`text-xs mt-1 ${selected.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                                    {selected.isPaid ? '✓ Paid' : '⏳ Pending'}
                                </p>
                            </div>
                        </div>

                        {selected.address && (
                            <div className="text-sm bg-blue-50 rounded-lg p-3 mb-4">
                                <p className="text-xs text-slate-400 mb-1">Delivery Address</p>
                                <p className="text-slate-700">{selected.address?.street}, {selected.address?.city}, {selected.address?.state} - {selected.address?.zip}</p>
                                <p className="text-slate-500">Phone: {selected.address?.phone}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Products</p>
                            <div className="flex flex-col gap-2">
                                {selected.orderItems?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 border border-slate-100 rounded-lg p-2.5">
                                        <img src={item.product?.images?.[0] || item.productId?.images?.[0]} alt="" className="w-12 h-12 rounded object-cover" />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-700 text-sm">{item.product?.name || item.productId?.name}</p>
                                            <p className="text-xs text-slate-400">Qty: {item.quantity} × <Price value={item.price} /></p>
                                        </div>
                                        <p className="font-semibold text-slate-800 text-sm"><Price value={item.quantity * item.price} /></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <span className="text-slate-500 text-sm">Total</span>
                            <span className="text-xl font-bold text-slate-800"><Price value={selected.total} /></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
