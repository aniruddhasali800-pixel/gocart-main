'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { useCustomize } from '@/components/CustomizeProvider'
import Link from 'next/link'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const customize = useCustomize()
    const sliders = customize?.sliders || []
    
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        if (sliders.length <= 1) return
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % sliders.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [sliders.length])

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % sliders.length)
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + sliders.length) % sliders.length)

    // Fallback static slider data if none provided
    const displaySlider = sliders.length > 0 ? sliders[currentSlide] : {
        badgeText: 'NEWS',
        badgeSub: 'Free Shipping on Orders Above $50!',
        title: "Gadgets you'll love. Prices you'll trust.",
        priceText: 'Starts from',
        price: `${currency}4.90`,
        buttonText: 'LEARN MORE',
        image: assets.hero_model_img,
        link: '/shop'
    }

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                {/* Main Carousel Slider */}
                <div className='relative flex-1 flex flex-col bg-green-200 rounded-3xl xl:min-h-[400px] group overflow-hidden'>
                    {/* Carousel Navigation Buttons */}
                    {sliders.length > 1 && (
                        <>
                            <button onClick={prevSlide} className='absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-slate-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition'>
                                <ChevronLeftIcon size={24} />
                            </button>
                            <button onClick={nextSlide} className='absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-slate-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition'>
                                <ChevronRightIcon size={24} />
                            </button>
                            
                            {/* Dots */}
                            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
                                {sliders.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-colors ${currentSlide === idx ? 'bg-slate-800' : 'bg-slate-800/30'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <div className='p-5 sm:p-16 relative z-10 flex-1 flex flex-col justify-center animate-[fadeIn_0.5s_ease-in-out]'>
                        <div className='inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm w-max'>
                            <span className='bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>{displaySlider.badgeText}</span> {displaySlider.badgeSub} <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#56a831] bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                            {displaySlider.title}
                        </h2>
                        <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
                            <p>{displaySlider.priceText}</p>
                            <p className='text-3xl'>{displaySlider.price}</p>
                        </div>
                        <Link href={displaySlider.link || '/shop'} className='bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-4 sm:px-10 mt-4 sm:mt-8 rounded-md hover:bg-slate-900 hover:scale-[1.02] active:scale-95 transition w-max block'>
                            {displaySlider.buttonText}
                        </Link>
                    </div>
                    {typeof displaySlider.image === 'string' ? (
                        <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm object-contain animate-[fadeIn_0.5s_ease-in-out] z-0 pointer-events-none' src={displaySlider.image} alt="Hero Banner" width={400} height={400} />
                    ) : (
                        <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm object-contain animate-[fadeIn_0.5s_ease-in-out] z-0 pointer-events-none' src={displaySlider.image} alt="Hero Banner" />
                    )}
                </div>

                {/* Right Static Banners */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Best products</p>
                            <Link href="/shop" className='flex items-center gap-1 mt-4 hover:underline'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </Link>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>20% discounts</p>
                            <Link href="/shop?discount=true" className='flex items-center gap-1 mt-4 hover:underline'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </Link>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img2} alt="" />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero