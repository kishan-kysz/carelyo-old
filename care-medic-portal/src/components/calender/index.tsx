import { Box, Paper } from '@mantine/core'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import SV from 'date-fns/locale/sv'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import NewEventModal from './modal'
import CalendarEventWrapper from './event-wrapper'

const locales = {
  'se-SV': SV,
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
export default function FullCalendar({ entries, open, close }) {
  const { events, components } = useMemo(
    () => ({
      events: entries,
      components: {
        eventWrapper: CalendarEventWrapper,
        event: CalendarEventWrapper,
      },
    }),
    [entries],
  )

  return (
    <Box sx={{ height: '85vh' }}>
      {open && <NewEventModal open={open} close={close} />}
      <Paper
        p="md"
        radius={0}
        sx={{ background: 'none', border: 'none' }}
        defaultView="work_week"
        views={['work_week', 'month', 'day', 'agenda']}
        component={Calendar}
        localizer={localizer}
        events={events}
        components={components}
      />
    </Box>
  )
}
