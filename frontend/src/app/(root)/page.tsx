import React from 'react'
import { QrCodeModal } from '@/components/2fa/QrCodeModal'
import Searchbar from '@/components/base/Searchbar'
import { TitleText } from '@/components/base/typography/TitleText'
import { BodyText } from '@/components/base/typography/BodyText'
import { X } from 'lucide-react'
import UpcomingMeetings from '@/components/home/UpcomingMeetings'
import HomeRightSide from '@/components/home/HomeRightSide'

function page() {
  return (
    <div className="flex gap-4 p-4 text-font1">
      <div className="flex-[3] px-32 py-10  overflow-y-scroll custom-scrollbar max-h-[90vh]">
        <Searchbar />
        <div className='mt-10 gap-8 flex flex-col'>
          <div className='flex flex-col gap-3'>
            <TitleText variant='heading1'>
              Hi Kelly, Welcome to Notaking
            </TitleText>
            <BodyText variant='body2'>Invite kelly@notaking.ai to calendar invite or use other option to capture your meeting</BodyText>
          </div>
          <div className='relative rounded-md bg-secondary-purple border-1 border-secondary-blue p-3 flex gap-2 justify-between items-start'>
            <BodyText variant='body2'>Notaking needs to stay in meeting for at least 2 minutes to <br></br> process trancsript</BodyText>
            <X size={20} className='text-font4' />
          </div>
          <UpcomingMeetings></UpcomingMeetings>
        </div>
      </div>
      <HomeRightSide></HomeRightSide>
    </div>
  )
}

export default page