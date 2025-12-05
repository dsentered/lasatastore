"use server"

import { SupplierType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma"
import { Supplier, SupplierFormValues } from "@/components/interface/interface";


export const createSupplier = async (data: SupplierFormValues) => {

    try {
        const existingSupplier = await prisma.supplier.findUnique({
            where: {
                slug: data.slug
            }
        })
        if (existingSupplier) {
            return {
                success: false,
                data: null,
                message: "Supplier with this slug already exists",
                error: null
            }
        }

        const supplier = await prisma.supplier.create({
            data: {
                slug: data.slug,
                name: data.name,
                supplierType: data.supplierType ? (data.supplierType as SupplierType) : null as any,
                contactPerson: data.contactPerson,
                phone: data.phone || undefined,
                email: data.email || undefined,
                location: data.location,
                country: data.country,
                website: data.website,
                taxPin: data.taxPin,
                registrationNumber: data.registrationNumber || undefined,
                bankAccountNumner: data.bankAccountNumner,
                bankName: data.bankName,
                paymentTerms: data.paymentTerms,
                logo: data.logo,
                notes: data.notes,
            }
        })
        return {
            success: true,
            data: supplier,
            message: "Supplier created successfully",
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


export const updateSupplier = async (id: string, data: SupplierFormValues) => {
    try {
        const supplier = await prisma.supplier.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                slug: data.slug,
                supplierType: data.supplierType ? (data.supplierType as SupplierType) : null as any,
                contactPerson: data.contactPerson || null,
                phone: data.phone || null,
                email: data.email || null,
                location: data.location || null,
                country: data.country || null,
                website: data.website || null,
                taxPin: data.taxPin || null,
                registrationNumber: data.registrationNumber || null,
                bankAccountNumner: data.bankAccountNumner || null,
                bankName: data.bankName || null,
                paymentTerms: data.paymentTerms || null,
                logo: data.logo || null,
                notes: data.notes || null,
            }
        })
        return {
            success: true,
            data: supplier,
            message: "Supplier updated successfully",
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

export const deleteSupplier = async (id: string) => {
    try {
        const supplier = await prisma.supplier.delete({
            where: {
                id: id
            }
        })
        return {
            success: true,
            data: supplier,
            message: "Supplier deleted successfully",
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

export const getSuppliers = async () => {
    const suppliers = await prisma.supplier.findMany();
    // console.log("suppliers", suppliers);
    return suppliers;
}
