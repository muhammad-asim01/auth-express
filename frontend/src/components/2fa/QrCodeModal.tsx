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
import Image from "next/image"

export function QrCodeModal() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">Show Qr Code</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">Scan the QR Code Now</AlertDialogTitle>
                    <AlertDialogDescription className="mx-auto">
                        <Image
                            src={'data:image/png;base64,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'}
                            alt=""
                            width={150}
                            height={150}
                        ></Image>
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
