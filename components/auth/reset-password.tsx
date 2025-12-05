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
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const formSchema = z.object({
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
})

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        if (values.password !== values.confirmPassword) {
            toast.error("Passwords do not match")
            setIsLoading(false);
            return
        }

        try {
            const { error } = await authClient.resetPassword({
                newPassword: values.password,
                token: token as string,
            });

            if (error) {
                toast.error(error.message)
                setIsLoading(false);
            } else {
                toast.success("Password reset link sent to your email")
                router.push("/login")
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
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                    Enter your new password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="password">New Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your new password"
                                required
                                {...form.register("password")}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Enter your new password again"
                                required
                                {...form.register("confirmPassword")}
                            />
                        </Field>
                        <FieldGroup>
                            <Field>
                                <Button type="submit" className="cursor-pointer" disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Reset Password"}
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
