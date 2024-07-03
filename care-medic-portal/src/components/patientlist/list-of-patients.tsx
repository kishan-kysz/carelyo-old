import {
  Divider,
  Pagination,
  Paper,
  ScrollArea,
  TextInput,
  rem,
} from '@mantine/core'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import PatientCard from './patient-card'
import { IPatients } from '@types'
export interface IMockData {
  name: string
  email: string
  id: number
}

const ListOfPatients = ({
  setId,
  patients,
  selectedPatientId,
}: {
  setId: Dispatch<SetStateAction<number>>
  patients: IPatients[]
  selectedPatientId: number
}) => {
  const [query, setQuery] = useState<string>('')
  const [userList, setUserList] = useState<IPatients[]>()
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState<number>()
  const itemsPerPage = 7
  const from = (pages - 1) * itemsPerPage
  const to = from + itemsPerPage

  useEffect(() => {
    setTotal(Math.ceil(patients?.length / itemsPerPage))
    setUserList(patients?.slice(from, to))
  }, [from, to, patients])

  const filterList = useMemo(() => {
    if (query && userList) {
      const filteredMessages = userList.filter((item) => {
        const fullName = `${item.firstName} ${item.surName}`
        const trimmedQuery = query.toLowerCase()
        return (
          item.email.toLowerCase().includes(trimmedQuery) ||
          fullName.toLowerCase().includes(trimmedQuery)
        )
      })
      return filteredMessages
    }
    return userList
  }, [query, userList])

  return (
    <Paper radius="md" h="100%" shadow="0px 0px 5px #c7c7c7" bg="white" p={16}>
      <TextInput
        onChange={(e) => setQuery(e.target.value)}
        variant="filled"
        placeholder="Search for patients"
        radius="md"
        icon={<IoSearchOutline size={24} />}
        value={query}
      />

      <Divider my="sm" />
      <Fragment>
        <ScrollArea type="scroll" scrollHideDelay={1250} h={rem(675)}>
          {filterList?.map((item) => (
            <PatientCard
              key={item.id}
              patient={item}
              selectedPatientId={selectedPatientId}
              setId={setId}
            />
          ))}
        </ScrollArea>
      </Fragment>
      <Pagination
        mt="0.5rem"
        size="md"
        position="center"
        value={pages}
        onChange={(p) => setPages(p)}
        total={total}
      />
    </Paper>
  )
}

export default ListOfPatients
