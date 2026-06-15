'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon, ClipboardListIcon, X, UsersIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"

const AdminSidebar = ({ isOpen, onClose }) => {
    const pathname = usePathname()
    const { user } = useUser()

    const sidebarLinks = [
        { name: 'Dashboard',    href: '/admin',          icon: HomeIcon },
        { name: 'Users',        href: '/admin/users',    icon: UsersIcon },
        { name: 'Seller Requests', href: '/admin/stores', icon: ShieldCheckIcon },
        { name: 'All Orders',   href: '/admin/orders',   icon: ClipboardListIcon },
        { name: 'Coupons',      href: '/admin/coupons',  icon: TicketPercentIcon },
        { name: 'Customize',    href: '/admin/customize', icon: StoreIcon },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
                onClick={onClose} 
            />
            
            {/* Sidebar */}
            <div className={`fixed sm:relative top-0 bottom-0 left-0 z-50 bg-white sm:translate-x-0 w-64 sm:min-w-60 h-full flex flex-col gap-5 border-r border-slate-200 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Close Button Mobile */}
                <button onClick={onClose} className="sm:hidden absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg">
                    <X size={20} />
                </button>

                <div className="flex flex-col gap-3 justify-center items-center pt-8">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                        {user?.imageUrl ? (
                            <Image src={user.imageUrl} alt="" className="w-full h-full object-cover" width={56} height={56} />
                        ) : (
                            <span className="text-xl font-bold text-indigo-600">{user?.firstName?.[0] || 'A'}</span>
                        )}
                    </div>
                    <p className="text-slate-700 text-sm">Hi, {user?.firstName || 'Admin'}</p>
                </div>

                <div className="mt-2">
                    {sidebarLinks.map((link, index) => (
                        <Link key={index} href={link.href} onClick={onClose} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-3 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
                            <link.icon size={18} className="ml-5" />
                            <p>{link.name}</p>
                            {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
                        </Link>
                    ))}
                </div>

                {/* Sign out at bottom */}
                <div className="mt-auto mb-6 flex justify-center">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </>
    )
}

export default AdminSidebar