'use client'
import api from "@/lib/api"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { CheckCircle2, Clock, XCircle, Percent, Check, X } from "lucide-react"

export default function AdminStores() {

    const [stores, setStores]   = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter]   = useState('all')

    // Commission edit state: { [storeId]: { editing, value } }
    const [commEdit, setCommEdit] = useState({})

    const fetchStores = async () => {
        try {
            const data = await api.getAllStores()
            if (data.success) setStores(data.stores)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (storeId, newStatus) => {
        try {
            const res = await api.approveStore(storeId, newStatus)
            if (res.success) {
                setStores(stores.map(s => s.id === storeId ? { ...s, status: newStatus } : s))
                return `Store ${newStatus} successfully`
            } else {
                throw new Error("Failed to update status")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    const startEditComm = (store) => {
        setCommEdit(prev => ({
            ...prev,
            [store.id]: { editing: true, value: store.commissionRate ?? 10 }
        }))
    }

    const saveCommission = async (storeId) => {
        const rate = Number(commEdit[storeId]?.value)
        if (isNaN(rate) || rate < 0 || rate > 100) {
            toast.error('Commission must be 0–100%')
            return
        }
        try {
            const res = await api.updateCommission(storeId, rate)
            if (res.success) {
                setStores(stores.map(s => s.id === storeId ? { ...s, commissionRate: rate } : s))
                setCommEdit(prev => ({ ...prev, [storeId]: { editing: false, value: rate } }))
                toast.success(`Commission set to ${rate}%`)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const cancelEdit = (storeId) => {
        setCommEdit(prev => ({ ...prev, [storeId]: { editing: false, value: null } }))
    }

    useEffect(() => { fetchStores() }, [])

    const filteredStores = stores.filter(s => filter === 'all' ? true : s.status === filter)
    const pendingCount   = stores.filter(s => s.status === 'pending').length

    if (loading) return <Loading />

    return (
        <div className="text-slate-500 mb-28">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl text-slate-800 font-semibold">Seller Requests</h1>
                    <p className="text-sm text-slate-400">Approve, reject, or set commission per vendor</p>
                </div>
                {pendingCount > 0 && (
                    <span className="text-sm bg-amber-100 text-amber-700 border border-amber-300 px-4 py-1.5 rounded-full font-medium">
                        {pendingCount} pending approval{pendingCount > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        {f} {f !== 'all' && `(${stores.filter(s => s.status === f).length})`}
                    </button>
                ))}
            </div>

            {filteredStores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {filteredStores.map((store) => {
                        const ce = commEdit[store.id] || {}
                        const currentComm = store.commissionRate ?? 10

                        return (
                            <div key={store.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl">
                                {/* Store Info */}
                                <StoreInfo store={store} />

                                {/* Right Column: Status + Actions + Commission */}
                                <div className="flex flex-col gap-3 shrink-0">

                                    {/* Status Badge */}
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit ${
                                        store.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        store.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {store.status === 'approved' ? <CheckCircle2 size={12} /> :
                                         store.status === 'rejected' ? <XCircle size={12} /> :
                                         <Clock size={12} />}
                                        {store.status === 'approved' ? 'Approved' :
                                         store.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                                    </div>

                                    {/* Approve / Reject */}
                                    <div className="flex gap-2">
                                        {store.status !== 'approved' && (
                                            <button
                                                onClick={() => toast.promise(updateStatus(store.id, 'approved'), {
                                                    loading: 'Approving...',
                                                    success: msg => msg,
                                                    error: err => err.message
                                                })}
                                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition flex items-center gap-1.5 font-medium"
                                            >
                                                <CheckCircle2 size={14} /> Approve
                                            </button>
                                        )}
                                        {store.status !== 'rejected' && (
                                            <button
                                                onClick={() => toast.promise(updateStatus(store.id, 'rejected'), {
                                                    loading: 'Rejecting...',
                                                    success: msg => msg,
                                                    error: err => err.message
                                                })}
                                                className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded-lg transition flex items-center gap-1.5 font-medium border border-red-200"
                                            >
                                                <XCircle size={14} /> Reject
                                            </button>
                                        )}
                                    </div>

                                    {/* Commission Editor */}
                                    <div className="flex items-center gap-2 mt-1">
                                        <Percent size={13} className="text-rose-500 shrink-0" />
                                        {ce.editing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    min={0} max={100} step={0.5}
                                                    value={ce.value}
                                                    onChange={e => setCommEdit(prev => ({
                                                        ...prev,
                                                        [store.id]: { ...prev[store.id], value: e.target.value }
                                                    }))}
                                                    className="w-16 border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-700 outline-none focus:border-rose-400"
                                                />
                                                <span className="text-xs text-slate-400">%</span>
                                                <button
                                                    onClick={() => saveCommission(store.id)}
                                                    className="p-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
                                                    title="Save"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button
                                                    onClick={() => cancelEdit(store.id)}
                                                    className="p-1 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition"
                                                    title="Cancel"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm font-semibold text-rose-600">{currentComm}%</span>
                                                <span className="text-xs text-slate-400">commission</span>
                                                <button
                                                    onClick={() => startEditComm(store)}
                                                    className="text-xs text-indigo-500 hover:text-indigo-700 underline underline-offset-2 transition"
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-60 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-2xl text-slate-300 font-medium">No stores found</p>
                </div>
            )}
        </div>
    )
}