/* eslint-disable no-nested-ternary */
import { useEffect } from 'react'
import useCountdown from '@hooks/use-countdown'

function Timer({ initMinute, initSeconds, onCompleted }) {
  const { completed, seconds, minutes, setCompleted } = useCountdown({
    initMinute,
    initSeconds,
  })

  useEffect(() => {
    if (completed) {
      onCompleted()
    }
    return () => setCompleted(false)
  }, [completed, onCompleted, setCompleted])
  return (
    <div>
      {minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds}
    </div>
  )
}

export default Timer
