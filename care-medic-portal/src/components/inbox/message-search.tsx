import { Input } from '@mantine/core'
import { memo, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

function MessageSearch({ setQuery }) {
  const [searchText, setSearchText] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value)
    setQuery(value.toLowerCase())
  }

  return (
    <Input
      mb="md"
      mt="sm"
      width={'50%'}
      sx={{ width: '100%' }}
      icon={<IoSearchOutline size={24} />}
      placeholder="Search messages..."
      fw={700}
      value={searchText}
      onChange={handleInputChange}
    />
  )
}

export default memo(MessageSearch)
