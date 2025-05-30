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
import { forgetPassword } from "@/requests/api/auth.req"
import { Card, CardContent, CardHeader } from "../ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BodyText } from "../base/typography/BodyText"

import { TitleText } from "../base/typography/TitleText"



export const forgetPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

export function ForgetPassword() {
    const router = useRouter()
    const form = useForm<z.infer<typeof forgetPasswordSchema>>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(data: z.infer<typeof forgetPasswordSchema>) {
        const response = await forgetPassword(data);
        if (response.success) {
            toast.success("Reset Passwork Link Generated", {
                description: "Please check your email to reset the password.",
            })
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
                                <Link href="/sign-in" className="text-primary-blue hover:underline">Back to Sign in</Link>
                            </BodyText>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    )
}
