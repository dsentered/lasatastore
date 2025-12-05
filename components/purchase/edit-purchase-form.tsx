"use client"

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import slugify from 'slugify';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { IconEdit } from '@tabler/icons-react'
import { Product, PurchaseOrderFormProps, PurchaseOrderFormValues, purchaseOrderSchema, purchaseOrderStatuses, Supplier } from '../interface/interface'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { getSuppliers } from '@/app/actions/supplier';
import { getProducts } from '@/app/actions/product';

export function EditPurchaseOrderForm({ defaultValues, onSubmit, submitLabel = "Save" }: PurchaseOrderFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [fetchedSuppliers, fetchedProducts] = await Promise.all([
                getSuppliers(),
                getProducts()
            ]);
            setSuppliers(fetchedSuppliers);
            setProducts(fetchedProducts as unknown as Product[]);
        };
        fetchData();
    }, []);

    const form = useForm<PurchaseOrderFormValues>({
        resolver: zodResolver(purchaseOrderSchema),
        defaultValues: defaultValues || {
            supplierId: "",
            supplier: undefined,
            status: 'UNPAID',
            totalAmount: 0,
            notes: "",
            discount: 0,
            tax: 0,
            refNo: "",
            balanceAmount: 0,
            shippingCost: 0,
            items: [],
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const watchedItems = useWatch({
        control: form.control,
        name: "items"
    });

    const watchedTax = useWatch({ control: form.control, name: "tax" });
    const watchedDiscount = useWatch({ control: form.control, name: "discount" });
    const watchedShipping = useWatch({ control: form.control, name: "shippingCost" });

    useEffect(() => {
        const itemsTotal = watchedItems?.reduce((sum, item) => {
            const quantity = item.quantity || 0;
            const unitCost = item.unitCost || 0;
            return sum + (quantity * unitCost);
        }, 0) || 0;

        const tax = Number(watchedTax) || 0;
        const discount = Number(watchedDiscount) || 0;
        const shipping = Number(watchedShipping) || 0;

        const totalAmount = parseFloat((itemsTotal + tax + shipping - discount).toFixed(2));

        form.setValue("totalAmount", totalAmount);
        form.setValue("balanceAmount", totalAmount); // Assuming initial balance is total

        // Also update subtotal for each item if needed, but better to do it on change
        // We can't easily update item subtotal here without causing loops if we watch items
        // So we'll calculate item subtotal in the render or on change handler
    }, [watchedItems, watchedTax, watchedDiscount, watchedShipping, form]);

    const purchaseOrderSubmit = async (data: PurchaseOrderFormValues) => {
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
                    <SheetTitle>Edit Purchase Order</SheetTitle>
                    <SheetDescription>
                        Make changes to your purchase order here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={form.handleSubmit(purchaseOrderSubmit)}>
                    <FieldGroup className="grid md:grid-cols-4 auto-rows-min gap-6">
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="supplierId">Supplier</FieldLabel>
                            <Controller
                                control={form.control}
                                name="supplierId"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Supplier</SelectLabel>
                                                {suppliers.map((supplier) => (
                                                    <SelectItem key={supplier.id} value={supplier.id}>
                                                        {supplier.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[form.formState.errors.supplierId]} />
                        </Field>
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <Controller
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                {purchaseOrderStatuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError errors={[form.formState.errors.status]} />
                        </Field>
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="refNo">Reference Number</FieldLabel>
                            <Input
                                id="refNo"
                                type="text"
                                placeholder="Reference Number"
                                {...form.register("refNo")}
                            />
                            <FieldError errors={[form.formState.errors.refNo]} />
                        </Field>
                        <Field className='grid gap-3'>
                            <FieldLabel htmlFor="notes">Notes</FieldLabel>
                            <Input
                                id="notes"
                                type="text"
                                placeholder="Notes"
                                {...form.register("notes")}
                            />
                            <FieldError errors={[form.formState.errors.notes]} />
                        </Field>
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="discount">Discount</FieldLabel>
                            <Input
                                id="discount"
                                type="number"
                                placeholder="Discount"
                                {...form.register("discount", { valueAsNumber: true })}
                            />
                            <FieldError errors={[form.formState.errors.discount]} />
                        </Field>
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="tax">Tax</FieldLabel>
                            <Input
                                id="tax"
                                type="number"
                                placeholder="Tax"
                                {...form.register("tax", { valueAsNumber: true })}
                            />
                            <FieldError errors={[form.formState.errors.tax]} />
                        </Field>
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="shippingCost">Shipping Cost</FieldLabel>
                            <Input
                                id="shippingCost"
                                type="number"
                                placeholder="Shipping Cost"
                                {...form.register("shippingCost", { valueAsNumber: true })}
                            />
                            <FieldError errors={[form.formState.errors.shippingCost]} />
                        </Field>
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="totalAmount">Total Amount</FieldLabel>
                            <Input
                                id="totalAmount"
                                type="number"
                                placeholder="Total Amount"
                                {...form.register("totalAmount", { valueAsNumber: true })}
                                readOnly
                            />
                            <FieldError errors={[form.formState.errors.totalAmount]} />
                        </Field>
                        <Field className="grid gap-3">
                            <FieldLabel htmlFor="balanceAmount">Balance Amount</FieldLabel>
                            <Input
                                id="balanceAmount"
                                type="number"
                                placeholder="Balance Amount"
                                {...form.register("balanceAmount", { valueAsNumber: true })}
                                readOnly
                            />
                            <FieldError errors={[form.formState.errors.balanceAmount]} />
                        </Field>
                        <div className="col-span-full space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Items</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ id: "", productName: "", slug: "", quantity: 0, unitCost: 0, subTotal: 0, currentStock: 0 })}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Item
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border p-4 rounded-md bg-slate-900/50">
                                        <div className="col-span-1 md:col-span-4">
                                            <FieldLabel>Product</FieldLabel>
                                            <Controller
                                                control={form.control}
                                                name={`items.${index}.id`}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        onValueChange={(val) => {
                                                            onChange(val);
                                                            const product = products.find(p => p.id === val);
                                                            if (product) {
                                                                form.setValue(`items.${index}.productName`, product.name);
                                                                form.setValue(`items.${index}.slug`, product.slug);
                                                                form.setValue(`items.${index}.currentStock`, product.stockQty || 0);
                                                            }
                                                        }}
                                                        value={value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a product" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Product</SelectLabel>
                                                                {products.map((product) => (
                                                                    <SelectItem key={product.id} value={product.id}>
                                                                        {product.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                            <FieldLabel>Quantity</FieldLabel>
                                            <Input
                                                type="number"
                                                {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                            <FieldLabel>Unit Cost</FieldLabel>
                                            <Input
                                                type="number"
                                                {...form.register(`items.${index}.unitCost`, { valueAsNumber: true })}
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                            <FieldLabel>Subtotal</FieldLabel>
                                            <div className="h-10 px-3 py-2 border rounded-md bg-slate-800 flex items-center text-sm">
                                                {((watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.unitCost || 0)).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="col-span-1 md:col-span-1">
                                            <FieldLabel>Stock</FieldLabel>
                                            <div className="h-10 px-3 py-2 border rounded-md bg-slate-800 flex items-center text-sm">
                                                {watchedItems?.[index]?.currentStock}
                                            </div>
                                        </div>

                                        <div className="col-span-1 md:col-span-1">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <FieldError errors={[form.formState.errors.items]} />
                        </div>
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
