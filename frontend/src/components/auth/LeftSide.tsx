import Image from 'next/image'
import React from 'react'
import { TitleText } from '../base/typography/TitleText'
import { BodyText } from '../base/typography/BodyText'
import AppLogo from '../base/AppLogo'

const servicesFeature = [
    {
        key: 1,
        title: "Seamless Transcription",
        description: "Effortlessly transcribe audio to text with our advanced AI technology",
    },
    {
        key: 2,
        title: "Multi-language Support",
        description: "Transcribe conversations in multiple languages with ease",
    },
    {
        key: 3,
        title: "Collaboration Tools",
        description: "Collaborate with team members by sharing and annotating transcripts in real-time",
    },
]

const partnerList = [
    {
        key: 1,
        alt: "Cemix",
        src: "/assets/images/partner/partner1.svg"
    },
    {
        key: 2,
        alt: "Allianze",
        src: "/assets/images/partner/partner2.svg"
    },
    {
        key: 3,
        alt: "Ezihang",
        src: "/assets/images/partner/partner3.svg"
    },
    {
        key: 4,
        alt: "Quad",
        src: "/assets/images/partner/partner4.svg"
    },
    {
        key: 5,
        alt: "Matex",
        src: "/assets/images/partner/partner5.svg"
    },
    {
        key: 6,
        alt: "Weblogics",
        src: "/assets/images/partner/partner6.svg"
    },
]

function LeftSide() {
    return (
        <div className="flex flex-col gap-10 w-3/12 m-12 justify-between">
            <AppLogo></AppLogo>
            <div className="flex flex-col gap-6">
                {servicesFeature.map((item) => (
                    <div key={item.key} className="">
                        <div className="flex gap-2 items-center mb-2">
                            <Image src={'/assets/images/tick.png'} width={25} height={25} alt="Tick"></Image>
                            <TitleText variant="title1" className="font-medium" as="h3">{item.title}</TitleText>
                        </div>
                        <BodyText variant="body2" className="ml-8 text-font3" as="p" >{item.description}</BodyText>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
                {partnerList.map((item) => (
                    <div key={item.key} className="">
                        <Image src={item.src} width={120} height={120} alt={item.alt}></Image>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default LeftSide