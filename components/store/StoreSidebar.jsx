'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutListIcon, Lock, SquarePenIcon, SquarePlusIcon, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const StoreSidebar = ({ storeInfo, isPending = false, isOpen, onClose }) => {

    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/store', icon: HomeIcon },
        { name: 'Add Product', href: '/store/add-product', icon: SquarePlusIcon },
        { name: 'Manage Product', href: '/store/manage-product', icon: SquarePenIcon },
        { name: 'Orders', href: '/store/orders', icon: LayoutListIcon },
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
                    {storeInfo?.logo ? (
                        <Image className="w-14 h-14 rounded-full shadow-md object-cover" src={storeInfo.logo} alt="" width={80} height={80} />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center shadow-md">
                            <span className="text-slate-500 text-xl font-bold">{storeInfo?.name?.[0] || 'S'}</span>
                        </div>
                    )}
                    <p className="text-slate-700 font-medium">{storeInfo?.name || 'My Store'}</p>
                    {isPending && (
                        <span className="text-[11px] bg-amber-100 text-amber-700 border border-amber-300 px-3 py-0.5 rounded-full flex items-center gap-1 font-medium">
                            <Lock size={10} /> Pending Approval
                        </span>
                    )}
                </div>

                <div className="mt-2">
                    {sidebarLinks.map((link, index) => (
                        <div key={index} className="relative">
                            {isPending ? (
                                // Locked state - show links but visually locked
                                <div className={`relative flex items-center gap-3 text-slate-300 p-3 cursor-not-allowed`}>
                                    <link.icon size={18} className="ml-5" />
                                    <p>{link.name}</p>
                                    <Lock size={12} className="ml-auto mr-3" />
                                </div>
                            ) : (
                                <Link href={link.href} onClick={onClose} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-3 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
                                    <link.icon size={18} className="ml-5" />
                                    <p>{link.name}</p>
                                    {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default StoreSidebar