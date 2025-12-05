import type { PurchaseOrderItem } from "@/generated/prisma/client";

// Local definition of purchase order statuses for client-side usage
export const purchaseOrderStatuses = ["PAID", "PARTIAL", "UNPAID"] as const;
export type PurchaseOrderStatus = typeof purchaseOrderStatuses[number];
import z from "zod";

export enum SupplierType {
    MANUFACTURER = "MANUFACTURER",
    DISTRIBUTOR = "DISTRIBUTOR",
    WHOLESALE = "WHOLESALE",
    RETAILER = "RETAILER",
    OTHER = "OTHER"
}

export enum UnitType {
    piece = "piece",
    kg = "kg",
    g = "g",
    ml = "ml",
    l = "l",
    other = "other"
}

export const brandSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters long",
    }),
});

export type BrandFormValues = z.infer<typeof brandSchema>

export interface Brand {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BrandFormProps {
    defaultValues?: BrandFormValues;
    onSubmit: (data: BrandFormValues) => Promise<any>;
    brands: Brand[];
    submitLabel?: string;
}

export const categorySchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters long",
    }),
    parentId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>

export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryFormProps {
    defaultValues?: CategoryFormValues;
    onSubmit: (data: CategoryFormValues) => Promise<any>;
    categories: Category[];
    submitLabel?: string;
}


export const supplierSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters long",
    }),
    supplierType: z.string().optional(),
    contactPerson: z.string().optional(),
    phone: z.string().regex(/^\d*$/, {
        message: "Phone must contain only numbers",
    }).optional(),
    email: z.string().optional(),
    location: z.string().optional(),
    country: z.string().optional(),
    website: z.string().optional(),
    taxPin: z.string().optional(),
    registrationNumber: z.string().optional(),
    bankAccountNumner: z.string().optional(),
    bankName: z.string().optional(),
    paymentTerms: z.string().optional(),
    logo: z.string().optional(),
    notes: z.string().optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>

export interface Supplier {
    id: string;
    name: string | null;
    slug: string;
    supplierType: SupplierType | string | null;
    contactPerson: string | null;
    phone: string | null;
    email: string | null;
    location: string | null;
    country: string | null;
    website: string | null;
    taxPin: string | null;
    registrationNumber: string | null;
    bankAccountNumner: string | null;
    bankName: string | null;
    paymentTerms: string | null;
    logo: string | null;
    notes: string | null;
    products?: Product[];
    purchaseOrder?: PurchaseOrder[];
}

export interface SupplierFormProps {
    defaultValues?: SupplierFormValues;
    onSubmit: (data: SupplierFormValues) => Promise<any>;
    suppliers: Supplier[];
    submitLabel?: string;
}

export interface Shop {
    id: string;
    name: string;
    slug: string;
    phone: string | null;
    email: string | null;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}



export interface Unit {
    id: string;
    name: string;
    abbreviation: string;
    slug: string;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}

export const productSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters long",
    }),
    description: z.string().optional(),
    batchNumber: z.string().optional(),
    barCode: z.string().optional(),
    image: z.string().optional(),
    alertQty: z.number().optional(),
    stockQty: z.number().optional(),
    sku: z.string().optional(),
    productCode: z.string().optional(),
    unitType: z.string().optional(),
    brandId: z.string().min(1, {
        message: "Brand is required",
    }),
    categoryId: z.string().min(1, {
        message: "Category is required",
    }),
});

export type ProductFormValues = z.infer<typeof productSchema>

export interface ProductFormProps {
    defaultValues?: ProductFormValues;
    onSubmit: (data: ProductFormValues) => Promise<any>;
    products: Product[];
    submitLabel?: string;
}


export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    batchNumber: string | null;
    barCode: string | null;
    image: string | null;
    alertQty: number | null;
    stockQty: number | null;
    sku: string | null;
    productCode: string | null;
    unitType: UnitType | string;
    brandId: string | null;
    categoryId: string | null;
    category?: Category;
    brand?: Brand;
    createdAt: Date;
    updatedAt: Date;
}

export const purchaseOrderSchema = z.object({
    id: z.string().optional(),
    supplierId: z.string().min(1, {
        message: "Supplier ID is required",
    }),
    supplier: z.object({
        id: z.string().min(1, {
            message: "Supplier ID is required",
        }),
        name: z.string().nullable().optional(),
        slug: z.string().min(2, {
            message: "Slug must be at least 2 characters long",
        }),
    }).optional(),
    items: z.array(z.object({
        id: z.string().min(1, {
            message: "Product ID is required",
        }),
        productName: z.string().min(2, {
            message: "Name must be at least 2 characters long",
        }),
        slug: z.string().min(2, {
            message: "Slug must be at least 2 characters long",
        }),
        quantity: z.number().optional(),
        unitCost: z.number().optional(),
        subTotal: z.number().optional(),
        currentStock: z.number().optional(),
    })),
    discount: z.number().optional(),
    notes: z.string().optional(),
    status: z.enum(['PAID', 'PARTIAL', 'UNPAID']).optional(),
    tax: z.number().optional(),
    refNo: z.string().optional(),
    totalAmount: z.number().optional(),
    balanceAmount: z.number().optional(),
    shippingCost: z.number().optional(),
});

export interface PurchaseOrder {
    id: string;
    supplierId: string;
    supplier: Supplier;
    items: (PurchaseOrderItem & { product: Product })[];
    status: PurchaseOrderStatus;
    discount: number | null;
    notes: string | null;
    tax: number | null;
    refNo: string;
    totalAmount: number;
    balanceAmount: number;
    shippingCost: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PurchaseOrderFormProps {
    defaultValues?: PurchaseOrderFormValues;
    onSubmit: (data: PurchaseOrderFormValues) => Promise<any>;
    purchaseOrders: PurchaseOrder[];
    submitLabel?: string;
}

export interface PurchaseOrderFormValues {
    id?: string;
    supplierId: string;
    supplier?: {
        id: string;
        name?: string | null;
        slug: string;
    };
    items: {
        id: string;
        productName: string;
        slug: string;
        quantity?: number;
        unitCost?: number;
        subTotal?: number;
        currentStock?: number;
    }[];
    status?: PurchaseOrderStatus;
    discount?: number;
    notes?: string;
    tax?: number;
    refNo?: string;
    totalAmount?: number;
    balanceAmount?: number;
    shippingCost?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export const itemFormSchema = z.object({
    id: z.string().min(1, {
        message: "ID is required",
    }),
    productName: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters long",
    }),
    quantity: z.number().optional(),
    unitCost: z.number().optional(),
    subTotal: z.number().optional(),
    currentStock: z.number().optional(),
});

export interface Item {
    id: string;
    productName: string;
    slug: string;
    quantity?: number;
    unitCost?: number;
    subTotal?: number;
    currentStock?: number;
}

export interface ItemFormValues {
    id: string;
    productName: string;
    slug: string;
    quantity?: number;
    unitCost?: number;
    subTotal?: number;
    currentStock?: number;
}

export interface ItemFormProps {
    defaultValues?: ItemFormValues;
    onSubmit: (data: ItemFormValues) => Promise<any>;
    items: Item[];
    submitLabel?: string;
}
