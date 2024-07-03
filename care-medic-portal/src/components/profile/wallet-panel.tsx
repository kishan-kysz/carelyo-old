import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Input,
  Paper,
  rem,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { ITransaction, IWallet } from '@types'
import { DataTable } from 'mantine-datatable'
import { useStatistics } from '@hooks/use-statistics'
import { formatCurrencyToLocal, utcToLocal } from '@utils/helpers'
import { IconSearch } from '@tabler/icons-react'
import BankSettings from './bank-settings'

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

const WalletPanel = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const theme = useMantineTheme()
  const pageSize = 15
  const [page, setPage] = useState(1)
  const { wallet, loadingWallet } = useStatistics()

  const [loadedWallet, setLoadedWallet] = useState<IWallet>()
  const [records, setRecords] = useState<ITransaction[]>()

  const from = (page - 1) * pageSize
  const to = from + pageSize
  useEffect(() => {
    if (!loadingWallet) {
      const sortedTransactions = [...wallet.transactions].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return Math.abs(dateA - dateB)
      })

      setLoadedWallet(wallet)
      setRecords(sortedTransactions.slice(from, to))
    }
  }, [wallet, loadingWallet, page, from, to])

  const handleFilterSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase()
    setSearchValue(val)

    if (val) {
      const filteredRecords = wallet?.transactions.filter((item) => {
        const itemId = String(item.id).toLowerCase()
        const itemType = item.type.toLowerCase()
        const createdAtString =
          typeof item.createdAt === 'string'
            ? item.createdAt
            : item.createdAt.toISOString() // or item.createdAt.toLocaleDateString()

        const formattedDate = formatForComparison(createdAtString).toLowerCase()

        return itemId === val || itemType === val || formattedDate.includes(val)
      })

      setRecords(filteredRecords)
    } else {
      setRecords(wallet?.transactions.slice(from, to))
    }
  }

  const formatForComparison = (createdAt: string): string => {
    const date = new Date(createdAt)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
  }

  const SHOW_BANK_DETAILS = process.env.NEXT_PUBLIC_PROVIDER_PAYSTACK !== 'true'
  return (
    <div>
      <Stack maw={1200}>
        <BigTitle>Wallet</BigTitle>
        <Paper maw={1200} withBorder={true} p="sm">
          <Grid>
            <Grid.Col span={SHOW_BANK_DETAILS ? 6 : 12}>
              <Stack align="center" spacing={0} my={rem(50)}>
                <Text color="dimmed">Current balance</Text>
                <Text
                  color={theme.primaryColor}
                  fw="bold"
                  size={rem(40)}
                  mt={rem(10)}
                >
                  {formatCurrencyToLocal(loadedWallet?.balance)}
                </Text>
              </Stack>
            </Grid.Col>
            {SHOW_BANK_DETAILS ? (
              <Grid.Col span={6}>
                <BankSettings wallet={wallet} />
              </Grid.Col>
            ) : null}
          </Grid>
        </Paper>
        <Input
          // Controlled input
          value={searchValue}
          onChange={handleFilterSearch}
          icon={<IconSearch />}
          placeholder="Search transactions"
        />
        <Box maw={1200}>
          <BigTitle>Transaction list</BigTitle>
          <DataTable
            fetching={loadingWallet}
            noRecordsText="Wallet history is empty"
            minHeight={500}
            striped
            borderRadius="sm"
            withColumnBorders
            highlightOnHover
            withBorder
            shadow="xs"
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            totalRecords={records?.length}
            columns={[
              {
                accessor: 'createdAt',
                title: 'Consultation Performed On',
                render: (item) => `${utcToLocal(item.reference)}`,
              },

              { accessor: 'id', title: 'Transaction ID' },
              {
                accessor: 'amount',
                title: 'Revenue',
                render: (item) => `${formatCurrencyToLocal(item.amount)}`,
              },

              // { accessor: "type", title: "Type" },
            ]}
            records={records}
          />
        </Box>
      </Stack>
    </div>
  )
}

export default WalletPanel
