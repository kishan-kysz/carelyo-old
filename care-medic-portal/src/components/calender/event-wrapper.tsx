import {
  Badge,
  Box,
  Button,
  Group,
  HoverCard,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import NewEventModal from './modal'

export default function CalendarEventWrapper({ event }) {
  const [open, { toggle, close }] = useDisclosure(false)
  return (
    <>
      <HoverCard
        width={320}
        position="right"
        openDelay={100}
        closeDelay={200}
        withinPortal={true}
        zIndex={122200}
      >
        <HoverCard.Target>
          <Paper
            withBorder={true}
            shadow="md"
            sx={{
              maxWidth: '50%',
              backgroundColor: event.color,
            }}
          >
            <Group position="left">
              <Text> {event.title}</Text>
            </Group>
          </Paper>
        </HoverCard.Target>
        <HoverCard.Dropdown p={0} m={0} sx={{ border: 0 }}>
          <Box sx={{ backgroundColor: event.color }} p="xs">
            <Title order={3}> {event.title}</Title>
          </Box>
          <Stack p="sm">
            <Text lineClamp={50}>
              {event.description || 'No description...'}
            </Text>
            <Group>
              <Badge
                color={event.availabilityStatus ? 'green' : 'red'}
                variant="outline"
              >
                {event.availabilityStatus ? 'Available' : 'Not Available'}
              </Badge>
              {event.allDay && <Badge variant="outline">All Day</Badge>}
            </Group>
            <Button onClick={toggle} size="sm" fullWidth={true}>
              Edit
            </Button>
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>
      {open && <NewEventModal open={open} close={close} event={event} />}
    </>
  )
}
