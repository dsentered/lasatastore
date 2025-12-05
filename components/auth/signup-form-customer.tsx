"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { registerCustomer, signInSocialCustomer } from "@/app/actions/customer"
import { toast } from "sonner"


const customerRegisterSchema = z.object({
    firstName: z.string().min(3, "Name must be at least 3 characters long"),
    lastName: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number"),
})

export type CustomerRegisterFormValues = z.infer<typeof customerRegisterSchema>

export default function SignupForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<CustomerRegisterFormValues>({
        resolver: zodResolver(customerRegisterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: CustomerRegisterFormValues) => {
        // console.log("data from form", data)
        setIsSubmitting(true);
        try {
            const response = await registerCustomer(data);
            console.log("response", response)
            if (response.success) {
                toast.success(response.message);
                router.push("/dashboard");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSignInSocialCustomer(provider: "google") {
        await signInSocialCustomer(provider);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field className="grid grid-cols-2 gap-4">
                            <Field data-invalid={!!form.formState.errors.firstName}>
                                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                                <Input id="firstName" placeholder="John" {...form.register("firstName")} />
                                <FieldError errors={[form.formState.errors.firstName]} />
                            </Field>
                            <Field data-invalid={!!form.formState.errors.lastName}>
                                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                                <Input id="lastName" placeholder="Doe" {...form.register("lastName")} />
                                <FieldError errors={[form.formState.errors.lastName]} />
                            </Field>
                        </Field>
                        <Field data-invalid={!!form.formState.errors.email}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...form.register("email")}
                            />
                            <FieldDescription>
                                We&apos;ll use this to contact you. We will not share your email
                                with anyone else.
                            </FieldDescription>
                            <FieldError errors={[form.formState.errors.email]} />
                        </Field>
                        <Field data-invalid={!!form.formState.errors.password}>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input id="password" type="password" {...form.register("password")} />
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
                            <FieldError errors={[form.formState.errors.password]} />
                        </Field>

                        <FieldGroup>
                            <Field>
                                <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Account"}</Button>
                            </Field>
                        </FieldGroup>

                        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                            Or continue with
                        </FieldSeparator>

                        <Field>
                            <Button variant="outline" type="button" className="cursor-pointer" onClick={() => handleSignInSocialCustomer("google")}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Create account with Google
                            </Button>
                        </Field>
                        <FieldGroup>
                            <Field>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account? <Link href="/login">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
