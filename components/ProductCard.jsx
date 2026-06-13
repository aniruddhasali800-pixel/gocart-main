'use client'
import { StarIcon, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Price from './Price'

const ProductCard = ({ product }) => {

    // calculate the average rating of the product
    const rating = Array.isArray(product.rating) && product.rating.length > 0
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0;

    return (
        <Link href={`/product/${product.id}`} className='group block w-full min-w-0'>
            <div className='
                relative w-full
                bg-white
                border border-gray-200
                rounded-xl sm:rounded-2xl
                shadow-xs hover:shadow-md
                transition-all duration-300
                hover:-translate-y-1
                overflow-hidden
            '>
                {/* Image Section - Square Aspect Ratio */}
                <div className='
                    relative
                    bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200
                    aspect-square w-full
                    flex items-center justify-center
                    overflow-hidden
                '>
                    {/* Decorative background blobs */}
                    <div className='absolute top-2 right-2 w-12 h-12 bg-green-100 rounded-full opacity-40 blur-lg'></div>
                    <div className='absolute bottom-2 left-2 w-10 h-10 bg-blue-100 rounded-full opacity-40 blur-lg'></div>

                    <Image
                        width={300}
                        height={300}
                        className='relative z-10 max-h-[75%] max-w-[75%] w-auto object-contain group-hover:scale-110 transition-transform duration-400 drop-shadow-sm'
                        src={product.images[0]}
                        alt={product.name}
                    />

                    {/* Hover cart icon overlay */}
                    <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-2'>
                        <div className='bg-green-500 text-white rounded-full p-1.5 shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                            <ShoppingCart size={14} />
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className='p-2 sm:p-3 border-t border-gray-100 bg-white'>
                    {/* Title clamped to exactly 1 line with fixed height */}
                    <h3 className='text-xs sm:text-sm font-semibold text-gray-800 truncate leading-snug mb-1 h-5 sm:h-6'>
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className='flex items-center gap-0.5 mb-1.5'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon
                                key={index}
                                size={11}
                                className='text-transparent'
                                fill={rating >= index + 1 ? "#00C950" : "#E5E7EB"}
                            />
                        ))}
                        <span className='text-[10px] text-gray-400 ml-1'>
                            ({product.rating?.length || 0})
                        </span>
                    </div>

                    {/* Price */}
                    <div className='flex items-center justify-between gap-1'>
                        <p className='text-sm sm:text-base font-bold text-green-600 truncate'>
                            <Price value={product.price} />
                        </p>
                        <span className='text-[10px] text-gray-400 bg-gray-50 hover:bg-gray-100 px-1.5 py-0.5 rounded-full shrink-0 border border-gray-100 transition-colors'>
                            View
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard