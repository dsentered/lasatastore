"use client"

import { createSupplier, getSuppliers } from "@/app/actions/supplier"
import { Supplier, SupplierFormValues } from "@/components/interface/interface"
import SupplierTable from "@/components/supplier-table"
import { SupplierForm } from "@/components/supplier/add-supplier-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function SupplierPage() {
    const router = useRouter();

    const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);


    const fetchSuppliers = async () => {
        const data = await getSuppliers();
        setAllSuppliers(data as unknown as Supplier[]);
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);


    const onSubmit = async (data: SupplierFormValues) => {
        const response = await createSupplier(data);
        if (response.success) {
            toast.success(response.message);
            fetchSuppliers();
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
                        <SupplierForm onSubmit={onSubmit} suppliers={allSuppliers} submitLabel="Add Supplier" />
                        <SupplierTable data={allSuppliers} />
                    </div>
                </div>
            </div>
        </div>
    )
}
