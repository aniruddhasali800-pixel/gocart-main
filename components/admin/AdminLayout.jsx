'use client'
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Loading from "../Loading"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children }) => {
    const router   = useRouter()
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Skip auth for login page
    const isLoginPage = pathname === '/admin/login'

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false)
            return
        }

        // हर navigation पर fresh auth check — state reset करो
        setLoading(true)
        setIsAdmin(false)

        const token = localStorage.getItem('adminToken')
        if (!token) {
            router.replace('/admin/login')
            setLoading(false)
            return
        }

        // Verify token with backend
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.admin.binarycomputers.shop'
        fetch(`${BASE_URL}/api/admin/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsAdmin(true)
                } else {
                    localStorage.removeItem('adminToken')
                    localStorage.removeItem('adminData')
                    router.replace('/admin/login')
                }
            })
            .catch(() => {
                // If backend unreachable but token exists, still allow (offline mode)
                setIsAdmin(true)
            })
            .finally(() => setLoading(false))
    }, [pathname])  // ← pathname change होने पर re-run होगा

    // Login page पर कोई layout नहीं, सिर्फ page render
    if (isLoginPage) return <>{children}</>

    if (loading) return <Loading />

    if (!isAdmin) return null

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex flex-1 items-start h-full overflow-hidden relative">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-auto w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminLayout