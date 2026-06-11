'use client'
import { Search, ShoppingCart, X, User, Store, ArrowRight, CheckCircle, Clock, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    useAuth,
    useClerk,
    UserButton,
} from "@clerk/nextjs";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Navbar = () => {

    const router = useRouter();
    const { openSignIn, openSignUp } = useClerk();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)
    const { isSignedIn } = useAuth();

    // Modal states
    const [showRoleModal, setShowRoleModal] = useState(false)
    const [showSellerForm, setShowSellerForm] = useState(false)
    const [sellerSubmitted, setSellerSubmitted] = useState(false)
    const [sellerLoading, setSellerLoading] = useState(false)
    const [checkingStore, setCheckingStore] = useState(false)

    // Track whether logged-in user chose 'seller' or 'user' role
    const [userRole, setUserRole] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userRole') || 'user'
        }
        return 'user'
    })

    const [sellerForm, setSellerForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gstNumber: '',
    })

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    // After sign-in, check if user had pending seller intent
    useEffect(() => {
        if (isSignedIn) {
            const sellerIntent = localStorage.getItem('sellerIntent')
            if (sellerIntent === 'true') {
                localStorage.removeItem('sellerIntent')
                // Mark as seller role before opening flow
                localStorage.setItem('userRole', 'seller')
                setUserRole('seller')
                handleOpenSellerFlow()
            }
        }
    }, [isSignedIn])

    const closeAll = () => {
        setShowRoleModal(false)
        setShowSellerForm(false)
        setSellerSubmitted(false)
    }

    // Smart seller flow: check store status first
    const handleOpenSellerFlow = async () => {
        setCheckingStore(true)
        try {
            const res = await api.getMyStore()
            if (res.success && res.store) {
                // Already has a store — redirect to dashboard
                closeAll()
                router.push('/store')
                return
            }
        } catch (e) {
            // No store found — show application form
        } finally {
            setCheckingStore(false)
        }
        setShowSellerForm(true)
    }

    const handleLoginClick = () => {
        setShowRoleModal(true)
    }

    const handleUserLogin = () => {
        // Mark as regular user — no seller button/form after login
        localStorage.setItem('userRole', 'user')
        setUserRole('user')
        setShowRoleModal(false)
        openSignIn()
    }

    const handleSellerLogin = () => {
        setShowRoleModal(false)
        if (!isSignedIn) {
            // Remember intent, sign in first
            localStorage.setItem('sellerIntent', 'true')
            localStorage.setItem('userRole', 'seller')
            setUserRole('seller')
            openSignIn()
        } else {
            // Already signed in — mark as seller and open flow
            localStorage.setItem('userRole', 'seller')
            setUserRole('seller')
            handleOpenSellerFlow()
        }
    }

    const handleSellerFormChange = (e) => {
        setSellerForm({ ...sellerForm, [e.target.name]: e.target.value })
    }

    const handleSellerSubmit = async (e) => {
        e.preventDefault()
        setSellerLoading(true)
        try {
            const username = sellerForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
            const res = await api.createStore({
                name: sellerForm.name,
                username,
                description: `Welcome to ${sellerForm.name}`,
                email: sellerForm.email,
                phone: sellerForm.phone,
                address: sellerForm.address,
                gstNumber: sellerForm.gstNumber,
            })
            if (res.success) {
                setSellerSubmitted(true)
            }
        } catch (error) {
            toast.error(error.message || 'Failed to submit application')
        } finally {
            setSellerLoading(false)
        }
    }

    const handleGoToSellerDashboard = () => {
        closeAll()
        router.push('/store')
    }

    return (
        <>
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-1.5 transition-all">

                    <Link href="/" className="relative">
                        <Image src="/logo.png" alt="Binary Computers" width={180} height={50} className="w-44 object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-3 lg:gap-6 text-sm text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/">About</Link>
                        <Link href="/orders" className="whitespace-nowrap text-sm">My Orders</Link>
                        <Link href="/">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-3 py-2 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {/* Auth Buttons */}
                        {!isSignedIn && (
                            <div className="flex gap-2 items-center">
                                <button onClick={handleLoginClick} className="px-4 py-1.5 text-sm hover:bg-slate-100 transition text-slate-700 rounded-full font-medium">
                                    Login
                                </button>
                                <button onClick={() => openSignUp()} className="px-4 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                    Sign Up
                                </button>
                            </div>
                        )}
                        {isSignedIn && (
                            <div className="flex items-center gap-3">
                                {/* Only show Seller button if user logged in as seller */}
                                {userRole === 'seller' && (
                                    <button
                                        onClick={handleOpenSellerFlow}
                                        disabled={checkingStore}
                                        className="text-sm px-3 py-1.5 border border-slate-300 rounded-full text-slate-600 hover:bg-slate-50 hover:border-green-400 hover:text-green-700 transition flex items-center gap-1.5"
                                    >
                                        {checkingStore ? (
                                            <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                        ) : <Store size={14} />}
                                        Seller
                                    </button>
                                )}
                                <UserButton
                                    appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                                    afterSignOutUrl="/"
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile Buttons */}
                    <div className="sm:hidden flex items-center gap-3">
                        {!isSignedIn && (
                            <button onClick={handleLoginClick} className="px-5 py-1.5 hover:bg-slate-100 text-sm transition text-slate-700 rounded-full font-medium">
                                Login
                            </button>
                        )}
                        {isSignedIn && (
                            <div className="flex items-center gap-2">
                                {/* Mobile: Only show Seller button if user logged in as seller */}
                                {userRole === 'seller' && (
                                    <button onClick={handleOpenSellerFlow} className="text-xs px-2 py-1 border border-slate-300 rounded-full text-slate-500">
                                        Seller
                                    </button>
                                )}
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>

        {/* ── Role Selection Modal ─────────────────────────────── */}
        {showRoleModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-[fadeIn_0.2s_ease]">
                    <button onClick={closeAll} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition">
                        <X size={22} />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">Welcome!</h2>
                    <p className="text-slate-500 text-sm text-center mb-8">How would you like to continue?</p>
                    <div className="grid grid-cols-2 gap-4">

                        {/* User Option */}
                        <button onClick={handleUserLogin} className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                            <div className="w-16 h-16 bg-slate-100 group-hover:bg-indigo-100 rounded-full flex items-center justify-center transition-colors">
                                <User size={30} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">User Login</p>
                                <p className="text-xs text-slate-400 mt-1">Shop & track orders</p>
                            </div>
                        </button>

                        {/* Seller Option */}
                        <button onClick={handleSellerLogin} className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all">
                            <div className="w-16 h-16 bg-slate-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors">
                                <Store size={30} className="text-slate-400 group-hover:text-green-600 transition-colors" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-slate-700 group-hover:text-green-700 transition-colors">Seller Login</p>
                                <p className="text-xs text-slate-400 mt-1">Manage your store</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* ── Seller Application Form Modal ────────────────────── */}
        {showSellerForm && !sellerSubmitted && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative my-8">
                    <button onClick={closeAll} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition">
                        <X size={22} />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Store size={20} className="text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Apply to Sell</h2>
                            <p className="text-xs text-slate-400">Fill in details — admin will review your request</p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 my-5">
                        <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                            <CheckCircle size={12} /> Signed In
                        </div>
                        <div className="h-px flex-1 bg-slate-200" />
                        <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
                            <Store size={12} /> Store Details
                        </div>
                        <div className="h-px flex-1 bg-slate-200" />
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                            <Lock size={12} /> Admin Review
                        </div>
                    </div>

                    <form onSubmit={handleSellerSubmit} className="flex flex-col gap-3.5">
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Store / Business Name *</label>
                            <input name="name" required value={sellerForm.name} onChange={handleSellerFormChange}
                                type="text" placeholder="e.g. Binary Computers"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Email ID *</label>
                            <input name="email" required value={sellerForm.email} onChange={handleSellerFormChange}
                                type="email" placeholder="Enter your business email"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Phone Number *</label>
                            <input name="phone" required value={sellerForm.phone} onChange={handleSellerFormChange}
                                type="tel" placeholder="Enter your phone number"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Store / Business Address *</label>
                            <textarea name="address" required value={sellerForm.address} onChange={handleSellerFormChange}
                                rows={2} placeholder="Full address including city, state & pincode"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">GST Number *</label>
                            <input name="gstNumber" required value={sellerForm.gstNumber} onChange={handleSellerFormChange}
                                type="text" placeholder="e.g. 29AAACC1234F1Z5"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </div>

                        <button type="submit" disabled={sellerLoading}
                            className="mt-1 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                            {sellerLoading ? (
                                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <> Apply to Sell <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* ── Application Submitted Success ────────────────────── */}
        {showSellerForm && sellerSubmitted && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center relative">
                    <button onClick={closeAll} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition">
                        <X size={22} />
                    </button>

                    <div className="flex justify-center mb-5">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Your seller application is under review. You can access your seller dashboard, but full features will be unlocked once the admin approves your request.
                    </p>

                    <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
                        <Clock size={16} className="text-amber-500 shrink-0" />
                        <p className="text-sm text-amber-700 font-medium">Pending admin approval · 24–48 hrs</p>
                    </div>

                    {/* Steps */}
                    <div className="text-left flex flex-col gap-2.5 mb-6">
                        {[
                            { done: true,  label: 'Application submitted successfully' },
                            { done: false, active: true, label: 'Admin reviews your application' },
                            { done: false, active: false, label: 'Store activated — start selling!' },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                                {step.done ? (
                                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                                ) : step.active ? (
                                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                    </div>
                                ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                                )}
                                <span className={step.done ? 'text-slate-700' : step.active ? 'text-amber-700 font-medium' : 'text-slate-400'}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleGoToSellerDashboard}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                        Go to Seller Dashboard <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )}
        </>
    )
}

export default Navbar