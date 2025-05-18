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

export function ForgetPassword() {
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
                <CardHeader className="text-center mb-3 flex flex-col gap-4 items-center">
                    <TitleText variant="heading2">Forget Password</TitleText>
                    <BodyText variant="body3">Enter the email address you used when you joined and we'll send you instructions to reset your password.</BodyText>
                </CardHeader>
                <CardContent>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-hidden">






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


                            <Button
                                onClick={e => e.stopPropagation()}
                                className="h-12 cursor-pointer w-full py-3  mt-2 mb-0 text-base font-semibold text-white bg-primary-blue rounded-sm hover:bg-primary-blue/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:ring-offset-2 focus:ring-offset-gray-100"
                                type="submit"

                                variant={"default"}
                            >
                                <BodyText className="m-0" variant="body3">Send reset instruction</BodyText>

                            </Button>
                            <BodyText variant="body3" className="text-center text-font3 font-medium mt-6">
                               <Link href="/sign-up" className="text-primary-blue hover:underline">Back to Sign in</Link>
                            </BodyText>


                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    )
}
