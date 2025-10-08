"use client"

import {Calendar, CircleUser, Container, Home, Inbox, ListTodo, Martini, Search, Settings} from "lucide-react"

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

// Menu items.
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
    }
    // {
    //     title: "Inventory",
    //     url: "/dashboard/inventory",
    //     icon: Container,
    // },
    // {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings,
    // },
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
                    {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={cn(pathname === item.url && "bg-gray-200 group-hover:bg-gray-200 hover:bg-gray-200")}
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
