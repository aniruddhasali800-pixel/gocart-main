'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrency } from '@/lib/features/currency/currencySlice'

const Price = ({ value, className = '' }) => {
    const dispatch = useDispatch()
    const { code, symbol, rate } = useSelector(state => state.currency)
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    // Handle clicks outside to close the mini selector
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectCurrency = (e, newCode) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(setCurrency(newCode))
        setIsOpen(false)
    }

    const handleClickPrice = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(!isOpen)
    }

    // Convert and format the price value
    const rawVal = Number(value) || 0
    const convertedVal = rawVal * rate
    
    // Format based on currency type
    let formattedVal = ''
    if (code === 'USD') {
        formattedVal = convertedVal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    } else {
        formattedVal = convertedVal.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 // INR pricing usually rounded in mock shops
        })
    }

    return (
        <span className="relative inline-block" ref={containerRef}>
            <span
                onClick={handleClickPrice}
                className={`cursor-pointer hover:text-indigo-600 border-b border-dashed border-transparent hover:border-indigo-400 transition-all duration-200 select-none title="Click to change currency" ${className}`}
            >
                {symbol}{formattedVal}
            </span>

            {isOpen && (
                <span 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute left-0 top-full mt-1 z-50 flex flex-col gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-xl text-xs font-semibold select-none min-w-[70px] pointer-events-auto cursor-default"
                >
                    <button
                        onClick={(e) => handleSelectCurrency(e, 'INR')}
                        className={`px-2 py-1.5 text-left rounded-md w-full transition-colors ${
                            code === 'INR' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        ₹ INR
                    </button>
                    <button
                        onClick={(e) => handleSelectCurrency(e, 'USD')}
                        className={`px-2 py-1.5 text-left rounded-md w-full transition-colors ${
                            code === 'USD' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        $ USD
                    </button>
                </span>
            )}
        </span>
    )
}

export default Price
