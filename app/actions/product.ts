"use server"

import { prisma } from "@/lib/prisma"
import { ProductFormValues, UnitType } from "@/components/interface/interface";


export const createProduct = async (data: ProductFormValues) => {

    try {
        const existingProduct = await prisma.product.findUnique({
            where: {
                slug: data.slug
            }
        })
        if (existingProduct) {
            return {
                success: false,
                data: null,
                message: "Product with this slug already exists",
                error: null
            }
        }

        const product = await prisma.product.create({
            data: {
                slug: data.slug,
                name: data.name,
                description: data.description ?? undefined,
                batchNumber: data.batchNumber ?? undefined,
                barCode: data.barCode ?? undefined,
                image: data.image ?? undefined,
                alertQty: data.alertQty ?? undefined,
                stockQty: data.stockQty ?? undefined,
                sku: data.sku ?? undefined,
                productCode: data.productCode ?? undefined,
                unitType: data.unitType ? (data.unitType as UnitType) : null as any,
                brandId: data.brandId,
                categoryId: data.categoryId,
            }
        })
        return {
            success: true,
            data: product,
            message: "Product created successfully",
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


export const updateProduct = async (id: string, data: ProductFormValues) => {
    try {
        const product = await prisma.product.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                batchNumber: data.batchNumber,
                barCode: data.barCode,
                image: data.image,
                alertQty: data.alertQty ?? undefined,
                stockQty: data.stockQty ?? undefined,
                sku: data.sku,
                productCode: data.productCode,
                unitType: data.unitType ? (data.unitType as UnitType) : null as any,
                brandId: data.brandId,
                categoryId: data.categoryId,
            }
        })
        return {
            success: true,
            data: product,
            message: "Product updated successfully",
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

export const deleteProduct = async (id: string) => {
    try {
        const product = await prisma.product.delete({
            where: {
                id: id
            }
        })
        return {
            success: true,
            data: product,
            message: "Product deleted successfully",
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

export const getProducts = async () => {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            brand: true
        }
    });
    return products;
}
