// import React, { useEffect, useRef, useState } from 'react'
// import axios from 'axios'
// import { useRouter } from 'next/router'
// import { Stack, Group, Button } from '@mantine/core'

// const NEXT_PUBLIC_CANCEL_TIMER_MINUTES = parseInt(
//   process.env.NEXT_PUBLIC_CANCEL_TIMER_MINUTES || '2',
//   10,
// ) // Default to 2 minutes
// const CANCEL_TIMER: number = NEXT_PUBLIC_CANCEL_TIMER_MINUTES * 60 * 1000

// const TELEGRAM_BOT_USERNAME =
//   process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
//   'default_telegram_bot_username'

// const TgboVideoCallFrame = ({
//   consultationId,
//   setCallState,
//   startConsultation,
//   children,
//   callState,
// }: ICallFrameProps) => {
//   const router = useRouter()
//   const videoRef = useRef(null)
//   const [telegramLink, setTelegramLink] = useState('')

//   useEffect(() => {
//     const createVideoCall = async () => {
//       try {
//         const response = await axios.post('/api/createVideoCall', {
//           consultationId,
//         })
//         const { roomId } = response.data
//         setTelegramLink(`https://t.me/${TELEGRAM_BOT_USERNAME}?start=${roomId}`)
//       } catch (error) {
//         console.error('Error creating video call:', error)
//       }
//     }

//     createVideoCall()

//     // Clean up function
//     return () => {
//       // Implement any necessary cleanup
//     }
//   }, [consultationId])

//   const leaveMeeting = () => {
//     // Implement leave meeting logic if necessary
//   }

//   return (
//     <Stack h="100%">
//       <Group position="apart">
//         {children}
//         <Button
//           href={telegramLink}
//           target="_blank"
//           rel="noopener noreferrer"
//           ml="lg"
//         >
//           Join
//         </Button>
//         <Button onClick={leaveMeeting} ml="lg" color="red.5">
//           Leave
//         </Button>
//       </Group>
//       <div
//         ref={videoRef}
//         style={{ width: '100%', height: '90%', borderRadius: '12px' }}
//       />
//     </Stack>
//   )
// }

// export default TgboVideoCallFrame
