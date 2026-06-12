import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    code: 'INR',
    symbol: '₹',
    rate: 1
}

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency: (state, action) => {
            const currencyCode = action.payload // 'INR' or 'USD'
            if (currencyCode === 'USD') {
                state.code = 'USD'
                state.symbol = '$'
                state.rate = 1 / 83 // 1 USD = 83 INR
            } else {
                state.code = 'INR'
                state.symbol = '₹'
                state.rate = 1
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('currency', currencyCode)
            }
        }
    }
})

export const { setCurrency } = currencySlice.actions
export default currencySlice.reducer
