"use client"

import { BrandForm } from "@/components/brand/add-brand-form"
import { createBrand } from "@/app/actions/brand"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import BrandTable from "@/components/brand-table"
import { getBrands } from "@/app/actions/brand"
import { BrandFormValues } from "@/components/interface/interface"

interface Brand {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function BrandPage() {
    const router = useRouter();

    const [allBrands, setAllBrands] = useState<Brand[]>([]);

    const fetchBrands = async () => {
        const data = await getBrands();
        setAllBrands(data);
    };

    useEffect(() => {
        fetchBrands();
    }, []);


    const onSubmit = async (data: BrandFormValues) => {
        const response = await createBrand(data);
        if (response.success) {
            toast.success(response.message);
            fetchBrands();
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
                        <BrandForm onSubmit={onSubmit} brands={allBrands} submitLabel="Add Brand" />
                        <BrandTable data={allBrands} />
                    </div>
                </div>
            </div>
        </div>
    )
}
