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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { toast } from 'sonner';
import slugify from 'slugify';
import { BrandFormProps, BrandFormValues, brandSchema } from '../interface/interface'

export function BrandForm({ defaultValues, onSubmit, submitLabel = "Save" }: BrandFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: defaultValues || {
            name: "",
            slug: "",
        }
    })

    const nameValue = form.watch("name");

    useEffect(() => {
        if (nameValue) {
            const slug = slugify(nameValue, { lower: true });
            form.setValue("slug", slug);
        }
    }, [nameValue, form]);

    const handleSubmit = async (data: BrandFormValues) => {
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
            <h1 className="text-2xl font-bold">Add Brand</h1>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FieldGroup className="grid md:grid-cols-4 auto-rows-min gap-6">
                    <Field className="grid gap-3">
                        <FieldLabel htmlFor="brandName">Brand Name</FieldLabel>
                        <Input
                            id="brandName"
                            type="text"
                            placeholder="Brand Name"
                            required
                            {...form.register("name")}
                        />
                        <FieldError errors={[form.formState.errors.name]} />
                    </Field>
                    <Field className="grid gap-3">
                        <FieldLabel htmlFor="brandSlug">Brand Slug</FieldLabel>
                        <Input
                            id="brandSlug"
                            type="text"
                            placeholder="Brand Slug"
                            required
                            {...form.register("slug")}
                            readOnly
                        />
                        <FieldError errors={[form.formState.errors.slug]} />
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
