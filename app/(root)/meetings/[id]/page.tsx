'use client'

import Loader from '@/components/Loader'
import MeetingClientRoom from '@/components/ui/MeetingClientRoom'
import MeetingSetup from '@/components/ui/MeetingSetup'
import { useGetCallById } from '@/hooks/useGetCallById'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'

const MeetingRoom = ({params : {id}}:{params:{id:string}}) => {
  const [isSetupComplete, setIsSetUpComplete] = useState(false)

  const {isLoaded} = useUser()
  const {call, isCallLoading} = useGetCallById(id)

  if(!isLoaded || isCallLoading) return <Loader />

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {
            !isSetupComplete ? (
              <MeetingSetup setIsSetUpComplete={setIsSetUpComplete} />
            ) : (
              <MeetingClientRoom />
            )
          }
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default MeetingRoom