"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { BodyText } from "../base/typography/BodyText";
import { SelectList } from "../base/SelectList";
import { TitleText } from "../base/typography/TitleText";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { GlobalButton } from "../base/GlobalButton";
import { Upload, UserRoundPlus } from "lucide-react";

const SETTINGS = [
    {
        label: "Transcription languages",
        options: ["English (Global)", "Spanish", "French"],
    },
    {
        label: "Auto-join calendar events",
        options: [
            "Join all calendar events with link",
            "Only join with invite",
            "Never auto-join",
        ],
    },
    {
        label: "Share recap on email",
        options: ["Only me", "Everyone", "No one"],
    },
];

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

function HomeRightSide() {
    const [values, setValues] = useState<Record<string, string>>(() =>
        SETTINGS.reduce((acc, curr) => {
            acc[curr.label] = curr.options[0];
            return acc;
        }, {} as Record<string, string>)
    );

    const handleChange = (label: string, value: string) => {
        setValues((prev) => ({ ...prev, [label]: value }));
    };

    const form = useForm<RecordLiveMeetingType>({
        resolver: zodResolver(RecordLiveMeeting),
        defaultValues: {
            name: "",
            meetingLink: "",
        },
    });

    return (
        <div className="flex-[2] border border-font4/20 rounded-md">
            {/* Settings section */}
            <div className="p-5 w-full">
                <div className="space-y-4 max-w-md">
                    {SETTINGS.map(({ label, options }) => (
                        <SelectList
                            key={label}
                            label={label}
                            options={options}
                            value={values[label]}
                            onChange={(val) => handleChange(label, val)}
                        />
                    ))}
                </div>
            </div>

            {/* Form section */}
            <div className="p-5 w-full bg-font4/10 ">
                <TitleText variant="medium1" className="font-semibold mb-2">
                    Record live meeting
                </TitleText>

                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <BodyText variant="body4" className="text-font4">
                                        Name
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
                                    <FormControl>
                                        <Input
                                            placeholder="https://zoom.us/s/122346645"
                                            type="text"
                                            {...field}
                                            className="h-10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <BodyText variant="body4" className="text-font4">
                            Paste your meetings link from Google Meet, Zoom, MS teams, and <span className="text-primary-blue">more.</span>
                        </BodyText>

                        <GlobalButton
                            className="w-full"
                            iconLeft={<UserRoundPlus size={24} />}
                        >
                            Invite Notaking to Meeting
                        </GlobalButton>


                    </form>
                </Form>
            </div>

            <div className="p-5 w-full flex gap-4">
                <span className="text-primary-blue"><Upload size={20}/></span>
                <div className="">
                    <BodyText variant="body2" className="font-medium text-primary-blue">
                        Transcribe audio or video
                    </BodyText>
                    <BodyText variant="body4" className="text-font4">
                        Drop your MP3, MP4, M4A, AAC, WAV files here
                    </BodyText>
                </div>

            </div>

        </div>
    );
}

export default HomeRightSide;
