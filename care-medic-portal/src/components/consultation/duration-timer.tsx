import useDurationTimer from '@hooks/use-duration-timer'
import { Paper, Text, createStyles, keyframes } from '@mantine/core'
import { ConsultationAccepted } from '@types'
import { useEffect } from 'react'
import { showNotification } from '@mantine/notifications'

const DurationTimer = ({
  consultation,
  leaveCall,
}: {
  consultation: ConsultationAccepted
  leaveCall: () => void
}) => {
  const { classes, cx } = useStyles()

  const { minutes, seconds, updateTimer, completed } = useDurationTimer({
    id: consultation.id,
  })

  useEffect(() => {
    const duration = consultation.duration
    const initMinute = Math.floor(duration)
    const initSecond = Math.floor((duration * 60) % 60)

    updateTimer(initMinute, initSecond)
  }, [consultation.duration, updateTimer])

  useEffect(() => {
    if (completed) {
      showNotification({
        title: 'Time is up',
        message: 'Call will be disconnected in less than 1 minute',
        color: 'red',
      })
      setTimeout(() => {
        leaveCall()
      }, 60000)
    }
  }, [completed, leaveCall])

  return (
    <Paper
      withBorder
      shadow="xs"
      px="xs"
      py={2}
      className={classes.display}
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[1],
        cursor: 'pointer',
      })}
    >
      <Text
        className={cx(classes.text, {
          [classes.warning]: minutes < 1,
          [classes.completed]: completed,
        })}
      >
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </Text>
    </Paper>
  )
}

export default DurationTimer

const useStyles = createStyles(({ fontSizes, colors, shadows }) => ({
  text: {
    fontSize: fontSizes.md,
    color: colors.dark[7],
  },
  display: {
    borderColor: colors.teal[6],
  },
  warning: {
    color: colors.red[7],
  },
  completed: {
    animation: `${completed} 1s infinite`,
  },
}))

const completed = keyframes({
  '0%': {
    fontSize: '1rem',
  },
  '50%': {
    fontSize: '1.1rem',
  },
  '100%': {
    fontSize: '1rem',
  },
})
