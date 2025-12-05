"use server"

import { prisma } from "@/lib/prisma"

interface Category {
    name: string
    slug: string
    parentId?: string | undefined
}

export const createCategory = async (data: Category) => {

    const parentId = data.parentId === "unassigned" || !data.parentId ? null : data.parentId;

    try {
        console.log("data", data);

        const existingCategory = await prisma.category.findUnique({
            where: {
                slug: data.slug
            }
        })
        if (existingCategory) {
            return {
                success: false,
                data: null,
                message: "Category with this slug already exists",
                error: null
            }
        }

        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                parentId: parentId
            }
        })
        return {
            success: true,
            data: category,
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


export const updateCategory = async (id: string, data: Category) => {
    const parentId = data.parentId === "unassigned" || !data.parentId ? null : data.parentId;

    try {
        const category = await prisma.category.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                slug: data.slug,
                parentId: parentId
            }
        })
        return {
            success: true,
            data: category,
            message: "Category updated successfully",
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

export const deleteCategory = async (id: string) => {
    try {
        const category = await prisma.category.delete({
            where: {
                id: id
            }
        })
        return {
            success: true,
            data: category,
            message: "Category deleted successfully",
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

export async function getCategories() {
    const categories = await prisma.category.findMany();
    return categories;
}
