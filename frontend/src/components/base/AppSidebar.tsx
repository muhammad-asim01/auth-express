'use client'
import { Calendar, CloudUpload, Home, House, Inbox, NotebookPen, Plus, Search, Settings, UploadIcon, Video } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/Sidebar"
import AppLogo from "./AppLogo"
import Link from "next/link"
import { BodyText } from "./typography/BodyText"
import { usePathname } from "next/navigation"
import clsx from "clsx"

import { Separator } from "../ui/separator"
import { GlobalButton } from "./GlobalButton"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropDownDialog, DropDownItem } from "./DropDownDailog"
import { LiveMeetingModal } from "./modals/LiveMeetingModal"
import { useState } from "react"
import { ScheduleMeetingModal } from "./modals/ScheduleMeetingModal"


export enum ModalType {
    LiveMeeting = "live-meeting",
    ScheduleMeeting = "schedule-meeting",
    AudioVideo = "audio-video",
}

// Menu items.
const MenuItemsList = {
    topMenu: [
        {
            key: 1,
            title: "Home",
            url: "/",
            icon: House,
        },
        {
            key: 2,
            title: "Notes",
            url: "/notes",
            icon: NotebookPen,
        },
        {
            key: 3,
            title: "Meeting",
            url: "/meeting",
            icon: Calendar,
        },
        {
            key: 4,
            title: "Uploads",
            url: "/upload",
            icon: UploadIcon,
        },
    ],
    bottomMenu: [
        {
            key: 1,
            title: "Rules",
            url: "/rules",
            icon: Settings,
        },
        {
            key: 1,
            title: "Team",
            url: "/settings",
            icon: Settings,
        },
        {
            key: 2,
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
    ],
}


export function AppSidebar() {
    const pathname = usePathname()
    const [openModal, setOpenModal] = useState<ModalType | null>(null)


    const menuItems: DropDownItem[] = [
        {
            label: "Add to live meeting",
            icon: <Video strokeWidth={1.5} className="size-6 text-font1" />,
            onClick: () => setOpenModal(ModalType.LiveMeeting),
        },
        {
            label: "Schedule new meeting",
            icon: <Calendar className="size-5 text-font1" />,
            onClick: () => setOpenModal(ModalType.ScheduleMeeting)
        },
        {
            label: "Upload audio or video",
            icon: <CloudUpload className="size-5 text-font1" />,
            onClick: () => setOpenModal(ModalType.AudioVideo),
        },
    ]
    return (
        <Sidebar className="p-3 bg-primary-dark-blue border-0" collapsible="icon"
            side="left"
            variant="inset"
        >
            <SidebarContent className="bg-primary-dark-blue border-0">
                <SidebarGroup className="bg-transparent flex flex-col gap-6 h-full border-0">
                    <AppLogo></AppLogo>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <DropDownDialog
                            trigger={
                                <GlobalButton className="my-2" iconLeft={<Plus className="size-6" />}>
                                    <BodyText variant="body3">Create New</BodyText>
                                </GlobalButton>
                            }
                            items={menuItems}
                            align="start"
                            sideOffset={12}
                        />

                        {openModal === ModalType.LiveMeeting && (
                            <LiveMeetingModal
                                isOpen={true}
                                onOpenChange={(open: any) => {
                                    if (!open) setOpenModal(null)
                                }}
                            />
                        )}


                        {openModal === ModalType.ScheduleMeeting && <ScheduleMeetingModal
                            isOpen={true}
                            onOpenChange={(open: any) => {
                                if (!open) setOpenModal(null)
                            }}
                        />}
                        {/* {openModal === ModalType.AudioVideo && <AudioUploadDialog />} */}

                        <SidebarMenu className="flex gap-1">
                            {MenuItemsList?.topMenu?.map((item) => {

                                const Icon = item.icon
                                return <SidebarMenuItem key={item.title + item.key} className="">
                                    <SidebarMenuButton asChild
                                        className={clsx(`h-10 rounded-none hover:bg-secondary-purple px-4`, pathname === item.url ? "bg-secondary-purple" : "bg-primary-dark-blue")}>

                                        <Link href={item.url} className="gap-3 flex items-center">
                                            <span><Icon className="size-5" /></span>
                                            <BodyText variant="body2" className="font-medium">{item.title}</BodyText>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                            })}

                        </SidebarMenu>
                        <Separator className="bg-secondary-blue" />

                        <SidebarMenu className="flex gap-2">
                            {MenuItemsList?.bottomMenu?.map((item) => {
                                const Icon = item.icon
                                return <SidebarMenuItem key={item.title + item.key} className="">
                                    <SidebarMenuButton asChild
                                        className={clsx(`h-10 rounded-none hover:bg-secondary-purple px-4`, pathname === item.url ? "bg-secondary-purple" : "bg-primary-dark-blue")}>

                                        <Link href={item.url} className="gap-3 flex">
                                            <span><Icon className="size-5" /></span>
                                            <BodyText variant="body3" className="font-medium">{item.title}</BodyText>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            }
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>

                    <SidebarFooter className="mt-auto flex gap-3">
                        <div
                            className="p-2 border-1 border-secondary-blue rounded-md w-full"
                        >
                            <div className="flex gap-3 items-center">
                                <GlobalButton className="px-3 py-2 text-md bg-white hover:bg-white">
                                    <BodyText variant="body3" className="font-medium text-primary-dark-blue">Upgrade</BodyText>
                                </GlobalButton>
                                <div className="">
                                    <BodyText variant="body4" className="text-font4">CREDIT</BodyText>
                                    <BodyText variant="body4" className="text-element1">50m Left <span className="text-font4">/ 60m</span></BodyText>

                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 items-center">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="">
                                <BodyText variant="body2" className="text-element1">Kally Marry</BodyText>
                                <BodyText variant="body4" className="text-font4">Kallaymarray@gmail.com</BodyText>

                            </div>
                        </div>

                    </SidebarFooter>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}


