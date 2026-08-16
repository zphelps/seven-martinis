"use client"

import { BarChart3, Calendar, CircleUser, Container, Home, Inbox, ListTodo, Mail, Martini, Search, Settings, Tag } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Menu items
const items = [
    {
        title: "Orders",
        url: "/dashboard",
        icon: ListTodo,
    },
    {
        title: "Menu",
        url: "/dashboard/menu",
        icon: Martini,
    },
    {
        title: "Attendees",
        url: "/dashboard/attendees",
        icon: CircleUser
    },
    {
        title: "Tags",
        url: "/dashboard/tags",
        icon: Tag
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3
    },
    {
        title: "Invitations",
        url: "/dashboard/invitations",
        icon: Mail
    }
]

export function AppSidebar() {
    const pathname = usePathname()
    const { toggleSidebar, open } = useSidebar()

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={cn(
                                                "transition-colors",
                                                pathname === item.url && "bg-secondary text-foreground hover:bg-secondary"
                                            )}
                                            onClick={() => {
                                                if (item.title === "Orders" && open) {
                                                    toggleSidebar()
                                                }
                                            }}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
