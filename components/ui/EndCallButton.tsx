import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './button'

const EndCallButton = () => {
    const router = useRouter()
    const call = useCall()

    const {useLocalParticipant} = useCallStateHooks()
    const localParticipant = useLocalParticipant()

    const isMeetingOwner = localParticipant && call?.state.createdAt && localParticipant.userId === call.state.createdBy?.id

    if(!isMeetingOwner) return null

  return (
    <Button className='bg-red-500 rounded-xl' onClick={async()=>{
        await call.endCall()
        router.push('/')
    }} >
        End call for everyone
    </Button>
  )
}

export default EndCallButton