"use server"

import { PurchaseOrderFormValues } from "@/components/interface/interface";
import { PurchaseOrderItem, PurchaseOrderStatus, Supplier } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma"

interface PurchaseOrder {
    id: string;
    supplierId: string;
    supplier: Supplier;
    status: PurchaseOrderStatus;
    discount: String;
    notes: String;
    tax: String;
    refNo: String;
    totalAmount: String;
    balanceAmount: String;
    shippingCost: String;
    items: PurchaseOrderItem[]
}

export const createPurchase = async (data: PurchaseOrderFormValues) => {
    try {
        if (data.id) {
            const existingPurchase = await prisma.purchaseOrder.findUnique({
                where: { id: data.id }
            })
            if (existingPurchase) {
                return {
                    success: false,
                    data: null,
                    message: "Purchase with this ID already exists",
                    error: null
                }
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            const purchase = await tx.purchaseOrder.create({
                data: {
                    items: {
                        create: data.items.map((item) => ({
                            product: { connect: { id: item.id } },
                            quantity: item.quantity ?? 0,
                            productName: item.productName,
                            unitCost: item.unitCost ?? 0,
                            subTotal: item.subTotal ?? 0,
                            currentStock: item.currentStock ?? 0
                        }))
                    },
                    supplier: { connect: { id: data.supplierId } },
                    status: data.status,
                    discount: data.discount ?? 0,
                    notes: data.notes ?? "",
                    tax: data.tax ?? 0,
                    refNo: data.refNo ?? "",
                    totalAmount: data.totalAmount ?? 0,
                    balanceAmount: data.balanceAmount ?? 0,
                    shippingCost: data.shippingCost ?? null,
                }
            });

            for (const item of data.items) {
                if (item.quantity) {
                    await tx.product.update({
                        where: { id: item.id },
                        data: { stockQty: { increment: item.quantity } }
                    });
                }
            }

            return purchase;
        });

        return {
            success: true,
            data: result,
            message: "Purchase created successfully",
            error: null
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            data: null,
            message: "Something went wrong",
            error: error
        }
    }
}


export const updatePurchaseOrder = async (id: string, data: PurchaseOrderFormValues) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch existing items to revert stock
            const existingPurchase = await tx.purchaseOrder.findUnique({
                where: { id },
                include: { items: true }
            });

            if (!existingPurchase) {
                throw new Error("Purchase Order not found");
            }

            // 2. Revert stock for existing items
            for (const item of existingPurchase.items) {
                if (item.quantity) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stockQty: { decrement: item.quantity } }
                    });
                }
            }

            // 3. Update Purchase Order (replace items)
            const purchase = await tx.purchaseOrder.update({
                where: { id },
                data: {
                    items: {
                        deleteMany: {},
                        create: data.items.map((item) => ({
                            product: { connect: { id: item.id } },
                            quantity: item.quantity ?? 0,
                            productName: item.productName,
                            unitCost: item.unitCost ?? 0,
                            subTotal: item.subTotal ?? 0,
                            currentStock: item.currentStock ?? 0
                        }))
                    },
                    supplier: { connect: { id: data.supplierId } },
                    status: data.status,
                    discount: data.discount ?? 0,
                    notes: data.notes ?? "",
                    tax: data.tax ?? 0,
                    refNo: data.refNo ?? "",
                    totalAmount: data.totalAmount ?? 0,
                    balanceAmount: data.balanceAmount ?? 0,
                    shippingCost: data.shippingCost ?? null,
                }
            });

            // 4. Apply stock for new items
            for (const item of data.items) {
                if (item.quantity) {
                    await tx.product.update({
                        where: { id: item.id },
                        data: { stockQty: { increment: item.quantity } }
                    });
                }
            }

            return purchase;
        });

        return {
            success: true,
            data: result,
            message: "Purchase updated successfully",
            error: null
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            data: null,
            message: "Something went wrong",
            error: error
        }
    }
}

export const deletePurchaseOrder = async (id: string) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch existing items to revert stock
            const existingPurchase = await tx.purchaseOrder.findUnique({
                where: { id },
                include: { items: true }
            });

            if (!existingPurchase) {
                throw new Error("Purchase Order not found");
            }

            // 2. Revert stock for existing items
            for (const item of existingPurchase.items) {
                if (item.quantity) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stockQty: { decrement: item.quantity } }
                    });
                }
            }

            // 3. Delete Purchase Order
            return await tx.purchaseOrder.delete({
                where: { id }
            });
        });

        return {
            success: true,
            data: result,
            message: "Purchase deleted successfully",
            error: null
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            data: null,
            message: "Something went wrong",
            error: error
        }
    }
}

export const getPurchaseOrders = async () => {
    const purchase = await prisma.purchaseOrder.findMany({
        include: {
            supplier: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    return purchase;
}
