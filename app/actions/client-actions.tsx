"use client"

import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"

export function handleLogout() {
    try {
        authClient.signOut()
        redirect("/login")
    } catch (error) {
        console.error(error)
    }
}
