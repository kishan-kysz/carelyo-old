import { useLocalStorage } from '@mantine/hooks'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface useCountdownOptions {
  initMinute?: number
  initSeconds?: number
  options?: {
    onStart?: () => void
    onEnd?: () => void
    onComplete?: () => void
  }
}

/**
 * It's a custom hook that returns an object with a completed boolean, minutes and seconds, and a
 * setCompleted function.
 * @returns An object with the following properties: completed, minutes, seconds, setCompleted.
 */
export default function useCountdown({
  initMinute = 0,
  initSeconds = 0,
}: useCountdownOptions) {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)
  const [{ minutes, seconds }, setTime] = useLocalStorage({
    key: 'time',
    defaultValue: { minutes: initMinute, seconds: initSeconds },
  })

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const onExit = () => {
      setTimeout(() => {
        setTime({ minutes: initMinute, seconds: initSeconds })
      }, 1000)
    }
    router.events.on('routeChangeStart', onExit)
    const myInterval = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        setCompleted(true)
        clearInterval(myInterval)
        router.push('/bookings')
      } else if (seconds === 0) {
        setTime({ minutes: minutes - 1, seconds: 59 })
      } else {
        setTime({ minutes, seconds: seconds - 1 })
      }
    }, 1000)

    return () => {
      clearInterval(myInterval)
      router.events.off('routeChangeStart', onExit)
    }
  }, [initMinute, initSeconds, minutes, router, seconds, setTime])

  return { completed, minutes, seconds, setCompleted }
}
