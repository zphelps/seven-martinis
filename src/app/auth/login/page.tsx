"use client"

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { config } from "@/config";

const loginFormSchema = z.object({
    email: z.string().email("Must provide valid email"),
    password: z.string().min(8, "Password must be at least 8 characters.")
})

export default function SignIn() {

    const { signInWithGoogle, signInWithEmailAndPassword } = useAuth();
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        try {
            setLoading(true);
            const data = {
                email: values.email,
                password: values.password,
            }

            await signInWithEmailAndPassword(data);

            const returnTo = searchParams.get('returnTo');

            router.replace(returnTo || config.auth.defaultAuthenticatedUrl)

            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Make sure your email and password are correct and try again.",
            })
        }
    }

    return (
        <section className="bg-gradient-to-b from-gray-100 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-32 pb-12 md:pt-40 md:pb-20 mb-28">

                    {/* Page header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                        <h1 className="text-3xl font-bold">Welcome back.</h1>
                    </div>

                    {/* Form */}
                    <div className="max-w-sm mx-auto">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Email"
                                                    {...field}
                                                    className={"py-5 rounded form-input w-full text-gray-800"}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={'password'}
                                                    className={"py-5 rounded form-input w-full text-gray-800"}
                                                    placeholder="Password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit"
                                    className={"p-3 rounded btn text-white bg-blue-600 hover:bg-blue-700 w-full"}
                                    disabled={loading}
                                >
                                    {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign In
                                </Button>
                            </form>
                        </Form>
                        {/* <div className="flex items-center my-6">
                            <div className="border-t border-gray-300 grow mr-3" aria-hidden="true"></div>
                            <div className="text-gray-600 italic text-sm">Or</div>
                            <div className="border-t border-gray-300 grow ml-3" aria-hidden="true"></div>
                        </div> */}
                        {/* <div className="flex flex-wrap -mx-3 mb-3">
                            <div className="w-full px-3">
                                <button className="btn rounded p-3 text-white bg-gray-900 hover:bg-gray-800 w-full relative flex items-center">
                                    <svg className="w-6 h-6 fill-current text-white opacity-75 shrink-0 mx-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.95 0C3.578 0 0 3.578 0 7.95c0 3.479 2.286 6.46 5.466 7.553.397.1.497-.199.497-.397v-1.392c-2.187.497-2.683-.993-2.683-.993-.398-.895-.895-1.193-.895-1.193-.696-.497.1-.497.1-.497.795.1 1.192.795 1.192.795.696 1.292 1.888.895 2.286.696.1-.497.298-.895.497-1.093-1.79-.2-3.578-.895-3.578-3.975 0-.895.298-1.59.795-2.087-.1-.2-.397-.994.1-2.087 0 0 .695-.2 2.186.795a6.408 6.408 0 011.987-.299c.696 0 1.392.1 1.988.299 1.49-.994 2.186-.795 2.186-.795.398 1.093.199 1.888.1 2.087.496.596.795 1.291.795 2.087 0 3.08-1.889 3.677-3.677 3.875.298.398.596.895.596 1.59v2.187c0 .198.1.497.596.397C13.714 14.41 16 11.43 16 7.95 15.9 3.578 12.323 0 7.95 0z" />
                                    </svg>
                                    <span className="flex-auto pl-16 pr-8 -ml-16">Continue with GitHub</span>
                                </button>
                            </div>
                        </div> */}
                        {/* <div className="flex flex-wrap -mx-3">
                            <div className="w-full px-3">
                                <button
                                    onClick={async () => {
                                        await signInWithGoogle();
                                    }}
                                    className="btn px-3 text-white bg-grey-50 hover:bg-grey-200 w-full relative flex items-center">
                                    <div style={{width: "30px"}}>
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                                             style={{display: "block"}}>
                                            <path fill="#EA4335"
                                                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                            <path fill="#4285F4"
                                                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                            <path fill="#FBBC05"
                                                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                            <path fill="#34A853"
                                                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                            <path fill="none" d="M0 0h48v48H0z"></path>
                                        </svg>
                                    </div>
                                    <svg className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4"
                                         viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z"/>
                                    </svg>
                                    <span className="flex-auto pl-16 pr-8 -ml-16 text-black font-semibold">Continue with Google</span>
                                </button>
                            </div>
                        </div> */}
                        {/* <div className="text-gray-600 text-center mt-6">
                          Don't you have an account? <Link href="/signup" className="text-blue-600 hover:underline transition duration-150 ease-in-out">Sign up</Link>
                        </div> */}
                    </div>

                </div>
            </div>
        </section>
    )
}
