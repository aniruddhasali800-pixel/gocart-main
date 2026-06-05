'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import { fetchProducts } from '@/lib/features/product/productThunks'

export default function StoreProvider({ children }) {
    const storeRef = useRef(undefined)
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()
    }

    // Fetch real products from the API on app mount
    useEffect(() => {
        storeRef.current.dispatch(fetchProducts())
    }, [])

    return <Provider store={storeRef.current}>{children}</Provider>
}