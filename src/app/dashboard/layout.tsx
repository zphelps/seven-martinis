import AuthGuard from "@/guards/auth-guard";

export default async function DashboardLayout({children}: {children: React.ReactNode}) {

    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}