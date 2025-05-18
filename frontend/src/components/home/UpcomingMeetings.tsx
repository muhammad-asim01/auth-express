import React from 'react'
import { BodyText } from '../base/typography/BodyText'
import { TitleText } from '../base/typography/TitleText'
import { Button } from '../ui/button'
import { Calendar, Clock11, Ellipsis, Plus } from 'lucide-react'

const MeetingList = [
  {
    key: 1,
    meetingTitle: 'Sprint Meeting Jan 3, 2024',
    date: 'Wed - Jan 3, 2024',
    time: '8.30 AM'
  },
  {
    key: 2,
    meetingTitle: 'Marketing Strategy',
    date: 'Mon - Mar, 2025',
    time: '11.30 AM'
  },
  {
    key: 3,
    meetingTitle: 'Software Testing Strategy',
    date: 'Fri - Nov, 2025',
    time: '1.30 PM'
  },
]

function UpcomingMeetings() {
  return (
    <div>
      <div className='flex gap-2 justify-between items-center mb-2'>
        <TitleText
          variant='title3'>
          Upcomming Meetings
        </TitleText>
        <Button className='bg-transparent outline-0 border-0 hover:bg-transparent shadow-transparent
      text-primary-blue cursor-pointer p-0 m-0
      '>
          <span><Plus className='size-6' /></span>
          <span>Schedule a Meeting</span>
        </Button>
      </div>
      <div className='flex flex-col gap-4 justify-between'>
        {
          MeetingList.map((item) => {
            return <div key={item.key} className='flex gap-1 flex-col border-1 border-font4/20 p-3 rounded-md'>

              <div className='flex gap-2 justify-between items-center'>
                <TitleText
                  variant='medium1'>
                  {item.meetingTitle}
                </TitleText>

                <span className='text-font4'><Ellipsis className='size-6' /></span>
              </div>

              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <span className='text-font4'><Calendar className='size-4' /></span>
                  <BodyText
                    variant='body3'
                     className='text-xs text-font4'
                    >
                    {item.date}
                  </BodyText>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-font4'><Clock11 className='size-4' /></span>
                  <BodyText
                    variant='body3'
                    className='text-xs text-font4'
                    >
                    {item.date}
                  </BodyText>
                </div>
              </div>
            </div>
          })
        }


      </div>
    </div>
  )
}

export default UpcomingMeetings