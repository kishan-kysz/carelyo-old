import usePayout from '@hooks/use-payout'
import {
  Button,
  createStyles,
  Group,
  Loader,
  Modal,
  Paper,
  rem,
  Select,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconInfoCircle } from '@tabler/icons-react'
import { IWallet } from '@types'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const BankSettings = ({ wallet }: { wallet: IWallet }) => {
  const theme = useMantineTheme()
  const { bankData, addBankDetails, addBanksLoading } = usePayout()
  const [bankAccountExists, setBankAccountExists] = useState(false)
  const [toggle, { open, close }] = useDisclosure()
  useEffect(() => {
    if (wallet?.externalAccount && wallet?.bankCode) {
      setBankAccountExists(true)
    } else {
      setBankAccountExists(false)
    }
  }, [wallet])

  const formattedBank = useMemo(() => {
    return bankData?.map((item) => {
      return { label: item.name, value: item.code }
    })
  }, [bankData])

  const form = useForm({
    initialValues: {
      accountNo: '',
      bankCode: '',
    },
    validate: {
      accountNo: (value: string) => (!value ? 'Invalid routing code' : null),
      bankCode: (value: string) => (!value ? 'Invalid account number' : null),
    },
  })

  const { classes } = useStyles()
  return bankData ? (
    <>
      {bankAccountExists ? (
        <>
          <Paper p="sm" withBorder={true}>
            <Title my={theme.spacing.sm} color="gray" order={4}>
              Bank account information
            </Title>
            <TextInput
              my={theme.spacing.sm}
              readOnly
              type="password"
              label="Bank code"
              value={wallet.bankCode}
            />
            <TextInput
              my={theme.spacing.sm}
              readOnly
              type="password"
              label="Bank code"
              value={wallet.externalAccount}
            />
            <Group position="apart">
              <Button disabled type="button" my={theme.spacing.sm}>
                Change bank details
              </Button>
              <Modal
                title="Bank details information"
                onClose={close}
                opened={toggle}
                p={theme.spacing.sm}
              >
                <Text>
                  Because of security risks please contact support{' '}
                  <Link
                    className={classes.link}
                    color={theme.colors.teal[2]}
                    href="/support"
                  >
                    here
                  </Link>{' '}
                  if you wish to change or delete your bank details.
                </Text>
              </Modal>
              <IconInfoCircle
                onClick={open}
                cursor="pointer"
                size={36}
                color={theme.colors.teal[9]}
              />
            </Group>
          </Paper>
        </>
      ) : (
        <>
          <form
            onSubmit={form.onSubmit((values) => {
              addBankDetails(values)
            })}
            className={classes.bankInformation}
          >
            <Title my={theme.spacing.sm} color="gray" order={4}>
              Bank account information
            </Title>
            <Select
              my={theme.spacing.sm}
              transitionProps={{
                transition: 'fade',
                duration: 80,
                timingFunction: 'ease',
              }}
              clearable
              label="Bank provider"
              placeholder="-- Select bank --"
              {...form.getInputProps('bankCode')}
              data={formattedBank}
            />
            {form.values.bankCode && (
              <TextInput
                label="Routing code"
                readOnly
                value={form.values.bankCode}
              />
            )}

            <TextInput
              placeholder="-- Enter account number -- "
              my={theme.spacing.sm}
              label="Account number"
              size="sm"
              {...form.getInputProps('accountNo')}
            />
            <Button
              loading={addBanksLoading}
              type="submit"
              my={theme.spacing.sm}
            >
              Save information
            </Button>
          </form>{' '}
        </>
      )}
    </>
  ) : (
    <Loader size="xl" />
  )
}
export default BankSettings
const useStyles = createStyles((theme) => ({
  bankInformation: {
    background: 'white',
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    border: '1px solid #E0E0E0',
  },
  link: {
    color: theme.colors.teal[9],
  },
}))
