"use server"

import { CustomerLoginFormValues } from '@/components/auth/login-form-customer'
import { CustomerRegisterFormValues } from '@/components/auth/signup-form-customer'
import { auth } from '@/lib/auth'
import { APIError } from 'better-auth'
import { redirect } from 'next/navigation'


export async function registerCustomer(data: CustomerRegisterFormValues) {
    try {
        // console.log("data from user.ts", data)

        await auth.api.signUpEmail({
            body: {
                email: data.email,
                password: data.password,
                name: data.firstName + " " + data.lastName,
                firstName: data.firstName,
                lastName: data.lastName,
            }
        })

        return {
            success: true,
            data: data,
            message: "User registered successfully",
            error: null
        }
    } catch (error) {
        console.log("error", error)
        if (error instanceof APIError) {
            // console.log("error", error.message, error.status)
            if (error.status === "UNPROCESSABLE_ENTITY")
                return {
                    success: false,
                    data: null,
                    message: error.message,
                    status: error.status
                }
        }
        return {
            success: false,
            data: null,
            message: "Something went wrong",
            error: error
        }
    }
}

export async function loginCustomer(data: CustomerLoginFormValues) {
    try {
        // console.log("data from user.ts", data)

        await auth.api.signInEmail({
            body: {
                email: data.email,
                password: data.password,
            }
        })

        return {
            success: true,
            data: data,
            message: "User Logged in successfully",
            error: null
        }
    } catch (error) {
        // console.log("error", error)
        if (error instanceof APIError) {
            if (error.status === "UNAUTHORIZED")
                return {
                    success: false,
                    data: null,
                    message: error.message,
                    status: error.status
                };
            if (error.status === "FORBIDDEN")
                return {
                    success: false,
                    data: null,
                    message: error.message,
                    status: error.status
                }
        }
        return {
            success: false,
            data: null,
            message: "Something went wrong",
            error: error
        }
    }
}

export const signInSocialCustomer = async (provider: "google") => {
    const { url } = await auth.api.signInSocial({
        body: {
            provider,
            callbackURL: "/frontend/dashboard"
        },
    });

    if (url) {
        redirect(url);
    }
};
