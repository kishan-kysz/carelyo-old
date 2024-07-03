import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/sv'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export const useElapsedTime = (startDate) => {
  const [elapsedTime, setElapsedTime] = useState(dayjs.duration(0))

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(dayjs.duration(dayjs().diff(dayjs(startDate))))
    }, 1000)

    return () => clearInterval(interval)
  }, [startDate]) // Make sure to include `startDate` in the dependency array if it can change

  const hours = elapsedTime.hours()
  const minutes = elapsedTime.minutes()
  const seconds = elapsedTime.seconds()

  const time =
    elapsedTime.asMilliseconds() >= 86400000
      ? elapsedTime.humanize()
      : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return {
    elapsedTime: time,
    date: dayjs(startDate).toDate(),
    minutes,
    seconds,
  }
}
