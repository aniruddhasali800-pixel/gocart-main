'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '@/lib/api'

const CustomizeContext = createContext()

export const CustomizeProvider = ({ children }) => {
    const [customize, setCustomize] = useState({
        logo: '/logo.png',
        sliders: [],
        contactInfo: {
            phone: '9960752618',
            email: 'binarycomputersndbr@gmail.com',
            address: '22,1st Foor Saiachana Plaza, Bus Stand, Nandurbar-425412'
        },
        socialMedia: {
            facebook: 'https://www.facebook.com',
            instagram: 'https://www.instagram.com',
            twitter: 'https://twitter.com',
            linkedin: 'https://www.linkedin.com'
        }
    })

    useEffect(() => {
        const fetchCustomize = async () => {
            try {
                const res = await api.getCustomize()
                if (res.success && res.settings) {
                    setCustomize(res.settings)
                }
            } catch (error) {
                console.error("Failed to fetch customize settings:", error)
            }
        }
        fetchCustomize()
    }, [])

    return (
        <CustomizeContext.Provider value={customize}>
            {children}
        </CustomizeContext.Provider>
    )
}

export const useCustomize = () => useContext(CustomizeContext)
