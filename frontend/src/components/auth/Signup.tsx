"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

export function Signup() {
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
        toast.success("Signup successful!", {
            description: "Please check your email to verify your account.",
        })
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Signup</Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">Signup Form</AlertDialogTitle>
                        <AlertDialogDescription>
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
                                                    <Input placeholder="••••••••" type="text" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <AlertDialogFooter className="mt-6">
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <Button
                                         onClick={e => e.stopPropagation()}
                                            className="cursor-pointer"
                                            type="submit"
                                            variant={"default"}
                                        >Sign Up</Button>
                                    </AlertDialogFooter>
                                </form>
                            </Form>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
