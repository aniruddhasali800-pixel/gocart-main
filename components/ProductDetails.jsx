'use client'

import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import Price from "./Price";
import { toast } from "react-hot-toast";

const ProductDetails = ({ product }) => {

    const productId = product.id;

    const cart = useSelector(state => state.cart.cartItems);

    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0]);

    const shareProduct = () => {
        let productUrl = typeof window !== 'undefined' ? window.location.href : '';
        // Replace localhost origin (like http://localhost:3000) with the production domain
        productUrl = productUrl.replace(/^https?:\/\/localhost:\d+/i, 'https://www.binarycomputers.shop');

        const message = `Check out this product: *${product.name}*\nPrice: Rs. ${product.price}\nLink: ${productUrl}`;
        
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(message)
                .then(() => toast.success("Product details and link copied to clipboard!"))
                .catch(() => {});
        }

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    const averageRating = Array.isArray(product.rating) && product.rating.length > 0 
        ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length 
        : 0;
    
    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    <Image src={mainImage} alt="" width={250} height={250} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{Array.isArray(product.rating) ? product.rating.length : 0} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> <Price value={product.price} /> </p>
                    <p className="text-xl text-slate-500 line-through"><Price value={product.mrp} /></p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>
                <div className="flex items-end gap-5 mt-10">
                    <button 
                        onClick={shareProduct} 
                        className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 text-sm font-medium rounded active:scale-95 transition flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.435 1.451 5.443 0 9.87-4.427 9.874-9.875.002-2.639-1.025-5.12-2.892-6.989C17.198 1.87 14.716.843 12.012.843c-5.45 0-9.88 4.43-9.884 9.878-.001 1.968.512 3.89 1.488 5.607L2.615 21.61l5.412-1.42.02.01zM17.116 14c-.28-.14-1.65-.814-1.906-.907-.256-.093-.442-.14-.627.14-.185.28-.717.907-.88 1.092-.162.185-.325.21-.605.07-.28-.14-1.18-.435-2.25-1.39-.83-.74-1.39-1.654-1.55-1.933-.163-.28-.018-.43.122-.57.126-.126.28-.326.42-.49.14-.162.186-.28.28-.465.093-.186.046-.35-.02-.49-.07-.14-.627-1.512-.86-2.07-.226-.547-.456-.473-.627-.482-.162-.008-.348-.01-.534-.01s-.488.07-.744.35c-.256.28-1.04 1.016-1.04 2.479 0 1.462 1.063 2.875 1.213 3.074.15.2 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.57-.085 1.65-.675 1.884-1.326.233-.65.233-1.21.163-1.325-.07-.116-.256-.162-.536-.302z"/>
                        </svg>
                        Share on WhatsApp
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails