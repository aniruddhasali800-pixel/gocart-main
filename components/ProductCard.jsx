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
                rounded-2xl
                shadow-md hover:shadow-xl
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
                    <div className='absolute top-2 right-2 w-16 h-16 bg-green-100 rounded-full opacity-50 blur-xl'></div>
                    <div className='absolute bottom-2 left-2 w-12 h-12 bg-blue-100 rounded-full opacity-50 blur-xl'></div>

                    <Image
                        width={500}
                        height={500}
                        className='relative z-10 max-h-[75%] max-w-[75%] w-auto object-contain group-hover:scale-110 transition-transform duration-400 drop-shadow-md'
                        src={product.images[0]}
                        alt={product.name}
                    />

                    {/* Hover cart icon overlay */}
                    <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3'>
                        <div className='bg-green-500 text-white rounded-full p-2 shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                            <ShoppingCart size={16} />
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className='p-3 sm:p-4 border-t border-gray-100 bg-white'>
                    {/* Title clamped to exactly 1 line with fixed height */}
                    <h3 className='text-sm sm:text-base font-semibold text-gray-800 truncate leading-snug mb-1 h-5 sm:h-6'>
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className='flex items-center gap-1 mb-2'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon
                                key={index}
                                size={13}
                                className='text-transparent'
                                fill={rating >= index + 1 ? "#00C950" : "#E5E7EB"}
                            />
                        ))}
                        <span className='text-xs text-gray-400 ml-1'>
                            ({product.rating?.length || 0})
                        </span>
                    </div>

                    {/* Price */}
                    <div className='flex items-center justify-between'>
                        <p className='text-base sm:text-lg font-bold text-green-600 truncate'>
                            <Price value={product.price} />
                        </p>
                        <span className='text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0'>
                            View
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard