'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { ProductDetailSkeleton } from "@/components/Skeletons";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/lib/api";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();
    const [loadingProduct, setLoadingProduct] = useState(true);
    const products = useSelector(state => state.product.list);

    useEffect(() => {
        const loadProduct = async () => {
            setLoadingProduct(true);
            try {
                // Check if the product is already in our Redux list
                const foundProduct = products.find((p) => p.id === productId);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    // Fetch directly from API
                    const data = await api.getProduct(productId);
                    if (data.success) {
                        setProduct(data.product);
                    }
                }
            } catch (error) {
                console.error("Failed to load product details:", error);
            } finally {
                setLoadingProduct(false);
            }
        }

        loadProduct();
        scrollTo(0, 0);
    }, [productId, products]);

    if (loadingProduct || !product) {
        return <ProductDetailSkeleton />;
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                <ProductDetails product={product} />

                {/* Description & Reviews */}
                <ProductDescription product={product} />
            </div>
        </div>
    );
}