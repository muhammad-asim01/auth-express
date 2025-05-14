"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState } from "react"
import { signup } from "@/requests/api/auth.req"
import { Card, CardContent, CardHeader } from "../ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"


export const SignupFormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export function SignupComponent() {
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof SignupFormSchema>>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof SignupFormSchema>) {
        const response = await signup(data);
        console.log(response);
        if (response.success) {
            toast.success("Signup successful!", {
                description: "Please check your email to verify your account.",
            })
            router.push('/sign-in')
        }
    }

    return (
        <div className="relative w-[400px]">
            <span className="block absolute bg-transparent border-[3px] border-black/30 size-5 top-0 left-0 border-b-0 border-r-0"></span>
            <span className="block absolute bg-transparent border-[3px] border-black/30 size-5 top-0 right-0 border-b-0 border-l-0"></span>
            <span className="block absolute bg-transparent border-[3px] border-black/30 size-5 bottom-0 left-0 border-t-0 border-r-0"></span>
            <span className="block  absolute bg-transparent border-[3px] border-black/30 size-5 bottom-0 right-0 border-t-0 border-l-0"></span>


            <Card className="rounded-none ring-0 border-2 border-gray-200">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Sign Up</h2>
                    <p className="text-sm text-muted-foreground">Create an account to get started.</p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="johndoe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" type="email" {...field} />
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
                                            <Input placeholder="••••••••" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                onClick={e => e.stopPropagation()}
                                className="cursor-pointer"
                                type="submit"
                                variant={"default"}
                            >Sign Up</Button>

                            <div className="text-sm font-medium text-gray-500">
                                Already have an account? <Link href="/sign-in" className="text-blue-700 hover:underline">Sign in</Link>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>
    )
}
