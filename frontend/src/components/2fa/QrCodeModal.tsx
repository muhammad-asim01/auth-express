"use client"
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
import { generateQrCode } from "@/requests/api/auth.req"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

export function QrCodeModal() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>("/images/qr-code.png")
    const [loading, setLoading] = useState(false)

    const handleQrCode = async () => {
        setLoading(true)
        const response = await generateQrCode()
        if (response.success) {
            console.log(response)
            toast.success(response.message, {
                description: response.message,
            })

            setQrCodeUrl(response.data.qrCodeUrl)
            setLoading(false)

        }

    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer"
                    onClick={handleQrCode}
                >Show Qr Code</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">Scan the QR Code Now</AlertDialogTitle>
                    <AlertDialogDescription className="mx-auto">
                        {
                            loading ? (
                                <div className="flex justify-center items-center ">
                                    laoding...
                                </div>
                            ) :
                                <Image
                                    src={qrCodeUrl || "/images/qr-code.png"}
                                    alt=""
                                    width={150}
                                    height={150}
                                ></Image>
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Next</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
