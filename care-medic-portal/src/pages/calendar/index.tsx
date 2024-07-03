import FullCalendar from '../../components/calender'
import { useDisclosure } from '@mantine/hooks'
import useCalendar from '@hooks/use-calendar'
import Layout from '../../components/layout'

function DoctorCalendar() {
  const [open, { toggle, close }] = useDisclosure(false)
  const { entries } = useCalendar()
  return (
    <Layout title="Calendar" actionLabel="New Event" action={toggle}>
      <FullCalendar entries={entries} open={open} close={close} />
    </Layout>
  )
}

export default DoctorCalendar
DoctorCalendar.title = 'Calendar'
