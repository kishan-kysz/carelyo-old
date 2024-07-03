import { useLocalStorage } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useCallback, useEffect, useState } from 'react'

const useDurationTimer = ({
  id,
  initMinute = 0,
  initSecond = 0,
}: {
  id: number
  initMinute?: number
  initSecond?: number
}) => {
  const NOTIFICATION_MINUTE = 1
  const [completed, setCompleted] = useState<boolean>(false)
  const [{ minutes, seconds }, setTime] = useLocalStorage({
    key: `consultation-time-${id}`,
    defaultValue: {
      minutes: initMinute,
      seconds: initSecond,
    },
  })

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(`consultation-time-${id}`)
  }, [id])
  // console.log( "use-duration-timer.tsx",{ minutes, seconds, completed, initMinute, initSecond })
  useEffect(() => {
    let myInterval
    if (!completed) {
      myInterval = setInterval(() => {
        if (minutes === NOTIFICATION_MINUTE && seconds === 0) {
          showNotification({
            message: `${NOTIFICATION_MINUTE} minute remaining`,
            autoClose: 5000,
            color: 'yellow',
          })
        }
        if (minutes <= 0 && seconds <= 0) {
          setCompleted(true)
          clearInterval(myInterval)
          clearLocalStorage
        } else if (seconds === 0) {
          setTime({ minutes: minutes - 1, seconds: 59 })
        } else {
          setTime({ minutes, seconds: seconds - 1 })
        }
      }, 1000)
    }
    return () => {
      clearInterval(myInterval)
    }
  }, [
    initMinute,
    initSecond,
    minutes,
    seconds,
    setTime,
    completed,
    clearLocalStorage,
  ])

  const updateTimer = useCallback(
    (minutes: number, seconds: number) => {
      setTime({ minutes, seconds })
    },
    [setTime],
  )

  return {
    completed,
    minutes,
    seconds,
    setCompleted,
    updateTimer,
    clearLocalStorage,
  }
}

export default useDurationTimer
