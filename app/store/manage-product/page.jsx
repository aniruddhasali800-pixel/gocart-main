'use client'
import api from "@/lib/api"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"

export default function StoreManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [store, setStore] = useState(null)

    const fetchProducts = async () => {
        try {
            const storeRes = await api.getMyStore();
            if (storeRes.success && storeRes.store) {
                setStore(storeRes.store);
                const data = await api.getStoreProducts(storeRes.store.id);
                setProducts(data.products || []);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const toggleStock = async (productId) => {
        const data = await api.toggleStock(productId);
        if (data.success) {
            setProducts(products.map(p => p.id === productId ? { ...p, inStock: data.inStock } : p));
        }
    }

    const handleStoreToggle = async () => {
        if (!store) return;
        const targetStatus = !store.isActive;
        try {
            const res = await api.updateStore({ isActive: targetStatus });
            if (res.success && res.store) {
                setStore(res.store);
                toast.success(`Store is now ${targetStatus ? 'LIVE' : 'OFFLINE'}`);
            }
        } catch (error) {
            toast.error(error.message || "Failed to update store status");
            throw error;
        }
    }

    useEffect(() => {
            fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 max-w-4xl">
                <h1 className="text-2xl text-slate-500">Manage <span className="text-slate-800 font-medium">Products</span></h1>
                {store && (
                    <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                        <span className="text-sm font-medium text-slate-600">Active Store Status:</span>
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                onChange={() => toast.promise(handleStoreToggle(), { loading: "Updating store status...", success: "Status updated!", error: "Failed to update" })}
                                checked={store.isActive}
                            />
                            <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                        </label>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${store.isActive ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-rose-100 text-rose-700'}`}>
                            {store.isActive ? 'LIVE' : 'OFFLINE'}
                        </span>
                    </div>
                )}
            </div>
            <table className="w-full max-w-4xl text-left  ring ring-slate-200  rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex gap-2 items-center">
                                    <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                            <td className="px-4 py-3">{currency} {product.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                    <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Updating data..." })} checked={product.inStock} />
                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                </label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}