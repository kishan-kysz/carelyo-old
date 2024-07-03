import {
  Group,
  Paper,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { cd10 } from '@prisma/client'
import { IconNoDerivatives } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Dispatch, SetStateAction, useState } from 'react'

interface Icd10SearchProps {
  selected: cd10[]
  setSelected: Dispatch<SetStateAction<cd10[]>>
  handleDiagnosis?: Function
}

export function Cd10Search({
  selected,
  setSelected,
  handleDiagnosis,
}: Icd10SearchProps) {
  const [search, setSearch] = useState('')
  const theme = useMantineTheme()
  const { data, isLoading } = useQuery(
    ['icd10', search],
    async () => {
      return fetch(`/api/icd10?search=${search}`).then(
        (res) => res.json() as Promise<cd10[]>,
      )
    },

    { enabled: search.length >= 1, initialData: [] },
  )

  interface SelectItemProps extends cd10 {
    onClick: () => void
  }

  const SelectItem = ({
    icd103_code,
    icd103_code_description,
    icd10_code,
    group_description,
    who_full_description,
    onClick,
    ..._others
  }: SelectItemProps) => {
    return (
      <Paper
        p="xs"
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          '&:hover': { backgroundColor: theme.colors.gray[0] },
        }}
      >
        <Stack spacing={1}>
          <Group position="apart">
            <Text>{icd103_code}</Text>
            <Stack spacing={0}>
              <Text size="xs">{icd10_code}</Text>
              <Text size="xs" color="dimmed">
                {group_description}
              </Text>
            </Stack>
          </Group>
          <Text size="xs">{who_full_description}</Text>
        </Stack>
      </Paper>
    )
  }

  const handleSelect = (item: cd10) => {
    const formattedIcd10String = `${item.icd10_code} ${item.icd103_code} ${item.who_full_description}`

    if (handleDiagnosis) {
      handleDiagnosis(formattedIcd10String)
    }
    // must be unique
    if (selected.find((i) => i.id === item.id)) return

    setSelected((prev) => [...prev, item])
  }
  const [opened, setOpened] = useState(false)
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom"
      withArrow
      width="100%"
    >
      <Popover.Target>
        <TextInput
          label="ICD10 Search"
          placeholder="Search"
          value={search}
          onFocus={() => setOpened((o) => !o)}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <ScrollArea h={400} offsetScrollbars={true}>
          {data.length > 0 ? (
            data.map((item) => (
              <SelectItem
                key={item.id}
                {...item}
                onClick={() => handleSelect(item)}
              />
            ))
          ) : (
            <Stack align="center" justify="center" spacing={2} h={250}>
              <IconNoDerivatives size={40} color={theme.colors.gray[3]} />
              <Text color="dimmed">
                {search.length <= 0 ? 'Start typing...' : 'No results'}
              </Text>
            </Stack>
          )}
          {isLoading && <Text>Loading...</Text>}
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  )
}

export default React.memo(Cd10Search)


// import React, { useState, useEffect } from 'react'
// import './styles.css'
// import * as ECT from '@whoicd/icd11ect'
// import '@whoicd/icd11ect/style.css'
// import { MongoClient } from 'mongodb'
// import dotenv from 'dotenv'
// import {
//   Group,
//   Paper,
//   Popover,
//   ScrollArea,
//   Stack,
//   Text,
//   TextInput,
//   useMantineTheme,
// } from '@mantine/core'
// import { IconNoDerivatives } from '@tabler/icons-react'
// import { cd10 } from '@prisma/client'
// import { useQuery } from '@tanstack/react-query'

// dotenv.config()

// const searchMongoDB = async (searchQuery) => {
//   // Implement your MongoDB search logic here
// }

// const Cd10Search = ({ selected, setSelected, handleDiagnosis }) => {
//   const [search, setSearch] = useState('')
//   const theme = useMantineTheme()
//   const { data, isLoading, isError } = useQuery(
//     ['icd10', search],
//     async () => {
//       try {
//         const response = await fetch(`/api/icd10?search=${search}`)
//         if (!response.ok) {
//           throw new Error('API error')
//         }
//         return response.json()
//       } catch (error) {
//         console.error('API error:', error)
//         // Fallback to MongoDB search
//         return searchMongoDB(search)
//       }
//     },
//     { enabled: search.length >= 1, initialData: [], retry: false },
//   )

//   const handleSelect = (item) => {
//     const formattedIcd10String = `${item.icd10_code} ${item.icd103_code} ${item.who_full_description}`

//     if (handleDiagnosis) {
//       handleDiagnosis(formattedIcd10String)
//     }
//     // must be unique
//     if (selected.find((i) => i.id === item.id)) return

//     setSelected((prev) => [...prev, item])
//   }

//   const [opened, setOpened] = useState(false)
//   return (
//     <Popover
//       opened={opened}
//       onChange={setOpened}
//       position="bottom"
//       withArrow
//       width="100%"
//     >
//       <Popover.Target>
//         <TextInput
//           label="ICD10 Search"
//           placeholder="Search"
//           value={search}
//           onFocus={() => setOpened((o) => !o)}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </Popover.Target>
//       <Popover.Dropdown>
//         <ScrollArea h={400} offsetScrollbars={true}>
//           {isError ? (
//             <Stack align="center" justify="center" spacing={2} h={250}>
//               <IconNoDerivatives size={40} color={theme.colors.red[6]} />
//               <Text color="red">
//                 Failed to fetch data. Searching in local database...
//               </Text>
//             </Stack>
//           ) : data.length > 0 ? (
//             data.map((item) => (
//               <SelectItem
//                 key={item.id}
//                 {...item}
//                 onClick={() => handleSelect(item)}
//               />
//             ))
//           ) : (
//             <Stack align="center" justify="center" spacing={2} h={250}>
//               <IconNoDerivatives size={40} color={theme.colors.gray[3]} />
//               <Text color="dimmed">
//                 {search.length <= 0 ? 'Start typing...' : 'No results'}
//               </Text>
//             </Stack>
//           )}
//           {isLoading && <Text>Loading...</Text>}
//         </ScrollArea>
//       </Popover.Dropdown>
//     </Popover>
//   )
// }

// export default React.memo(Cd10Search)
