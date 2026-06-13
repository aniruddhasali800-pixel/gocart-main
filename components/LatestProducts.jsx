'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { ProductCardSkeleton } from './Skeletons'

const LatestProducts = () => {

    const displayQuantity = 4
    const products = useSelector(state => state.product.list)
    const loading = useSelector(state => state.product.loading)

    return (
        <div className='px-6 my-30 max-w-7xl mx-auto'>
            <Title title='Latest Products' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {loading || products.length === 0
                    ? Array(displayQuantity).fill('').map((_, i) => <ProductCardSkeleton key={i} />)
                    : products.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, displayQuantity).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))
                }
            </div>
        </div>
    )
}

export default LatestProducts