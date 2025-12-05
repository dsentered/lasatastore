"use server"

import { prisma } from "@/lib/prisma"

interface Shop {
    name: string
    slug: string
    phone: string
    email: string
    location: string
    adminId: string
}

export const createShop = async (data: Shop) => {

    try {
        console.log("data", data);

        const existingShop = await prisma.shop.findUnique({
            where: {
                slug: data.slug
            }
        })
        if (existingShop) {
            return {
                success: false,
                data: null,
                message: "Shop with this slug already exists",
                error: null
            }
        }

        const shop = await prisma.shop.create({
            data: {
                name: data.name,
                slug: data.slug,
                phone: data.phone,
                email: data.email,
                location: data.location,
                adminId: data.adminId,
            }
        })
        return {
            success: true,
            data: shop,
            message: "Shop created successfully",
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


export const updateShop = async (id: string, data: Shop) => {
    try {
        const shop = await prisma.shop.update({
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
            data: shop,
            message: "Shop updated successfully",
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

export const deleteShop = async (id: string) => {
    try {
        const shop = await prisma.shop.delete({
            where: {
                id: id
            }
        })
        return {
            success: true,
            data: shop,
            message: "Shop deleted successfully",
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

export const getShops = async () => {
    const shops = await prisma.shop.findMany();
    return shops;
}
