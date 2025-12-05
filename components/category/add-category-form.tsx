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
import { CategoryFormProps, CategoryFormValues, categorySchema } from '../interface/interface'

export function CategoryForm({ defaultValues, onSubmit, categories, submitLabel = "Save" }: CategoryFormProps) {
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
        <div className='grid grid-rows gap-3 p-6 bg-slate-800 rounded-md'>
            <h1 className="text-2xl font-bold">Add Category</h1>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FieldGroup className="grid md:grid-cols-4 auto-rows-min gap-6">
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
