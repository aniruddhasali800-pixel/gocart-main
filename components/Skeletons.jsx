'use client'

// ─── Shimmer overlay (shared by all skeletons) ──────────────────────
const Shimmer = () => (
    <div className='absolute inset-0 -translate-x-full animate-[skeletonShimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent' />
)

const SkeletonBlock = ({ className = '' }) => (
    <div className={`relative overflow-hidden rounded bg-slate-200 ${className}`}>
        <Shimmer />
    </div>
)

// ─── Product Card Skeleton ──────────────────────────────────────────
export const ProductCardSkeleton = () => (
    <div className='w-full sm:w-60 bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden'>
        {/* Image area */}
        <SkeletonBlock className='h-48 sm:h-56 rounded-none rounded-t-2xl' />

        {/* Details */}
        <div className='p-3 sm:p-4 border-t border-gray-100 bg-white'>
            {/* Name */}
            <SkeletonBlock className='h-4 w-4/5 mb-2' />

            {/* Stars */}
            <div className='flex items-center gap-1 mb-2'>
                {Array(5).fill('').map((_, i) => (
                    <SkeletonBlock key={i} className='h-3 w-3 rounded-full' />
                ))}
                <SkeletonBlock className='h-3 w-6 ml-1' />
            </div>

            {/* Price + View */}
            <div className='flex items-center justify-between'>
                <SkeletonBlock className='h-5 w-20' />
                <SkeletonBlock className='h-5 w-12 rounded-full' />
            </div>
        </div>
    </div>
)

// ─── Hero Skeleton ──────────────────────────────────────────────────
export const HeroSkeleton = () => (
    <div className='mx-6'>
        <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
            {/* Main banner */}
            <SkeletonBlock className='flex-1 rounded-3xl xl:min-h-100 h-80 sm:h-96' />

            {/* Side cards */}
            <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm'>
                <SkeletonBlock className='flex-1 rounded-3xl h-40 md:h-auto' />
                <SkeletonBlock className='flex-1 rounded-3xl h-40 md:h-auto' />
            </div>
        </div>

        {/* Categories marquee skeleton */}
        <div className='overflow-hidden w-full max-w-7xl mx-auto sm:my-20 my-8'>
            <div className='flex gap-4'>
                {Array(10).fill('').map((_, i) => (
                    <SkeletonBlock key={i} className='h-9 w-24 sm:w-28 rounded-lg shrink-0' />
                ))}
            </div>
        </div>
    </div>
)

