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
import z from 'zod';
import { toast } from 'sonner';
import slugify from 'slugify';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { IconEdit } from '@tabler/icons-react'


const categorySchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters long",
    }),
    parentId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>

interface Category {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface CategoryFormProps {
    defaultValues?: CategoryFormValues;
    onSubmit: (data: CategoryFormValues) => Promise<any>;
    categories: Category[];
    submitLabel?: string;
}

export function EditCategoryForm({ defaultValues, onSubmit, categories, submitLabel = "Save" }: CategoryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: defaultValues || {
            name: "",
            slug: "",
            parentId: "",
        }
    })

    const nameValue = form.watch("name");

    useEffect(() => {
        if (nameValue) {
            const slug = slugify(nameValue, { lower: true });
            form.setValue("slug", slug);
        }
    }, [nameValue, form]);

    const handleSubmit = async (data: CategoryFormValues) => {
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

                            <Field>
                                <FieldLabel htmlFor="parent">Parent Category</FieldLabel>
                                <Controller
                                    control={form.control}
                                    name="parentId"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a parent category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Parent Category</SelectLabel>
                                                    <SelectItem value="unassigned">Unassigned</SelectItem>
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
                                <FieldError errors={[form.formState.errors.parentId]} />
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
