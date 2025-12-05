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
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const formSchema = z.object({
    email: z.string().email(),
})

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            const { error } = await authClient.requestPasswordReset({
                email: values.email,
                redirectTo: "/reset-password",
            });

            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Password reset link sent to your email")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                {...form.register("email")}
                            />
                        </Field>
                        <FieldGroup>
                            <Field>
                                <Button type="submit" className="cursor-pointer" disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Send Reset Password Link"}
                                </Button>
                            </Field>
                        </FieldGroup>

                        <FieldGroup>
                            <Field>
                                <FieldDescription className="px-6 text-center">
                                    Remember your password? <Link href="/login">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
