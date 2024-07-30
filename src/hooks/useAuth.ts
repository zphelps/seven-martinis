import {createClient} from "@/utils/supabase/client";

export const useAuth = () => {
    const supabase = createClient();

    const signInWithEmailAndPassword = async (data: {email: string, password: string}) => {
        const {error} = await supabase.auth.signInWithPassword(data)

        if (error) {
            throw error;
        }

        return null;
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return {
        user: null,
        signInWithEmailAndPassword,
        signOut,
    }
}
