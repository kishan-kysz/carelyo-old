import { IGetMessagesByUser } from '@types'
import { datetime } from './datetime'

export const truncateString = (str: string) =>
  str.length > 10 ? `${str.substring(0, 15)}...` : str

export const getInitials = (user) => `${user?.charAt(0)}`
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
export const getAge = (dateString) =>
  dateString
    ? `${datetime().from(new Date(dateString), true)} old, ${datetime(
        dateString,
      ).format('YYYY/MM/DD')}`
    : 'No age provided'

export const formatDate = (dateString: Date | string, format?: string) =>
  datetime(dateString).format(format || 'lll')
export const capitalize = (string: string) => {
  return typeof string === 'string'
    ? string.charAt(0).toUpperCase() + string.slice(1)
    : ''
}

export const getInitialsFromName = (name: string) => {
  const names = name.split(' ')
  const initials = names.map((n) => n[0])
  return initials.join('')
}

export const utcToLocal = (utcTimestamp: Date | string) => {
  const timezoneOffset = new Date().getTimezoneOffset()
  const localTime = new Date(utcTimestamp)
  localTime.setMinutes(localTime.getMinutes() - timezoneOffset)
  const localDateString = localTime.toLocaleDateString()
  const localTimeString = localTime.toLocaleTimeString()
  return `${localDateString} ${localTimeString}`
}
const locale = process.env.NEXT_PUBLIC_LOCALE || 'en-NG'
const currency = process.env.NEXT_PUBLIC_CURRENCY || 'NGN'
export const formatCurrencyToLocal = (amount: number): string => {
  //IMplement functions once we have provider
  const formatCurrency = Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  })

  return formatCurrency.format(amount)
}

export const formatCurrency = Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
})

export const sortByLatestDate = (messages: IGetMessagesByUser[]) => {
  const now = new Date().getTime()
  return messages.sort((a, b) => {
    return (
      Math.abs(now - new Date(a.createdAt).getTime()) -
      Math.abs(now - new Date(b.createdAt).getTime())
    )
  })
}

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      const result = fileReader.result
      if (typeof result === 'string') {
        resolve(result.split(',')[1])
      } else {
        reject('')
      }
    }
    fileReader.onerror = (error) => {
      console.error(`Failed to read file: ${error}`)
      reject('')
    }
  })
}
