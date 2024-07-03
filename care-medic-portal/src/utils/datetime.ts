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

const userTimezone = Intl.DateTimeFormat().resolvedOptions()
dayjs.tz.setDefault(userTimezone.timeZone)

export const datetime = dayjs

export const convertDate = (dateString) => dayjs.utc(dateString)
