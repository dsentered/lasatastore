"use client"

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import slugify from 'slugify';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { IconEdit } from '@tabler/icons-react'
import { ProductFormProps, ProductFormValues, productSchema, UnitType } from '../interface/interface'
import { Brand, Category } from '@/generated/prisma/client'
import { getCategories } from '@/app/actions/category'
import { getBrands } from '@/app/actions/brand'

export function EditProductForm({ defaultValues, onSubmit, submitLabel = "Save" }: ProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const unitTypes = Object.values(UnitType);

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getCategories();
            setCategories(categories);
        };
        fetchCategories();
    }, []);


    useEffect(() => {
        const fetchBrands = async () => {
            const brands = await getBrands();
            setBrands(brands);
        };
        fetchBrands();
    }, []);


    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: defaultValues || {
            slug: "",
            name: "",
            description: "",
            batchNumber: "",
            barCode: "",
            image: "",
            alertQty: 0,
            stockQty: 0,
            sku: "",
            productCode: "",
            unitType: "",
            brandId: "",
            categoryId: "",
        }
    })

    // Update form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        }
    }, [defaultValues, form]);

    const nameValue = form.watch("name");

    useEffect(() => {
        if (nameValue) {
            const slug = slugify(nameValue, { lower: true });
            form.setValue("slug", slug);
        }
    }, [nameValue, form]);

    const formSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            if (!defaultValues) {
                form.reset();
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="default" className='cursor-pointer'><IconEdit size="icon" />Edit</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Product</SheetTitle>
                    <SheetDescription>
                        Make changes to your product here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={form.handleSubmit(formSubmit)}>
                    <FieldGroup className="grid md:grid-cols-4 auto-rows-min gap-6">
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Name"
                                required
                                {...form.register("name")}
                            />
                            <FieldError errors={[form.formState.errors.name]} />
                        </Field>
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="slug">Slug</FieldLabel>
                            <Input
                                id="slug"
                                type="text"
                                placeholder="Slug"
                                required
                                {...form.register("slug")}
                                readOnly
                            />
                            <FieldError errors={[form.formState.errors.slug]} />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Input
                                id="description"
                                type="text"
                                placeholder="Description"
                                {...form.register("description")}
                            />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="batchNumber">Batch Number</FieldLabel>
                            <Input
                                id="batchNumber"
                                type="text"
                                placeholder="Batch Number"
                                {...form.register("batchNumber")}
                            />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="barCode">Bar Code</FieldLabel>
                            <Input
                                id="barCode"
                                type="text"
                                placeholder="Bar Code"
                                {...form.register("barCode")}
                            />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="image">Image</FieldLabel>
                            <Input
                                id="image"
                                type="text"
                                placeholder="Image"
                                {...form.register("image")}
                            />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="alertQty">Alert Qty</FieldLabel>
                            <Input
                                id="alertQty"
                                type="number"
                                placeholder="Alert Qty"
                                {...form.register("alertQty", { valueAsNumber: true })}
                            />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="stockQty">Stock Qty</FieldLabel>
                            <Input
                                id="stockQty"
                                type="number"
                                placeholder="Stock Qty"
                                {...form.register("stockQty", { valueAsNumber: true })}
                            />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="sku">SKU</FieldLabel>
                            <Input
                                id="sku"
                                type="text"
                                placeholder="SKU"
                                required
                                {...form.register("sku")}
                            />
                            <FieldError errors={[form.formState.errors.sku]} />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="productCode">Product Code</FieldLabel>
                            <Input
                                id="productCode"
                                type="text"
                                placeholder="Product Code"
                                required
                                {...form.register("productCode")}
                            />
                            <FieldError errors={[form.formState.errors.productCode]} />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="unitType">Unit Type</FieldLabel>
                            <Controller
                                control={form.control}
                                name="unitType"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={unitTypes[4]} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a unit type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Unit Type</SelectLabel>
                                                {unitTypes.map(element => (
                                                    <SelectItem key={element} value={element}>
                                                        {element}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[form.formState.errors.unitType]} />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="brandId">Brand</FieldLabel>
                            <Controller
                                control={form.control}
                                name="brandId"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Brand</SelectLabel>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[form.formState.errors.brandId]} />
                        </Field>

                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                            <Controller
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[form.formState.errors.categoryId]} />
                        </Field>

                    </FieldGroup>
                    <SheetFooter>
                        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : submitLabel}
                        </Button>
                        <SheetClose asChild>
                            <Button type="button" variant="outline" className='cursor-pointer'>Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
