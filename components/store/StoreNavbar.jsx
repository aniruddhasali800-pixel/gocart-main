'use client'
import Link from "next/link"
import Image from "next/image"
import { UserButton, useUser } from "@clerk/nextjs"

const StoreNavbar = () => {
    const { user } = useUser()

    return (
        <div className="flex items-center justify-between px-6 py-2 border-b border-slate-200 transition-all bg-white">
            <Link href="/" className="relative">
                <Image src="/logo.png" alt="Binary Computers" width={180} height={50} className="w-40 object-contain" />
                <p className="absolute text-[10px] font-semibold -top-2 -right-4 px-2 py-0.5 rounded-full flex items-center text-white bg-green-500">
                    Store
                </p>
            </Link>
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>Hi, {user?.firstName || 'Seller'}</span>
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}

export default StoreNavbar