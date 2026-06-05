import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/api'

/**
 * Async thunk: fetch all products from the backend API.
 * Dispatched once on app mount via StoreProvider.
 */
export const fetchProducts = createAsyncThunk(
    'product/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.getProducts()
            return data.products || []
        } catch (error) {
            console.error('fetchProducts failed:', error.message)
            return rejectWithValue(error.message)
        }
    }
)
