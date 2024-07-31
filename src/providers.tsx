'use client';

import {AuthConsumer, AuthProvider} from "@/context/auth-context";
import {Toaster} from "@/components/ui/toaster";
import {AuthContextType} from "@/context/auth-context";


export function Providers({children}: {children: React.ReactNode}) {
    return (
        <AuthProvider>
            <AuthConsumer>
                {(auth: AuthContextType) => {
                    const showSlashScreen = !auth.isInitialized;
                    if (showSlashScreen) return <div>Loading...</div>;
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
