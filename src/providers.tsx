'use client';

import { AuthConsumer, AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { AuthContextType } from "@/context/auth-context";
import { Loader2 } from "lucide-react";


export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AuthConsumer>
                {(auth: AuthContextType) => {
                    const showSlashScreen = !auth.isInitialized;
                    if (showSlashScreen) {
                        return <div className="flex items-center justify-center h-screen">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                    };
                    return <>
                        {/*<StoreProvider>*/}
                        {children}
                        {/*</StoreProvider>*/}
                        <Toaster />
                    </>
                }}
            </AuthConsumer>
        </AuthProvider>
    );
}
