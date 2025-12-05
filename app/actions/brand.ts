"use server"

import { prisma } from "@/lib/prisma"

interface Brand {
    name: string
    slug: string
}

export const createBrand = async (data: Brand) => {

    try {
        console.log("data", data);

        const existingBrand = await prisma.brand.findUnique({
            where: {
                slug: data.slug
            }
        })
        if (existingBrand) {
            return {
                success: false,
                data: null,
                message: "Brand with this slug already exists",
                error: null
            }
        }

        const brand = await prisma.brand.create({
            data: {
                name: data.name,
                slug: data.slug,
            }
        })
        return {
            success: true,
            data: brand,
            message: "Category created successfully",
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


export const updateBrand = async (id: string, data: Brand) => {
    try {
        const brand = await prisma.brand.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                slug: data.slug,
            }
        })
        return {
            success: true,
            data: brand,
            message: "Brand updated successfully",
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

export const deleteBrand = async (id: string) => {
    try {
        const brand = await prisma.brand.delete({
            where: {
                id: id
            }
        })
        return {
            success: true,
            data: brand,
            message: "Brand deleted successfully",
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

export const getBrands = async () => {
    const brands = await prisma.brand.findMany();
    return brands;
}
