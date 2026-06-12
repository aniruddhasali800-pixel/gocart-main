'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrency } from '@/lib/features/currency/currencySlice'
import { ChevronDown, Globe } from 'lucide-react'

const CurrencySelector = () => {
    const dispatch = useDispatch()
    const { code, symbol } = useSelector(state => state.currency)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Handle clicks outside of dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (currencyCode) => {
        dispatch(setCurrency(currencyCode))
        setIsOpen(false)
    }

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-indigo-400 active:scale-95 transition-all shadow-sm"
            >
                <Globe size={14} className="text-slate-400" />
                <span className="font-semibold text-xs">{code} ({symbol})</span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-xl bg-white border border-slate-100 shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-100">
                    <div className="py-1 p-1">
                        <button
                            onClick={() => handleSelect('INR')}
                            className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                                code === 'INR'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span>Rupees (₹)</span>
                            {code === 'INR' && <span className="text-indigo-600 font-bold">✓</span>}
                        </button>
                        <button
                            onClick={() => handleSelect('USD')}
                            className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                                code === 'USD'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span>Dollars ($)</span>
                            {code === 'USD' && <span className="text-indigo-600 font-bold">✓</span>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CurrencySelector
