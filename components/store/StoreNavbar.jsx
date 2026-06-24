'use client'
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"

const StoreNavbar = ({ onMenuClick }) => {

    return (
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-b border-slate-200 transition-all bg-white">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="sm:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <Menu size={22} />
                </button>
                <Link href="/" className="relative flex-shrink-0">
                    <Image src="/logo.png" alt="Binary Computers" width={180} height={50} className="w-32 sm:w-40 object-contain" />
                    <p className="absolute text-[9px] sm:text-[10px] font-semibold -top-1 sm:-top-2 -right-2 sm:-right-4 px-2 py-0.5 rounded-full flex items-center text-white bg-green-500">
                        Store
                    </p>
                </Link>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>Hi, Seller</span>
                <Link href="/" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium transition">Exit Store</Link>
            </div>
        </div>
    )
}

export default StoreNavbar