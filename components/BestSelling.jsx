'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { ProductCardSkeleton } from './Skeletons'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list) || []
    const loading = useSelector(state => state.product.loading)

    const sortedProducts = products.slice().sort((a, b) => {
        const bRatingCount = Array.isArray(b?.rating) ? b.rating.length : 0;
        const aRatingCount = Array.isArray(a?.rating) ? a.rating.length : 0;
        return bRatingCount - aRatingCount;
    });

    return (
        <div className='px-6 my-30 max-w-7xl mx-auto'>
            <Title title='Best Selling' description={`Showing ${sortedProducts.length < displayQuantity ? sortedProducts.length : displayQuantity} of ${sortedProducts.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
                {loading || products.length === 0
                    ? Array(displayQuantity).fill('').map((_, i) => <ProductCardSkeleton key={i} />)
                    : sortedProducts.slice(0, displayQuantity).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSelling