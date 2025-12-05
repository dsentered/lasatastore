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
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import slugify from 'slugify';
import { SupplierFormProps, SupplierFormValues, supplierSchema } from '../interface/interface'
import { SupplierType } from '@/generated/prisma/enums'

export function SupplierForm({ defaultValues, onSubmit, submitLabel = "Save" }: SupplierFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SupplierFormValues>({
        resolver: zodResolver(supplierSchema),
        defaultValues: defaultValues || {
            slug: "",
            name: "",
            location: "",
            contactPerson: "",
            phone: "",
            email: "",
            supplierType: "OTHER",
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

    const nameValue = form.watch("name");

    const supplierTypes = Object.values(SupplierType);

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
        <div className='grid grid-rows gap-3 p-6 bg-slate-800 rounded-md'>
            <h1 className="text-2xl font-bold">Add Supplier</h1>
            <form onSubmit={form.handleSubmit(formSubmit)}>
                <FieldGroup className="grid md:grid-cols-4 auto-rows-min gap-6">
                    <Field className="grid gap-3">
                        <FieldLabel htmlFor="supplierName">Name</FieldLabel>
                        <Input
                            id="supplierName"
                            type="text"
                            placeholder="Supplier Name"
                            required
                            {...form.register("name")}
                        />
                        <FieldError errors={[form.formState.errors.name]} />
                    </Field>
                    <Field className="grid gap-3">
                        <FieldLabel htmlFor="supplierSlug">Slug</FieldLabel>
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
                        <FieldLabel htmlFor="supplierPhone">Phone</FieldLabel>
                        <Input
                            id="supplierPhone"
                            type="text"
                            placeholder="Supplier Phone"
                            {...form.register("phone")}
                        />
                    </Field>

                    <Field className="grid gap-3">
                        <FieldLabel htmlFor="supplierContactPerson">Contact Person</FieldLabel>
                        <Input
                            id="supplierContactPerson"
                            type="text"
                            placeholder="Supplier Contact Person"
                            {...form.register("contactPerson")}
                        />
                    </Field>

                    <Field className="grid gap-3">
                        <FieldLabel htmlFor="supplierType">Supplier Type</FieldLabel>
                        <Controller
                            control={form.control}
                            name="supplierType"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={supplierTypes[4]} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a supplier type" />
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
                    </Field>

                    <Field className="grid gap-3">
                        <FieldLabel htmlFor="supplierEmail">Email</FieldLabel>
                        <Input
                            id="supplierEmail"
                            type="email"
                            placeholder="Supplier Email"
                            {...form.register("email")}
                        />
                    </Field>

                    <Field className="grid gap-3">
                        <FieldLabel htmlFor="supplierLocation">Location</FieldLabel>
                        <Input
                            id="supplierLocation"
                            type="text"
                            placeholder="Supplier Location"
                            {...form.register("location")}
                        />
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
                    </Field>

                    <Field className="grid content-end">
                        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : submitLabel}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}
