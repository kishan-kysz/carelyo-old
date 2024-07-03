import {
  Anchor,
  Badge,
  Box,
  Card,
  Center,
  createStyles,
  Group,
  Loader,
  LoadingOverlay,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
  Flex,
} from '@mantine/core'
import dayjs from 'dayjs'
import { isEmptyObject } from 'is-what'
import useProfile from '@hooks/use-profile'
import { acceptConsultation } from '@routes'
import { IBookedConsultation } from '@types'
import useConsultation from '@hooks/use-consultation'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useElapsedTime } from '@hooks/use-elapsed-time'
import { formatDate, getAge } from '@utils/helpers'
import { DashboardHeader } from './dashboard-header'
import { Fragment, useEffect, useState } from 'react'
import { ConfirmError } from '@components/core/confirm-error'
import { hideNotification, showNotification } from '@mantine/notifications'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { setActiveConsultation, resetSbar } from '@utils/actions'
import { useStateMachine } from 'little-state-machine'
import router from 'next/router'
dayjs.extend(relativeTime)

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing.xs,
  },
  card: {
    display: 'block',
    margin: `${theme.spacing.md}px auto`,
    borderRadius: 10,
    marginTop: theme.spacing.lg,
    cursor: 'pointer',
  },
  content: {
    borderColor: theme.colors.gray[4],
    padding: theme.spacing.sm,
    borderRadius: 10,
    backgroundColor: theme.colors.gray[1],
  },
  stack: {
    position: 'relative',
    transition: 'transform cubic-bezier(0.175,  0.885, 0.320, 1.275) 0.5s',
    willChange: 'transform',
    boxShadow: '1px 25px 25px 1px rgba(0,0,0,0.1)',
    '&:before,&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      border: `1px solid ${theme.colors.gray[2]}`,
      transition: 'transform cubic-bezier(0.175,  0.885, 0.320, 1.275) 0.5s',
      willChange: 'transform',
      borderRadius: 10,
    },
    '&:after': {
      zIndex: -2,
      backgroundColor: theme.fn.darken(theme.colors.teal[3], 0.4),
    },
    '&:before': {
      backgroundColor: theme.fn.darken(theme.colors.teal[3], 0.3),
      zIndex: -1,
    },
    '&:hover': {
      transform: 'translate(5px, -5px)',
      '::before': { transform: 'translate(-5px, 5px)' },
      '::after': { transform: 'translate(-10px,10px) ' },
    },
  },
  timer: {
    color: theme.fn.darken(theme.colors.teal[8], 0.15),
    fontWeight: 'bold',
    fontSize: '1.8rem',
  },
}))

