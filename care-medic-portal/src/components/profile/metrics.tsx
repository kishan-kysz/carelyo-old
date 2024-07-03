import {
  Box,
  Card,
  Group,
  Rating,
  rem,
  ScrollArea,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { useStatistics } from '@hooks/use-statistics'
import { Dispatch, SetStateAction, useState } from 'react'
import { IconWallet } from '@tabler/icons-react'
import {
  formatCurrency,
  formatCurrencyToLocal,
  utcToLocal,
} from '@utils/helpers'
import useProfile from '@hooks/use-profile'
import HistoGram from './charts/histogram'

const PRIMARY_COL_HEIGHT = rem(500)
const BigTitle = ({ children }) => {
  return (
    <Text
      weight={700}
      color="dimmed"
      transform="uppercase"
      sx={{
        fontFamily: 'Inter, sans-serif',
      }}
      fz="sm"
      my="sm"
    >
      {children}
    </Text>
  )
}
const PaySlipBoxItem = ({ paySlip }) => {
  const theme = useMantineTheme()
  // Sort paySlip data by the current date
  const sortedPaySlip = paySlip?.slice()?.sort((a, b) => {
    const dateA = new Date(a.dateOnPayslip).getTime()
    const dateB = new Date(b.dateOnPayslip).getTime()
    return dateB - dateA // Descending order; use dateA - dateB for ascending
  })

  const rows = sortedPaySlip?.map((item) => (
    <tr key={item.id}>
      <td>{item.priceListName}</td>
      <td>{formatCurrencyToLocal(item.toBePaidOut)}</td>
      <td>{utcToLocal(item.dateOnPayslip).slice(0, 10)}</td>
    </tr>
  ))
  return (
    <Box h="100%">
      <ScrollArea h="100%">
        <Text mb="1rem" fw="bold" color="black">
          Payout
        </Text>
        <Table
          bg={'white'}
          withBorder
          striped
          highlightOnHover
          sx={{ borderRadius: theme.radius.md }}
        >
          <thead>
            <tr>
              <th>Service</th>
              <th>Payout</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </Box>
  )
}

export enum MetricType {
  All = 'ALL',
  Money = 'MONEY',
  Consultation = 'CONSULTATION',
}

const Metrics = ({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<string>>
}) => {
  const theme = useMantineTheme()
  const [selectedMetric, setSelectedMetric] = useState(MetricType.All)
  const { user } = useProfile()

  const { individualConsultationTime, paySlip, wallet } = useStatistics()

  const timeSpent = `${individualConsultationTime?.days}d ${individualConsultationTime?.hours}h ${individualConsultationTime?.minutes}m ${individualConsultationTime?.seconds}s`
  const undefinedTimeSpent = '0d 0h 0m 0s'
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`

  const handleChange = (val: string) => {
    if (val === MetricType.All) {
      setSelectedMetric(MetricType.All)
    } else if (val === MetricType.Money) {
      setSelectedMetric(MetricType.Money)
    } else if (val === MetricType.Consultation) {
      setSelectedMetric(MetricType.Consultation)
    }
  }
  return (
    <>
      <Tooltip label="View wallet" color={theme.primaryColor} withArrow>
        <Box mb={24} onClick={() => setActiveTab('wallet')}>
          <Card
            sx={{
              maxWidth: '100%',
              borderRadius: theme.radius.md,
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, sans-serif',
              justifyContent: 'space-between',
              marginTop: 16,
              border: '1px solid #E0E0E0',
              transition: 'all .4s lib',
              '&:hover': {
                background: '#F8F8F8',
              },
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'inherit',
                  gap: '16px',
                }}
              >
                <IconWallet color={'green'} />
                My Wallet
              </Text>
              <Group>
                <Text
                  sx={{
                    fontSize: 24,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: 'inherit',
                  }}
                >
                  Balance:
                </Text>
                <Text color={theme.primaryColor} fw="bold" size="xl">
                  {formatCurrencyToLocal(wallet?.balance)}
                </Text>
              </Group>
            </Box>
          </Card>
        </Box>
      </Tooltip>
      <BigTitle>Metrics</BigTitle>
      <SimpleGrid spacing="sm">
        <Box
          sx={{
            background: 'white',
            height: 'fit-content',
            borderRadius: '5px',
            border: '1px solid #E0E0E0',
          }}
        >
          <Group position="right" p="xs">
            <Select
              value={selectedMetric}
              onChange={handleChange}
              placeholder="All"
              maw={250}
              data={[
                { label: 'All', value: 'ALL' },
                { label: 'Money', value: 'MONEY' },
                { label: 'Consultation', value: 'CONSULTATION' },
              ]}
            />
          </Group>
          <Box h={350}>
            <HistoGram selectedMetric={selectedMetric} />
          </Box>
        </Box>
        <SimpleGrid cols={2}>
          <Box
            sx={{
              background: 'white',
              border: '1px solid #E0E0E0',
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
            }}
          >
            <Stack justify="space-between">
              <Group position="apart">
                <Title size="h4">Doctor statistics</Title>
                <Text>
                  {user?.firstName}
                  {user?.lastName}
                </Text>
              </Group>
              <Group position="apart">
                <Text size="h5">Time spent consulting:</Text>
                <Text fw="500" size="h5">
                  {individualConsultationTime ? timeSpent : undefinedTimeSpent}
                </Text>
              </Group>
              <Group position="apart">
                <Text>Rating</Text>
                <Rating value={user?.rating} readOnly />
              </Group>
              <Group>
                <Text>Your time and effort spent here helping people</Text>
              </Group>
              <Group />
            </Stack>
          </Box>
          <Skeleton
            height={SECONDARY_COL_HEIGHT}
            radius="md"
            animate={true}
            visible={!paySlip}
            p={16}
            sx={{ border: '1px solid #E0E0E0', background: 'white' }}
          >
            <PaySlipBoxItem paySlip={paySlip} />
          </Skeleton>
        </SimpleGrid>
      </SimpleGrid>
    </>
  )
}

export default Metrics
