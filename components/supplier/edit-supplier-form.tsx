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
import { SupplierFormProps, SupplierFormValues, supplierSchema, SupplierType } from '../interface/interface'

const supplierTypes = Object.values(SupplierType);

export function EditSupplierForm({ defaultValues, onSubmit, submitLabel = "Save" }: SupplierFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SupplierFormValues>({
        resolver: zodResolver(supplierSchema),
        defaultValues: defaultValues || {
            name: "",
            slug: "",
            location: "",
            contactPerson: "",
            phone: "",
            email: "",
            supplierType: "",
            website: "",
            taxPin: "",
            registrationNumber: "",
            bankAccountNumner: "",
            bankName: "",
            paymentTerms: "",
            logo: "",
            notes: "",
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

    const formSubmit = async (data: SupplierFormValues) => {
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
                    <SheetTitle>Edit Supplier</SheetTitle>
                    <SheetDescription>
                        Make changes to your supplier here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={form.handleSubmit(formSubmit)}>
                    <FieldGroup>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="SupplierName">Supplier Name</FieldLabel>
                                <Input
                                    id="SupplierName"
                                    type="text"
                                    placeholder="Supplier Name"
                                    required
                                    {...form.register("name")}
                                />
                                <FieldError errors={[form.formState.errors.name]} />
                            </Field>
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="supplierSlug">Supplier Slug</FieldLabel>
                                <Input
                                    id="supplierSlug"
                                    type="text"
                                    placeholder="Supplier Slug"
                                    required
                                    {...form.register("slug")}
                                    readOnly
                                />
                                <FieldError errors={[form.formState.errors.slug]} />
                            </Field>
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="supplierType">Supplier Type</FieldLabel>
                                <Controller
                                    control={form.control}
                                    name="supplierType"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select supplier type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Supplier Type</SelectLabel>
                                                    {supplierTypes.map(element => (
                                                        <SelectItem key={element} value={element}>
                                                            {element}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError errors={[form.formState.errors.supplierType]} />
                            </Field>
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="contactPerson">Contact Person</FieldLabel>
                                <Input
                                    id="contactPerson"
                                    type="text"
                                    placeholder="Contact Person"
                                    {...form.register("contactPerson")}
                                />
                                <FieldError errors={[form.formState.errors.contactPerson]} />
                            </Field>
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="Phone"
                                    {...form.register("phone")}
                                />
                                <FieldError errors={[form.formState.errors.phone]} />
                            </Field>
                            <Field className="grid gap-3 hidden">
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    {...form.register("email")}
                                />
                                <FieldError errors={[form.formState.errors.email]} />
                            </Field>
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="location">Location</FieldLabel>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="Location"
                                    {...form.register("location")}
                                />
                                <FieldError errors={[form.formState.errors.location]} />
                            </Field>
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="supplierBankAccountNumber">Bank Account Number</FieldLabel>
                                <Input
                                    id="supplierBankAccountNumber"
                                    type="text"
                                    placeholder="Supplier Bank Account Number"
                                    {...form.register("bankAccountNumner")}
                                />
                            </Field>

                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="supplierBankName">Bank Name</FieldLabel>
                                <Input
                                    id="supplierBankName"
                                    type="text"
                                    placeholder="Supplier Bank Name"
                                    {...form.register("bankName")}
                                />
                            </Field>

                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="supplierNotes">Notes</FieldLabel>
                                <Input
                                    id="supplierNotes"
                                    type="text"
                                    placeholder="Supplier Notes"
                                    {...form.register("notes")}
                                />
                                <FieldError errors={[form.formState.errors.notes]} />
                            </Field>
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
