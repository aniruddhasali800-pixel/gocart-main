'use client'
import { Search, ShoppingCart, X, User, Store, ArrowRight, CheckCircle, Clock, Lock, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CurrencySelector from "@/components/CurrencySelector";
import {
    useAuth,
    useClerk,
    UserButton,
} from "@clerk/nextjs";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useCustomize } from "@/components/CustomizeProvider";

const Navbar = () => {

    const router = useRouter();
    const { openSignIn, openSignUp } = useClerk();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)
    const { isSignedIn } = useAuth();
    const { logo } = useCustomize();

    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <>
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-1.5 transition-all">

                    <Link href="/" className="relative flex items-center">
                        <img src={logo || "/logo.png"} alt="Binary Computers" className="h-8 sm:h-10 w-auto object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-3 lg:gap-5 text-sm text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/">About</Link>
                        <Link href="/orders" className="whitespace-nowrap text-sm">My Orders</Link>
                        <Link href="/">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                            <Search size={16} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-1.5 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        <CurrencySelector />

                        {/* Auth Buttons */}
                        {!isSignedIn && (
                            <div className="flex gap-1 items-center">
                                <button onClick={() => openSignIn()} className="px-3 py-1 text-sm hover:bg-slate-100 transition text-slate-700 rounded-full font-medium whitespace-nowrap">
                                    Login
                                </button>
                                <button onClick={() => openSignUp()} className="px-4 py-1 text-sm bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full whitespace-nowrap">
                                    Sign Up
                                </button>
                            </div>
                        )}
                        {isSignedIn && (
                            <div className="flex items-center gap-3">
                                <UserButton
                                    appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                                    afterSignOutUrl="/"
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile Buttons */}
                    <div className="sm:hidden flex items-center gap-3">
                        <CurrencySelector />
                        <Link href="/cart" className="relative flex items-center gap-1 text-slate-600 mr-1">
                            <ShoppingCart size={20} />
                            <button className="absolute -top-1 -right-1 text-[9px] font-bold text-white bg-slate-600 size-4 rounded-full flex items-center justify-center">{cartCount}</button>
                        </Link>
                        {!isSignedIn && (
                            <button onClick={() => openSignIn()} className="px-3 py-1.5 hover:bg-slate-100 text-sm transition text-slate-700 rounded-full font-medium">
                                Login
                            </button>
                        )}
                        {isSignedIn && (
                            <div className="flex items-center gap-2">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        )}
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-1">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>

        {/* Mobile Menu Drawer */}
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 sm:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <span className="font-semibold text-slate-800 text-lg">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5 flex flex-col gap-4 text-slate-600 font-medium">
                    <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="flex items-center w-full gap-2 bg-slate-100 px-4 py-2.5 rounded-full mb-4">
                        <Search size={18} className="text-slate-500" />
                        <input className="w-full bg-transparent outline-none placeholder-slate-500 text-sm" type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} required />
                    </form>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 transition-colors border-b border-slate-50">Home</Link>
                    <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 transition-colors border-b border-slate-50">Shop</Link>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 transition-colors border-b border-slate-50">About</Link>
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 transition-colors border-b border-slate-50">My Orders</Link>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600 transition-colors">Contact</Link>
                </div>
            </div>
        </div>


        </>
    )
}

export default Navbar