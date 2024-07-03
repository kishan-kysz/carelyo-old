import dayjs from 'dayjs'

export const DEFAULT_COLORS = [
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
]
export const DEFAULT_AVAILABILITY_STATUS = [
  'Available',
  'Unavailable',
  'Busy',
  'Away',
  'Out of Office',
]

export const DEFAULT_CALENDAR_VALUES = (event) => ({
  title: event ? event.title : '',
  start: event ? event.start : new Date(),
  end: event ? new Date(event.end) : null,
  allDay: event ? event.allDay : false,
  description: event ? event.description : '',
  color: event ? event.color : '#be4bdb',
  availabilityStatus: event ? event.availabilityStatus : false,
  url: event ? event.url : '',
})
export const HAIRCHECK_TIME = 2
export const DEFAULT_CONSULTATION = 15

export const ENDOFTHEDAY = dayjs(new Date()).endOf('day').toDate()