// ─── Product Section Skeleton (title + grid) ────────────────────────
export const ProductSectionSkeleton = ({ count = 4 }) => (
    <>
        {/* Title skeleton */}
        <div className='flex flex-col items-center'>
            <SkeletonBlock className='h-7 w-48 mb-2' />
            <SkeletonBlock className='h-4 w-72' />
        </div>

        {/* Product grid */}
        <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
            {Array(count).fill('').map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    </>
)

// ─── OurSpecs Skeleton ──────────────────────────────────────────────
export const OurSpecsSkeleton = () => (
    <div className='px-6 my-20 max-w-6xl mx-auto'>
        {/* Title */}
        <div className='flex flex-col items-center'>
            <SkeletonBlock className='h-7 w-52 mb-2' />
            <SkeletonBlock className='h-4 w-96 max-w-full' />
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26'>
            {Array(6).fill('').map((_, i) => (
                <div key={i} className='relative h-44 px-8 flex flex-col items-center justify-center w-full border rounded-lg border-slate-200'>
                    {/* Icon */}
                    <SkeletonBlock className='absolute -top-5 size-10 rounded-md' />
                    {/* Title */}
                    <SkeletonBlock className='h-5 w-36 mb-3' />
                    {/* Description */}
                    <SkeletonBlock className='h-3 w-48' />
                    <SkeletonBlock className='h-3 w-40 mt-2' />
                </div>
            ))}
        </div>
    </div>
)

// ─── Newsletter Skeleton ────────────────────────────────────────────
export const NewsletterSkeleton = () => (
    <div className='flex flex-col items-center mx-4 my-36'>
        <div className='flex flex-col items-center'>
            <SkeletonBlock className='h-7 w-44 mb-2' />
            <SkeletonBlock className='h-4 w-80 max-w-full' />
        </div>
        <SkeletonBlock className='h-14 w-full max-w-xl my-10 rounded-full' />
    </div>
)

// ─── Product Detail Skeleton ────────────────────────────────────────
export const ProductDetailSkeleton = () => (
    <div className='mx-6'>
        <div className='max-w-7xl mx-auto'>
            {/* Breadcrumb */}
            <div className='mt-8 mb-5'>
                <SkeletonBlock className='h-4 w-52' />
            </div>

            {/* Product details area */}
            <div className='flex max-lg:flex-col gap-12'>
                {/* Images */}
                <div className='flex max-sm:flex-col-reverse gap-3'>
                    {/* Thumbnails */}
                    <div className='flex sm:flex-col gap-3'>
                        {Array(3).fill('').map((_, i) => (
                            <SkeletonBlock key={i} className='size-26 rounded-lg' />
                        ))}
                    </div>
                    {/* Main image */}
                    <SkeletonBlock className='h-100 sm:size-113 rounded-lg' />
                </div>

                {/* Info */}
                <div className='flex-1'>
                    {/* Product name */}
                    <SkeletonBlock className='h-8 w-3/4 mb-2' />
                    <SkeletonBlock className='h-8 w-1/2 mb-3' />

                    {/* Stars */}
                    <div className='flex items-center gap-1 mt-2'>
                        {Array(5).fill('').map((_, i) => (
                            <SkeletonBlock key={i} className='h-4 w-4 rounded-full' />
                        ))}
                        <SkeletonBlock className='h-4 w-20 ml-3' />
                    </div>

                    {/* Prices */}
                    <div className='flex items-center gap-3 my-6'>
                        <SkeletonBlock className='h-8 w-28' />
                        <SkeletonBlock className='h-6 w-20' />
                    </div>

                    {/* Discount tag */}
                    <SkeletonBlock className='h-4 w-48 mb-6' />

                    {/* Add to cart button */}
                    <SkeletonBlock className='h-12 w-44 mt-10 rounded' />

                    {/* Divider */}
                    <div className='border-t border-gray-200 my-5' />

                    {/* Feature lines */}
                    <div className='flex flex-col gap-4'>
                        <SkeletonBlock className='h-4 w-56' />
                        <SkeletonBlock className='h-4 w-48' />
                        <SkeletonBlock className='h-4 w-44' />
                    </div>
                </div>
            </div>

            {/* Tabs skeleton */}
            <div className='my-18'>
                <div className='flex gap-4 border-b border-slate-200 mb-6 max-w-2xl'>
                    <SkeletonBlock className='h-8 w-28' />
                    <SkeletonBlock className='h-8 w-20' />
                </div>
                <SkeletonBlock className='h-4 w-full max-w-xl mb-2' />
                <SkeletonBlock className='h-4 w-4/5 max-w-xl mb-2' />
                <SkeletonBlock className='h-4 w-3/5 max-w-xl' />
            </div>
        </div>
    </div>
)

// ─── Orders Skeleton ────────────────────────────────────────────────
export const OrdersSkeleton = () => (
    <div className='min-h-[70vh] mx-6'>
        <div className='my-20 max-w-7xl mx-auto'>
            {/* Page title */}
            <div className='flex items-center justify-between mb-10'>
                <div>
                    <SkeletonBlock className='h-7 w-36 mb-2' />
                    <SkeletonBlock className='h-4 w-52' />
                </div>
                <SkeletonBlock className='h-4 w-20' />
            </div>

            {/* Table header (desktop) */}
            <div className='hidden md:flex gap-4 mb-6'>
                <SkeletonBlock className='h-4 w-24' />
                <SkeletonBlock className='h-4 w-24 ml-auto' />
                <SkeletonBlock className='h-4 w-24' />
                <SkeletonBlock className='h-4 w-20' />
            </div>

            {/* Order rows */}
            {Array(3).fill('').map((_, i) => (
                <div key={i} className='flex flex-col md:flex-row items-start md:items-center gap-5 py-6 border-b border-slate-100'>
                    {/* Product image + info */}
                    <div className='flex items-center gap-4 flex-1'>
                        <SkeletonBlock className='size-16 rounded-md shrink-0' />
                        <div className='flex-1'>
                            <SkeletonBlock className='h-4 w-48 mb-2' />
                            <SkeletonBlock className='h-3 w-32 mb-1' />
                            <SkeletonBlock className='h-3 w-24' />
                        </div>
                    </div>

                    {/* Price */}
                    <SkeletonBlock className='h-5 w-20' />

                    {/* Address */}
                    <div className='flex-1 max-w-xs'>
                        <SkeletonBlock className='h-3 w-full mb-1' />
                        <SkeletonBlock className='h-3 w-3/4' />
                    </div>

                    {/* Status */}
                    <SkeletonBlock className='h-7 w-24 rounded-full' />
                </div>
            ))}
        </div>
    </div>
)

// ─── Store Shop Skeleton ────────────────────────────────────────────
export const StoreShopSkeleton = () => (
    <div className='min-h-[70vh] mx-6'>
        {/* Store info banner */}
        <div className='max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs'>
            <SkeletonBlock className='size-32 sm:size-38 rounded-md shrink-0' />
            <div className='flex-1 text-center md:text-left w-full'>
                <SkeletonBlock className='h-8 w-64 mb-3 mx-auto md:mx-0' />
                <SkeletonBlock className='h-4 w-full max-w-lg mb-2 mx-auto md:mx-0' />
                <SkeletonBlock className='h-4 w-3/4 max-w-md mb-4 mx-auto md:mx-0' />
                <SkeletonBlock className='h-3 w-48 mb-2 mx-auto md:mx-0' />
                <SkeletonBlock className='h-3 w-56 mx-auto md:mx-0' />
            </div>
        </div>

        {/* Products */}
        <div className='max-w-7xl mx-auto mb-40'>
            <SkeletonBlock className='h-7 w-44 mt-12 mb-5' />
            <div className='grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                {Array(4).fill('').map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    </div>
)

// ─── Home Page Full Skeleton ────────────────────────────────────────
export const HomePageSkeleton = () => (
    <>
        <HeroSkeleton />

        {/* Latest Products section */}
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <ProductSectionSkeleton count={4} />
        </div>

        {/* Best Selling section */}
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <ProductSectionSkeleton count={8} />
        </div>

        <OurSpecsSkeleton />
        <NewsletterSkeleton />
    </>
)

// ─── Shop Page Skeleton ─────────────────────────────────────────────
export const ShopPageSkeleton = () => (
    <div className='min-h-[70vh] mx-6'>
        <div className='max-w-7xl mx-auto'>
            <SkeletonBlock className='h-8 w-44 my-6' />
            <div className='grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32'>
                {Array(8).fill('').map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    </div>
)