const BookingItem = ({
  consultation,
}: {
  consultation: IBookedConsultation
}) => {
  const theme = useMantineTheme()
  const { classes, cx } = useStyles()
  const queryClient = useQueryClient()
  const { user, invalidate, addRoomname } = useProfile()
  const activeConsultation = isEmptyObject(user?.activeConsultation)
    ? null
    : user?.activeConsultation
  const { actions } = useStateMachine({
    setActiveConsultation,
    resetSbar,
  })

  const formatErrorMessage = `You have an active or incomplete consultation with ${activeConsultation?.patientName}`
  const handleErrorAction = () => {
    void router.push({
      pathname: '/consultation/[id]',
      query: { id: activeConsultation.roomName },
    })
    hideNotification('accept-consultation-error')
  }

  const { mutateAsync: accept, isLoading } = useMutation(acceptConsultation, {
    onError: (err) => {
      showNotification({
        id: 'accept-consultation-error',
        autoClose: false,
        color: 'red',
        title: 'Failed to accept consultation',
        message:
          activeConsultation !== null ? (
            <ConfirmError
              error={formatErrorMessage}
              action={handleErrorAction}
              actionText="View consultation"
            />
          ) : (
            // @ts-ignore
            err.response.data.errors[0].message
          ),
      })
    },
    onSuccess: (data) => {
      console.log(data)
      if (data.roomName) {
        if (isMobileDevice()) {
          showNotification({
            id: 'not-allowed-notification',
            color: 'red',
            title: 'Not Allowed on Mobile',
            message: 'This action is not allowed on mobile devices.',
          })
        } else {
          void router.push({
            pathname: '/consultation/[id]',
            query: { id: data.roomName },
          })
          actions.setActiveConsultation(!!data.roomName)
          addRoomname(queryClient, data.roomName)
        }
      }
    },
  })

  const firstName = user?.firstName || 'User'
  const lastName = user?.lastName || 'User'

  const onConsultationClick = async () => {
    if (isMobileDevice()) {
      showNotification({
        id: 'not-allowed-notification',
        color: '#10751c',
        title: (
          <div>
            <span style={{ color: 'gray', fontWeight: '900' }}>
              Dr. {firstName} {lastName}
            </span>
          </div>
        ),
        message: (
          <div style={{ color: '#10751c', fontWeight: '100' }}>
            Switch to Tablet or Laptop for Consultations!
            {/* <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openOrderPage();
              }}style={{ color: "gray", textDecoration: "underline" }}
            ><br />
              Grab a new device at Carelyo WebShop!
            </a> */}
          </div>
        ),
      })
    } else {
      await accept(consultation.id)
      await invalidate(queryClient)
      await queryClient.invalidateQueries(['bookedConsultations'])
    }
  }

  // Function to check if the user is on a mobile device
  const isMobileDevice = () => {
    const mobileBreakpoint = 768 // Define your breakpoint for mobile devices
    return window.innerWidth < mobileBreakpoint
  }
  return (
    <Tooltip label="Click to accept consultation">
      <div className={cx(classes.card, classes.stack)} role="feed">
        <Card
          withBorder
          p="md"
          shadow="md"
          sx={{
            pointerEvents: isLoading ? 'none' : 'auto',
          }}
          className={classes.content}
          onClick={onConsultationClick}
          role="button"
        >
          <div>
            <Card.Section
              inheritPadding
              py="xs"
              sx={{
                borderBottom: `1px solid ${theme.fn.rgba(
                  theme.colors.gray[6],
                  0.5,
                )}`,
              }}
            >
              <LoadingOverlay visible={isLoading} />
              <Stack spacing={0}>
                <Group position="left">
                  <Anchor
                    color="#10751c"
                    fw={700}
                    mb={5}
                    transform="capitalize"
                  >
                    <small>PATIENT INFORMATION</small>
                  </Anchor>
                </Group>
                {consultation.isChild ?
                  <Fragment>
                    <Group position="left">
                      <Badge variant="dot" color="green" size="lg">
                        {getAge(consultation?.age)}
                      </Badge>
                      <Badge variant="dot" color="green" size="lg">
                        {consultation?.gender || 'No gender provided'}
                      </Badge>
                      <Badge variant="dot" color="green" size="lg">
                        {consultation?.language || 'No Language Provided'}
                      </Badge>
                    </Group>
                  </Fragment>
                  :
                  <Fragment>
                    <Group position="left">
                      <Badge variant="dot" color="green" size="lg">
                        {getAge(consultation?.age)}
                      </Badge>
                      <Badge variant="dot" color="green" size="lg">
                        {consultation?.gender || 'No gender provided'}
                      </Badge>
                      <Badge variant="dot" color="green" size="lg">
                        {consultation?.language || 'No Language Provided'}
                      </Badge>
                    </Group>
                  </Fragment>}
              </Stack>
            </Card.Section>
            <Card.Section
              inheritPadding
              py="md"
              sx={{
                borderBottom: `1px solid ${theme.fn.rgba(
                  theme.colors.gray[6],
                  0.5,
                )}`,
              }}
            >
              <Stack spacing={10}>
                <Flex justify="space-between">
                  <Box>
                    <Group position="left">
                      <Anchor
                        // color="#10751c"
                        mb={5}
                        transform="capitalize"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        <small>CONSULTATION TYPE</small>
                      </Anchor>
                    </Group>
                    <Group position="left">
                      <Badge variant="dot" color="green" size="lg">
                        {consultation?.consultationType}
                      </Badge>
                    </Group>
                  </Box>
                  <Box>
                    <Group position="right">
                      <Anchor color="#10751c" mb={5} transform="capitalize">
                        <small>SELECTED BODY PART</small>
                      </Anchor>
                    </Group>
                    <Group position="right">
                      {consultation.bodyArea.map((area) => (
                        <Badge variant="dot" color="green" key={area} size="lg">
                          {area}
                        </Badge>
                      ))}
                    </Group>
                  </Box>
                </Flex>
              </Stack>
            </Card.Section>
            <Card.Section p="lg">
              <TimeElapsed date={consultation.timeBooked} />
            </Card.Section>
          </div>
        </Card>
      </div>
    </Tooltip>
  )
}
const TimeElapsed = ({ date }: { date: string | Date | number }) => {
  const { elapsedTime, date: duration } = useElapsedTime(date)
  const { classes } = useStyles()
  return (
    <Stack spacing={0}>
      <Group position="apart">
        <Anchor color="#10751c">
          <small>TIME IN QUEUE</small>
        </Anchor>
        <Text size="lg" color="black">
          {formatDate(duration)}
        </Text>
      </Group>
      <Text align="center" my={5} className={classes.timer}>
        {elapsedTime}
      </Text>
    </Stack>
  )
}
const BookingQueue = () => {
  const { data } = useConsultation()
  const { classes } = useStyles()
  const [consultation, setConsultation] = useState<IBookedConsultation>()
  const [defaultValue, setDefaultValue] = useState<string>()
  useEffect(() => {
    if (data) {
      setConsultation(data[0])
      setDefaultValue(data[0]?.consultationType)
    }
  }, [data])
  const handleFilter = (consultationType: string) => {
    const filteredData = data.filter((item) => {
      return item.consultationType === consultationType
    })
    setConsultation(filteredData[0])
  }
  return data ? (
    <Box className={classes.wrapper}>
      <Stack>
        <DashboardHeader
          consultation={data.length > 0 ? true : false}
          handleFilter={handleFilter}
          title="Consultation Queue"
          defaultValue={defaultValue}
        />
      </Stack>
      <Box>
        {data?.length >= 1 ? (
          <>
            {consultation ? (
              <BookingItem consultation={consultation} />
            ) : (
              <Text my={16} align="center">
                No consultation of that type available currently
              </Text>
            )}
          </>
        ) : (
          <Center my="lg">
            <Text align="center">
              No consultations available at this moment
            </Text>
          </Center>
        )}
        <Center my="md">
          <Loader variant="dots" />
        </Center>
        <Text align="center" color="black" size="xl" fw={900}>
          <Box
            sx={(theme) => ({
              display: 'inline-block',
              color: theme.colors.dark[5],
              backgroundColor: theme.colors.gray[8],
              borderRadius: 5,
              padding: '0.2rem 0.5rem',
            })}
          >
            <Text fw={600} color="white">
              {data ? (data.length <= 1 ? 0 : data?.length - 1) : 0}
            </Text>
          </Box>{' '}
          {data?.length <= 1 ? 'consultation ' : 'consultations '}
          in queue
        </Text>
      </Box>
    </Box>
  ) : (
    <></>
  )
}

export default BookingQueue
