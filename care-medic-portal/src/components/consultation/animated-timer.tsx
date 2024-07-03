import { useState, useEffect, useMemo } from 'react'
import {
  ActionIcon,
  Container,
  Divider,
  Flex,
  RingProgress,
  Text,
  Title,
} from '@mantine/core'
import { IconCalendarTime } from '@tabler/icons-react'
import { ConsultationAccepted } from '@types'

const AnimatedTimer = ({
  consultation,
}: {
  consultation: ConsultationAccepted
}) => {
  const timeStarted =
    Date.parse(consultation.timeStarted) -
    Number(new Date().getTimezoneOffset() * 60 * 1000)
  const duration = Number(consultation.duration) * 1000 * 60
  const initTime = timeStarted + duration

  const [remainingTime, setRemainingTime] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const targetDate = useMemo(() => new Date(initTime), [initTime])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date()
      const diff = targetDate.valueOf() - now.valueOf()

      setRemainingTime(diff > 0 ? diff / 1000 : 0)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [targetDate])

  useEffect(() => {
    const daySeconds = 86400
    const hourSeconds = 3600
    const minuteSeconds = 60

    setHours(Math.floor((remainingTime % daySeconds) / hourSeconds))
    setMinutes(Math.floor((remainingTime % hourSeconds) / minuteSeconds))
    setSeconds(Math.floor(remainingTime % minuteSeconds))
  }, [remainingTime])

  return (
    <Container
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text
        sx={{
          backgroundColor: '#fff',
          border: '1px solid #DEE2E6',
          borderRadius: 10,
          textAlign: 'center',
        }}
        m={10}
        p={10}
        color="teal.9"
        maw={400}
      >
        <Flex
          justify="center"
          align="center"
          mb={10}
          direction="row"
          wrap="wrap"
        >
          <Flex justify="center" align="center">
            <ActionIcon variant="transparent" color="teal.8" mr={5}>
              <IconCalendarTime size={30} />
            </ActionIcon>
            <Title order={6}>Time remaining</Title>
          </Flex>
        </Flex>
        <Divider my="sm" size="sm" variant="dotted" />

        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <RingProgress
            size={70}
            thickness={5}
            roundCaps={true}
            sections={[{ value: (hours * 100) / 24, color: 'blue' }]}
            label={
              <Text color="blue" weight={700} align="center" size="md">
                {hours} <Text size="xs">Hrs</Text>
              </Text>
            }
          />
          <RingProgress
            size={70}
            thickness={5}
            roundCaps={true}
            sections={[{ value: (minutes * 100) / 60, color: 'yellow' }]}
            label={
              <Text color="yellow" weight={700} align="center" size="md">
                {minutes} <Text size="xs">Min</Text>
              </Text>
            }
          />
          <RingProgress
            size={70}
            thickness={5}
            roundCaps={true}
            sections={[{ value: (seconds * 100) / 60, color: 'teal' }]}
            label={
              <Text color="teal" weight={700} align="center" size="md">
                {seconds} <Text size="xs">Sec</Text>
              </Text>
            }
          />
        </Flex>
      </Text>
    </Container>
  )
}

export default AnimatedTimer
