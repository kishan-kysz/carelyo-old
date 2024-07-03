import { keys } from '@mantine/utils'

export const filterMessages = (array, params) => {
  if (params) {
    return array.filter((message) =>
      message.sender.toLowerCase().includes(params.toLowerCase()),
    )
  }
  return array
}

export const filterData = (data, search) => {
  const query = search.toLowerCase().trim()
  if (query === 'all') {
    return data
  }

  if (Array.isArray(data)) {
    return data.filter((item) => {
      const values = keys(item).map((key) => item[key])
      return values.some((value) => String(value).toLowerCase().includes(query))
    })
  }
  return data
}
