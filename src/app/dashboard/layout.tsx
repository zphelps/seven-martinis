import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/guards/auth-guard";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <AuthGuard>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1">
                    {children}
                </div>
            </SidebarProvider>
        </AuthGuard>
    );
}