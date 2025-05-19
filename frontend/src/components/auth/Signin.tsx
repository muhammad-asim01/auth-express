"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"
import { Separator } from "@/components/ui/separator"

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
import { signIn } from "@/requests/api/auth.req"
import { Card, CardContent, CardHeader } from "../ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authContext"
import { TitleText } from "../base/typography/TitleText"
import { BodyText } from "../base/typography/BodyText"
import Image from "next/image"
import { Checkbox } from "../ui/checkbox"
import { GlobalButton } from "../base/GlobalButton"
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/config"

export const SignInFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }).regex(EMAIL_REGEX, {
        message: 'Invalid email format'
    }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .refine((val) => PASSWORD_REGEX.test(val), {
            message: "Password must include uppercase, lowercase, number, and special character.",
        })
});

export function SignInComponent() {
    const router = useRouter()
    const { isAuthenticated, setIsAuthenticated } = useAuth()

    const form = useForm<z.infer<typeof SignInFormSchema>>({
        resolver: zodResolver(SignInFormSchema),
        mode: "onChange", // to trigger validation immediately
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof SignInFormSchema>) {
        const response = await signIn(data);
        if (response.success) {
            toast.success(response.message, {
                description: response.message,
            })
            localStorage.setItem('accessToken', response.data.accessToken)
            setIsAuthenticated(true)
            router.push('/')
        } if (response.error) {
            toast.error(response.message, {
                description: response.message,
            })
        }
    }

    return (

        <div className="relative w-[510px]">
            <Card className="rounded-md ring-0 shadow-none outline-0 border-none bg-white text-font1">
                <CardHeader className="text-center">
                    <TitleText variant="heading2" className="font-semibold"> Sign In</TitleText>
                    <BodyText variant="body2">Sign in to unlock the power of intelligent transcripts</BodyText>
                </CardHeader>
                <CardContent>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-hidden">

                            <div className="flex items-center justify-center mb-4 w-full py-3 rounded-sm border-font3/10 border-1 cursor-pointer">
                                <Image alt="google logo" src={'./assets/images/icons/google.svg'}
                                    width={20} height={20} className="inline-block mr-2" ></Image>
                                <TitleText variant="title3"> Sign in with Google</TitleText>
                            </div>

                            <div className="flex items-center justify-center gap-4 mb-6 py-2 overflow-hidden">
                                <Separator className=" bg-font4/20 " />
                                <BodyText variant="body3" className="font-medium text-font3"> OR</BodyText>
                                <Separator className=" bg-font4/20 " />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-font3">Email</FormLabel>
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
                                            <Input placeholder="••••••••" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <GlobalButton
                                className="w-full"
                                type="submit"
                            >
                                <BodyText className="" variant="body3">Sign In</BodyText>
                            </GlobalButton>

                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Checkbox className="cursor-pointer"></Checkbox>
                                        <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900">Remember me</label>
                                    </div>
                                    <a href="/forgot-password" className="text-sm text-primary-blue hover:underline">Forgot password?</a>
                                </div>
                                <BodyText variant="body3" className="text-center text-font3 mt-3 font-medium">
                                    Don't have an account yet? <Link href="/sign-up" className="text-primary-blue hover:underline"> Sign up</Link>
                                </BodyText>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >


    )
}
