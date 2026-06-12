'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon, Lock, Clock, CheckCircle2 } from "lucide-react"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"
import api from "@/lib/api"
import toast from "react-hot-toast"

const StoreLayout = ({ children }) => {

    const [storeStatus, setStoreStatus] = useState(null) // null | 'pending' | 'approved' | 'rejected' | 'none'
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const fetchStoreStatus = async () => {
        try {
            const res = await api.getMyStore()
            if (res.success && res.store) {
                setStoreInfo(res.store)
                setStoreStatus(res.store.status)
            } else {
                setStoreStatus('none')
            }
        } catch (error) {
            // If 404 - no store
            setStoreStatus('none')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStoreStatus()
    }, [])

    if (loading) return <Loading />

    // No store at all - redirect message
    if (storeStatus === 'none' || storeStatus === 'rejected') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <Lock size={36} className="text-red-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-3">
                    {storeStatus === 'rejected' ? 'Application Rejected' : 'No Seller Account Found'}
                </h1>
                <p className="text-slate-500 max-w-md mb-8">
                    {storeStatus === 'rejected'
                        ? 'Unfortunately your seller application was rejected. Please contact support for more information.'
                        : 'You need to apply as a seller first. Click the button below to get started.'
                    }
                </p>
                <Link href="/" className="bg-slate-800 text-white flex items-center gap-2 py-2.5 px-6 rounded-full hover:bg-slate-900 transition">
                    Go to Home <ArrowRightIcon size={18} />
                </Link>
            </div>
        )
    }

    // Store is pending approval
    if (storeStatus === 'pending') {
        return (
            <div className="flex flex-col h-screen overflow-hidden">
                <SellerNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex flex-1 items-start h-full overflow-hidden relative">
                    {/* Sidebar - visible but with lock indicator */}
                    <SellerSidebar storeInfo={storeInfo} isPending={true} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                    {/* Main content locked overlay */}
                    <div className="flex-1 h-full flex items-center justify-center bg-slate-50 relative">
                        {/* Blurred content behind */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
                            {children}
                        </div>

                        {/* Lock overlay */}
                        <div className="relative z-10 text-center px-6 max-w-lg">
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
                                    <Clock size={44} className="text-amber-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">Awaiting Admin Approval</h2>
                            <p className="text-slate-500 mb-6">
                                Your seller application has been submitted and is currently under review by our admin team. Once approved, you will have full access to your seller dashboard — including product management, orders, and sales analytics.
                            </p>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
                                <h3 className="font-semibold text-slate-700 mb-4 text-left">What happens next?</h3>
                                <div className="flex flex-col gap-3 text-sm text-left">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-slate-600">Application submitted successfully</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-[18px] h-[18px] rounded-full border-2 border-amber-400 flex items-center justify-center mt-0.5 shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                        </div>
                                        <span className="text-slate-600">Admin reviews your application <span className="text-amber-600 font-medium">(In Progress)</span></span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 mt-0.5 shrink-0" />
                                        <span className="text-slate-400">Store gets activated and you can start selling</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">Typical review time: 24-48 hours</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Approved seller
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <SellerNavbar onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex flex-1 items-start h-full overflow-hidden relative">
                <SellerSidebar storeInfo={storeInfo} isPending={false} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-auto w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default StoreLayout