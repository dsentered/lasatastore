"use client"

import { CategoryForm } from "@/components/category/add-category-form"
import { createCategory, getCategories } from "@/app/actions/category"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Category, CategoryFormValues } from "@/components/interface/interface"
import CategoryTable from "@/components/category-table"

export default function CategoryPage() {
    const router = useRouter();

    const [allCategories, setAllCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        const data = await getCategories();
        setAllCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    const onSubmit = async (data: CategoryFormValues) => {
        const response = await createCategory(data);
        if (response.success) {
            toast.success(response.message);
            fetchCategories();
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
                        <CategoryForm onSubmit={onSubmit} categories={allCategories} submitLabel="Add Category" />
                        <CategoryTable data={allCategories} />
                    </div>
                </div>
            </div>
        </div>
    )
}
