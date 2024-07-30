import {createClient} from "@/utils/supabase/client";

export const useAuth = () => {
    const supabase = createClient();

    const signInWithEmailAndPassword = async (email: string, password: string) => {

        await supabase.auth.signInWithPassword(
            {
                email: email,
                password: password
            }
        )

        return null
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return {
        user: null,
        signInWithEmailAndPassword: async () => {},
        signOut,
    }
}