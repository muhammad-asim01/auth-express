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
import { BodyText } from "../base/typography/BodyText"
import { Separator } from "../ui/separator"
import { TitleText } from "../base/typography/TitleText"
import Image from "next/image"
import { Checkbox } from "../ui/checkbox"
import { GlobalButton } from "../base/GlobalButton"


export const SignupFormSchema = z.object({
    fullname: z.string().min(2, {
        message: "Fullname must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
})

export function SignupComponent() {
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof SignupFormSchema>>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            fullname: "",
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
        <div className="relative w-[540px]">
            <Card className="rounded-md ring-0 shadow-none outline-0 border-0 bg-white text-font1">
                <CardHeader className="text-center">
                    <TitleText variant="heading2" className="font-semibold text-2xl">Create your account</TitleText>
                    <BodyText variant="body3">Experience the power of AI-driven transcripts</BodyText>
                </CardHeader>
                <CardContent>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-hidden">

                            <div className="flex items-center justify-center mb-2 w-full py-3 rounded-sm border-font3/10 border-1 cursor-pointer">
                                <Image alt="google logo" src={'./assets/images/icons/google.svg'}
                                    width={20} height={20} className="inline-block mr-2" ></Image>
                                <TitleText variant="medium3" className="text-md"> Sign in with Google</TitleText>
                            </div>

                            <div className="flex items-center justify-center gap-4 mb-2 py-2 overflow-hidden">
                                <Separator className=" bg-font4/20 " />
                                <BodyText variant="body3" className="font-medium text-font3"> OR</BodyText>
                                <Separator className=" bg-font4/20 " />
                            </div>

                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-font3 text-sm">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ahmad Yaar" type="fullname" {...field} />
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
                                        <FormLabel className="font-normal text-font3">Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="••••••••" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="font-normal text-font3">
                                        <FormLabel className="font-normal text-font3">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="••••••••" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <GlobalButton
                                className="w-full"
                                type="submit"
                            >
                                <BodyText className="m-0" variant="body3">Register Now</BodyText>
                            </GlobalButton>
                         

                            <div className="mt-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox className="cursor-pointer"></Checkbox>

                                    <BodyText variant="body4">
                                        I accept the
                                        <span className="text-primary-blue hover:underline ml-2 font-medium">Terms and Conditions</span>
                                    </BodyText>
                                </div>
                                <BodyText variant="body4" className="text-center text-font3 mt-3 font-medium">
                                    Don't have an account yet? <Link href="/sign-in" className="text-primary-blue hover:underline"> Sign In</Link>
                                </BodyText>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    )
}
