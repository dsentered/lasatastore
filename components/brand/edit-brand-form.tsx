"use client"

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { toast } from 'sonner';
import slugify from 'slugify';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { IconEdit } from '@tabler/icons-react'
import { BrandFormProps, BrandFormValues, brandSchema } from '../interface/interface'

export function EditBrandForm({ defaultValues, onSubmit, submitLabel = "Save" }: BrandFormProps) {
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
        <form>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="default" className='cursor-pointer'><IconEdit size="icon" />Edit</Button>
                </SheetTrigger>

                <FieldGroup>
                    <SheetContent>

                        <SheetHeader>
                            <SheetTitle>Edit Category</SheetTitle>
                            <SheetDescription>
                                Make changes to your category here. Click save when you&apos;re done.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
                                <Input
                                    id="categoryName"
                                    type="text"
                                    placeholder="Category Name"
                                    required
                                    {...form.register("name")}
                                />
                                <FieldError errors={[form.formState.errors.name]} />
                            </Field>
                            <Field className="grid gap-3">
                                <FieldLabel htmlFor="categorySlug">Category Slug</FieldLabel>
                                <Input
                                    id="categorySlug"
                                    type="text"
                                    placeholder="Category Slug"
                                    required
                                    {...form.register("slug")}
                                    readOnly
                                />
                                <FieldError errors={[form.formState.errors.slug]} />
                            </Field>
                        </div>
                        <SheetFooter>
                            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting} onClick={form.handleSubmit(handleSubmit)}>
                                {isSubmitting ? "Saving..." : submitLabel}
                            </Button>
                            <SheetClose asChild>
                                <Button variant="outline" className='cursor-pointer'>Close</Button>
                            </SheetClose>
                        </SheetFooter>

                    </SheetContent>
                </FieldGroup>

            </Sheet>
        </form>
    )
}
