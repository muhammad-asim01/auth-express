"use client"
import { Copy, Link, SquareArrowOutUpRight, UserRoundPlus } from "lucide-react"

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
import Image from "next/image"
import { TitleText } from "../typography/TitleText"

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
export function ScheduleMeetingModal({ isOpen, onOpenChange }: any) {
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
                    <DialogTitle>Schedule new Meeting</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4 pt-4">
                    <div className="mb-3 flex items-center justify-between w-full px-4 py-3 rounded-md border-font3/10 border-1 cursor-pointer">
                        <div className="flex items-center">
                            <span className="size-9 flex items-center justify-center rounded-full bg-font4/10 shrink-0">
                                <Image
                                    alt="Google Calendar"
                                    src={'/assets/images/google-cal-logo.png'}
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                />
                            </span>
                            <TitleText variant="medium3" className="text-md ml-3">Google Calendar</TitleText>
                        </div>

                        <span><SquareArrowOutUpRight className="size-4" /></span>

                    </div>
                    <div className="flex items-center justify-between w-full px-4 py-3 rounded-md border-font3/10 border-1 cursor-pointer">
                        <div className="flex items-center">
                            <span className="size-9 flex items-center justify-center rounded-full bg-font4/10 shrink-0">
                                <Image
                                    alt="google logo"
                                    src={'/assets/images/microsoft-logo.png'}
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                />
                            </span>
                            <TitleText variant="medium3" className="text-md ml-3">Microsoft Outlook</TitleText>
                        </div>

                        <span><SquareArrowOutUpRight className="size-4" /></span>

                    </div>

                    <BodyText variant="body4" className=" text-font3">Your AI Notaking will be invited to the calendar meeting to record, transcribe and summarize.</BodyText>
                </div>
            </DialogContent>
        </Dialog>
    )
}
