'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list) || []

    const sortedProducts = products.slice().sort((a, b) => {
        const bRatingCount = Array.isArray(b?.rating) ? b.rating.length : 0;
        const aRatingCount = Array.isArray(a?.rating) ? a.rating.length : 0;
        return bRatingCount - aRatingCount;
    });

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Best Selling' description={`Showing ${sortedProducts.length < displayQuantity ? sortedProducts.length : displayQuantity} of ${sortedProducts.length} products`} href='/shop' />
            <div className='mt-12  grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                {sortedProducts.slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling