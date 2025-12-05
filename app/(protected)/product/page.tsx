"use client"

import { createProduct, getProducts } from "@/app/actions/product"
import { Product, ProductFormValues } from "@/components/interface/interface"
import ProductTable from "@/components/product-table"
import { ProductForm } from "@/components/product/add-product-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ProductPage() {
    const router = useRouter();

    const [allProducts, setAllProducts] = useState<Product[]>([]);


    const fetchProducts = async () => {
        const data = await getProducts();
        setAllProducts(data as unknown as Product[]);
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const onSubmit = async (data: ProductFormValues) => {
        const response = await createProduct(data);
        if (response.success) {
            toast.success(response.message);
            fetchProducts();
            router.refresh();
        } else {
            toast.error(response.message);
        }
    }
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex flex-1 flex-col gap-4 px-4 md:px-6">
                        <ProductForm onSubmit={onSubmit} products={allProducts} submitLabel="Add Product" />
                        <ProductTable data={allProducts} />
                    </div>
                </div>
            </div>
        </div>
    )
}
