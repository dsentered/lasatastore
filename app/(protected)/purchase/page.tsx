"use client"

import { createPurchase, getPurchaseOrders } from '@/app/actions/purchase';
import { PurchaseOrderFormValues } from '@/components/interface/interface';
import { PurchaseForm } from '@/components/purchase/add-purchase-form';
import { PurchaseOrder } from '@/components/interface/interface';

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import PurchaseTable from '@/components/purchase-table';

export default function Purchase() {
    const router = useRouter();
    const [allPurchaseOrders, setAllPurchaseOrders] = useState<PurchaseOrder[]>([]);


    const fetchPurchaseOrders = async () => {
        const data = await getPurchaseOrders();
        setAllPurchaseOrders(data);
    };

    useEffect(() => {
        fetchPurchaseOrders();
    }, []);


    const onSubmit = async (data: PurchaseOrderFormValues) => {
        const response = await createPurchase(data);
        if (response.success) {
            toast.success(response.message);
            fetchPurchaseOrders();
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
                        <PurchaseForm onSubmit={onSubmit} purchaseOrders={allPurchaseOrders} submitLabel="Add Purchase Order" />
                        <PurchaseTable data={allPurchaseOrders} />
                    </div>
                </div>
            </div>
        </div>
    )
}
