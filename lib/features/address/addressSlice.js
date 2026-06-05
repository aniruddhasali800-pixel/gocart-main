import { createSlice } from '@reduxjs/toolkit'

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {
        setAddresses: (state, action) => {
            state.list = action.payload
        },
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
        removeAddress: (state, action) => {
            state.list = state.list.filter(a => (a.id || a._id) !== action.payload)
        },
    }
})

export const { setAddresses, addAddress, removeAddress } = addressSlice.actions

export default addressSlice.reducer