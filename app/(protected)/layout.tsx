"use server"

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    console.log("session", session)
    if (!session) {
        return redirect("/login")
    }

    if (session.user.role === "USER") {
        return redirect("/home")
    }

    const navUser = {
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image || "",
        // role: session.user.role || "",
    }
    return (
        <SidebarProvider>
            <AppSidebar user={navUser} variant="inset" />
            <SidebarInset>
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
