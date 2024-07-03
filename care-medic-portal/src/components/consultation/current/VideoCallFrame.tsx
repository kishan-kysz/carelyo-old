import DailyIframe, { DailyCall, DailyEvent } from '@daily-co/daily-js'
import { useQuery } from '@tanstack/react-query'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { getVideoToken } from '@routes'
import useConsultation from '@hooks/use-consultation'
import useProfile from '@hooks/use-profile'
import { notifications, showNotification } from '@mantine/notifications'
import { IAcceptedConsultation } from '@types'
import { useRouter } from 'next/router'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Stack, Group, Button } from '@mantine/core'
import useNotification from '@hooks/use-notifications'

const NEXT_PUBLIC_CANCEL_TIMER_MINUTES = parseInt(
  process.env.NEXT_PUBLIC_CANCEL_TIMER_MINUTES || '2',
  10,
) // Default to 2 minutes
const CANCEL_TIMER: number = NEXT_PUBLIC_CANCEL_TIMER_MINUTES * 60 * 1000 // Convert minutes to milliseconds

interface ICallFrameProps {
  consultationId: number
  consultationUrl: string
  status: IAcceptedConsultation['consultation']['status']
  consultationType: IAcceptedConsultation['consultation']['consultationType']
  setCallObject?: (val: unknown) => void
  setCallFrame: Dispatch<SetStateAction<DailyCall>>
  setCallState: Dispatch<SetStateAction<DailyEvent>>
  startConsultation: (id: number) => void
  callFrame: DailyCall
  callState: DailyEvent
  children?: React.ReactNode
}

export default function VideoCallFrame({
  consultationId,
  consultationUrl,
  setCallObject,
  status,
  consultationType,
  setCallState,
  startConsultation,
  children,
  callState,
}: ICallFrameProps) {
  const videoRef = useRef(null)

  const [callFrame, setCallFrame] = useState<DailyCall>(null)
  const [isFrameCreated, setIsFrameCreated] = useState(false)
  const { addNotification } = useNotification()
  const { cancel } = useConsultation()

  let timer = useRef<NodeJS.Timeout>(null)
  let retryCount = useRef<number>(0) // Use a ref to keep track of retry count
  const MAX_RETRIES = 3

  const startTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      notifications.show({
        id: 'call-not-joined',
        title: 'Cancelling',
        message: 'Patient did not join the meeting in time',
        color: 'red',
        loading: true,
        autoClose: false,
        withCloseButton: false,
        icon: <IconAlertTriangle />,
      })
      cancel(consultationId).finally(() => {
        notifications.hide('call-not-joined')
      })
    }, CANCEL_TIMER)
  }, [cancel, consultationId])
  const cancelTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
  }, [])
  const handleJoinMeeting = useCallback(async () => {
    if (status !== 'started') {
      await startConsultation(consultationId)
    }
  }, [consultationId, startConsultation, status])
  const { data } = useQuery(
    ['token', consultationUrl],
    () => getVideoToken(consultationId),
    {
      enabled: !!consultationId && consultationType === 'VIRTUAL',
    },
  )

  const { user } = useProfile()
  const fullName = `${user?.firstName} ${user?.lastName}`
  const router = useRouter()

  useEffect(() => {
    const initializeCallFrame = async () => {

      const currentVideoRef = videoRef.current
      if (!videoRef.current || isFrameCreated || callFrame) {
        return
      }
       let newCallFrame;

      if (!newCallFrame) {
        newCallFrame = DailyIframe.createFrame(currentVideoRef) // Use currentVideoRef
      }

      if (consultationId && data?.token && newCallFrame?.iframe) {
        newCallFrame.join({
          url: consultationUrl,
          userName: `Dr. ${fullName}`,
          token: data?.token,
          iframeStyle: {
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            boxShadow: `0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02),
            0 4px 8px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.02),
            0 16px 32px rgba(0, 0, 0, 0.02)`,
          },
          showLeaveButton: false,
          showFullscreenButton: true,
          showLocalVideo: true,
          showParticipantsBar: false,
          showUserNameChangeUI: false,
        })
      }

      setCallFrame(newCallFrame)
      setIsFrameCreated(true)

      newCallFrame
        .on('loaded', () => setCallState('loaded'))
        .on('left-meeting', () => setCallState('left-meeting'))
        .on('joined-meeting', async () => {
          setCallState('joined-meeting')
          if (status === 'accepted') {
            await handleJoinMeeting()
          }

          if (newCallFrame.participantCounts().present <= 1) {
            startTimer()
          }
        })
        .on('participant-joined', () => {
          cancelTimer()
          setCallState('participant-joined')
          return showNotification({
            message: 'Patient has joined the call',
          })
        })
        .on('participant-left', () => {
          return showNotification({
            message: 'Patient has left the call',
          })
        })
        .on('error', (e) => {
          router.push('/').finally(() => {
            showNotification({
              title: 'Error',
              message: e.errorMsg,
              color: 'red',
              icon: <IconAlertTriangle />,
            })
          })
        })

      return () => {
        if (newCallFrame) {
          newCallFrame.destroy()
          setCallFrame(null)
          setIsFrameCreated(false)
        }
      }
    }

    initializeCallFrame()
  }, [
    isFrameCreated,
    callFrame,
videoRef.current,
    handleJoinMeeting,
    consultationId,
    consultationUrl,
    data?.token,
    fullName,
    setCallState,
    status,
    router,
    setCallObject,
    startTimer,
    cancelTimer,
  ])

  const leaveMeeting = () => {
    if (callFrame && callState === 'participant-joined') {
      callFrame.leave()
    } else {
      let message = "You haven't started the meeting yet. Join to start!"
      if (callState !== 'joined-meeting') {
        message =
          'Cannot leave the meeting as the participant has not joined yet.'
      }
      addNotification({
        message,
        type: 'warning',
      })
    }
  }

  return data ? (
    <Stack h="100%">
      <Group position="apart">
        {children}
        <Button onClick={leaveMeeting} ml="lg" color="red.5">
          Leave
        </Button>
      </Group>
      <div
        ref={videoRef}
        style={{ width: '100%', height: '90%', borderRadius: '12px' }}
      />
    </Stack>
  ) : null
}
