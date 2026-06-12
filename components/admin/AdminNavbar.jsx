'use client'
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LogOut, Menu } from "lucide-react"

const AdminNavbar = ({ onMenuClick }) => {
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
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="sm:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <Menu size={22} />
                </button>
                <Link href="/" className="relative flex-shrink-0">
                    <Image src="/logo.png" alt="Binary Computers" width={180} height={50} className="w-32 sm:w-44 object-contain" />
                    <p className="absolute text-[9px] sm:text-[10px] font-semibold -top-1 sm:-top-2 -right-2 sm:-right-4 px-2 py-0.5 rounded-full flex items-center text-white bg-green-500">
                        Admin
                    </p>
                </Link>
            </div>

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