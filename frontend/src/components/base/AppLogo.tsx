import Image from 'next/image'
import React from 'react'
import { TitleText } from './typography/TitleText'

function AppLogo() {
    return (
        <div className="flex gap-2 items-center">
            <Image src={'/assets/images/logo.svg'} width={30} height={30} alt="Notaking"></Image>
            <TitleText variant="heading2" as="h1">Notaking</TitleText>
        </div>
    )
}

export default AppLogo