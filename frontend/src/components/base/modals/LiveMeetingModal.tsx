"use client"
import { Copy, Link, UserRoundPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@radix-ui/react-separator"
import { Form, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form"
import { BodyText } from "../typography/BodyText"
import { GlobalButton } from "../GlobalButton"
import { useState } from "react"

const RecordLiveMeeting = z.object({
    name: z
        .string()
        .email({ message: "Please enter a valid email address." })
        .optional(),
    meetingLink: z
        .string()
        .min(8, { message: "Meeting link must be at least 8 characters." })
        .optional(),
});

type RecordLiveMeetingType = z.infer<typeof RecordLiveMeeting>;
export function LiveMeetingModal({ isOpen, onOpenChange }: any) {
    const form = useForm<RecordLiveMeetingType>({
        resolver: zodResolver(RecordLiveMeeting),
        defaultValues: {
            name: "",
            meetingLink: "",
        },
    });


    async function onSubmit(data: any) {
        console.log(data)

    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[552px]" >
                <Separator className="my-2 h-px w-full bg-font4/30 absolute top-11 left-0" />
                <DialogHeader className=" ">
                    <DialogTitle>Record live meeting</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-x-2 pt-4">
                    <FormProvider {...form}>
                        <form className="space-y-4 w-full " onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <BodyText variant="body4" className="text-font4">
                                            Name (optional)
                                        </BodyText>
                                        <FormControl>
                                            <Input
                                                className="h-10"
                                                placeholder="E.g. Sprint Meeting"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="meetingLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <BodyText variant="body4" className="text-font4">
                                            Meeting Link
                                        </BodyText>
                                        <FormControl className=" text-font1 gap-1 flex items-center py-1 px-2 border border-font3/10 rounded-md">
                                            <div>
                                                <span><Link className="size-[17px] mr-2 text-font4 " /></span>
                                                <Input
                                                    placeholder="https://zoom.us/s/122346645"
                                                    type="text"
                                                    {...field}
                                                    className="h-9 px-0 flex-1 shadow-transparent bg-transparent border-none focus:outline-none focus:ring-0 text-xs placeholder:text-font3"

                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <BodyText variant="body4" className="text-font4">
                                Paste your meetings link from Google Meet, Zoom, MS teams, and <span className="text-primary-blue">more.</span>
                            </BodyText>

                            <div className="grid grid-cols-15 gap-3">
                                <GlobalButton
                                    onClick={() => onOpenChange(false)}
                                    variant={'default'}
                                    className="col-start-5 col-end-8 bg-transparent border-2 border-primary-blue hover:bg-transparent"

                                >
                                    <BodyText variant="body3" className="text-primary-blue">Cancel</BodyText>
                                </GlobalButton>
                                <GlobalButton
                                    type="submit"
                                    className="col-start-8 col-end-16"
                                    iconLeft={<UserRoundPlus size={24} />}
                                >
                                    <BodyText variant="body3">Invite Notaking to Meeting</BodyText>
                                </GlobalButton>

                            </div>
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    )
}
