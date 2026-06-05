'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon, ClipboardListIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"

const AdminSidebar = () => {
    const pathname = usePathname()
    const { user } = useUser()

    const sidebarLinks = [
        { name: 'Dashboard',    href: '/admin',          icon: HomeIcon },
        { name: 'Seller Requests', href: '/admin/stores', icon: ShieldCheckIcon },
        { name: 'All Orders',   href: '/admin/orders',   icon: ClipboardListIcon },
        { name: 'Coupons',      href: '/admin/coupons',  icon: TicketPercentIcon },
    ]

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? (
                        <Image src={user.imageUrl} alt="" className="w-full h-full object-cover" width={56} height={56} />
                    ) : (
                        <span className="text-xl font-bold text-indigo-600">{user?.firstName?.[0] || 'A'}</span>
                    )}
                </div>
                <p className="text-slate-700 text-sm">Hi, {user?.firstName || 'Admin'}</p>
            </div>

            <div className="max-sm:mt-6">
                {sidebarLinks.map((link, index) => (
                    <Link key={index} href={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
                        <link.icon size={18} className="sm:ml-5" />
                        <p className="max-sm:hidden">{link.name}</p>
                        {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
                    </Link>
                ))}
            </div>

            {/* Sign out at bottom */}
            <div className="mt-auto mb-6 flex justify-center max-sm:hidden">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}

export default AdminSidebar