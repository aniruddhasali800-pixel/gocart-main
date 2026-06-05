'use client'
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"

const AdminNavbar = () => {
    const router = useRouter()
    const [adminName, setAdminName]   = useState('Admin')
    const [adminEmail, setAdminEmail] = useState('')
    const [initial, setInitial]       = useState('A')

    useEffect(() => {
        const raw = localStorage.getItem('adminData')
        if (raw) {
            try {
                const data = JSON.parse(raw)
                setAdminName(data.name  || 'Admin')
                setAdminEmail(data.email || '')
                setInitial((data.name || 'A')[0].toUpperCase())
            } catch {}
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
        router.push('/admin/login')
    }

    return (
        <div className="flex items-center justify-between px-4 sm:px-8 py-2 border-b border-slate-200 bg-white transition-all">
            <Link href="/" className="relative">
                <Image src="/logo.png" alt="Binary Computers" width={180} height={50} className="w-44 object-contain" />
                <p className="absolute text-[10px] font-semibold -top-2 -right-4 px-2 py-0.5 rounded-full flex items-center text-white bg-green-500">
                    Admin
                </p>
            </Link>

            <div className="flex items-center gap-3">
                {/* Admin avatar + name */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
                        {initial}
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="text-sm font-semibold text-slate-700">{adminName}</p>
                        <p className="text-xs text-slate-400">{adminEmail}</p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition"
                >
                    <LogOut size={13} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminNavbar