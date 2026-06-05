'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutListIcon, Lock, SquarePenIcon, SquarePlusIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const StoreSidebar = ({ storeInfo, isPending = false }) => {

    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/store', icon: HomeIcon },
        { name: 'Add Product', href: '/store/add-product', icon: SquarePlusIcon },
        { name: 'Manage Product', href: '/store/manage-product', icon: SquarePenIcon },
        { name: 'Orders', href: '/store/orders', icon: LayoutListIcon },
    ]

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
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

            <div className="max-sm:mt-6">
                {sidebarLinks.map((link, index) => (
                    <div key={index} className="relative">
                        {isPending ? (
                            // Locked state - show links but visually locked
                            <div className={`relative flex items-center gap-3 text-slate-300 p-2.5 cursor-not-allowed`}>
                                <link.icon size={18} className="sm:ml-5" />
                                <p className="max-sm:hidden">{link.name}</p>
                                <Lock size={12} className="ml-auto mr-3 max-sm:hidden" />
                            </div>
                        ) : (
                            <Link href={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
                                <link.icon size={18} className="sm:ml-5" />
                                <p className="max-sm:hidden">{link.name}</p>
                                {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StoreSidebar