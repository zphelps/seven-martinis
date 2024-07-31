import {AuthContext} from "@/context/auth-context";
import {useContext} from "react";
export const useAuth = () => useContext(AuthContext);


// export const useAuth = () => {
//     const supabase = createClient();
//     const searchParams = useSearchParams();
//
//     const signInWithEmailAndPassword = async (data: {email: string, password: string}) => {
//         const {error} = await supabase.auth.signInWithPassword(data)
//
//         if (error) {
//             throw error;
//         }
//
//         return null;
//     }
//
//     const signInWithGoogle = async () => {
//         const returnTo = searchParams.get("returnTo") || config.auth.defaultAuthenticatedUrl;
//         const {error} = await supabase.auth.signInWithOAuth({
//             provider: "google",
//             options: {
//                 redirectTo: window.location.origin + `/auth/callback?next=${returnTo}`,
//                 scopes: "email profile",
//             }
//         })
//
//         if (error) {
//             throw error;
//         }
//
//         return null;
//     }
//
//     const signOut = async () => {
//         await supabase.auth.signOut()
//     }
//
//     return {
//         user: null,
//         signInWithEmailAndPassword,
//         signInWithGoogle,
//         signOut,
//     }
// }
