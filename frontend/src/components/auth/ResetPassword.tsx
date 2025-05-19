

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import Link from "next/link"
import { BodyText } from "../base/typography/BodyText"
import { TitleText } from "../base/typography/TitleText"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPassword } from "@/requests/api/auth.req"
import { toast } from "sonner"
import { PASSWORD_REGEX } from "@/config"
import { useRouter } from "next/navigation"


export const ResetLinkFormSchema = z.object({
    newPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(PASSWORD_REGEX, {
            message:
                "Password must include uppercase, lowercase, number, and special character.",
        }),
});

export function ResetPassword({ token }: { token: string }) {
    const router = useRouter()
    const form = useForm<z.infer<typeof ResetLinkFormSchema>>({
        resolver: zodResolver(ResetLinkFormSchema),
        defaultValues: {
            newPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof ResetLinkFormSchema>) {
        const response = await resetPassword(token, data);
        if (response.success) {
            toast.success(response.message, {
                description: response.message,
            })
            router.push('/sign-in')
        } if (response.error) {
            toast.error(response.message, {
                description: response.message,
            })
        }
    }

    return (
        <div className="relative w-[540px]">
            <Card className="rounded-md ring-0 shadow-none outline-0 border-0 bg-white text-font1">
                <CardHeader className="text-center mb-3 flex flex-col gap-4 items-center">
                    <TitleText variant="heading2">Reset Password</TitleText>
                    <BodyText variant="body3">Click on the button to reset the password</BodyText>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-hidden">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-font3">New Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="type new password here" type="text" {...field} />
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
                                <BodyText className="m-0" variant="body3">Reset Now</BodyText>

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
