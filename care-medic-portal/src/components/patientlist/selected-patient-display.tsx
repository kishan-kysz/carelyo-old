import useLabs from '@hooks/use-labs'
import {
  Avatar,
  Box,
  Card,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  Title,
  createStyles,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { IPatients } from '@types'
import { IconMail, IconPhone } from '@tabler/icons-react'
import { FancyInformationDisplay, TitleWithInfo } from './ui/ui-elements'
import usePrescriptions from '@hooks/use-prescriptions'
import PatientMessageForm from './forms/patient-message-form'
import useProfile from '@hooks/use-profile'

//the should see all history, prescrition, lab, medical history, name, age, basically all that they see now

const SelectedPatientDisplay = ({
  selectedPatient,
}: {
  selectedPatient: IPatients
}) => {
  const { userLabs, loadingUserLabs } = useLabs({
    patientId: selectedPatient?.userId,
  })
  const { patientPrescriptions, loadingPrescriptions } = usePrescriptions(
    selectedPatient?.userId,
  )
  const { user } = useProfile()
  const formObject = {
    userId: selectedPatient?.userId,
    sender: `${user?.firstName} ${user?.lastName}`,
  }
  const theme = useMantineTheme()
  const { classes } = useStyles()

  // Break out tabs etc
  return (
    selectedPatient && (
      <Paper
        radius="md"
        h="100%"
        shadow="0px 0px 5px #c7c7c7"
        bg="white"
        p={16}
      >
        <Box py={16}>
          <Group>
            <Avatar color="teal" radius="xl" size="xl" />
            <Stack spacing={0} justify="space-between">
              <Title order={2}>
                {selectedPatient.firstName} {selectedPatient.surName}
              </Title>
            </Stack>
          </Group>
        </Box>
        <Box>
          <Title my={theme.spacing.sm} order={4}>
            Contact information
          </Title>

          <FancyInformationDisplay
            icon={<IconMail size={20} />}
            content={selectedPatient.email}
          />
          <FancyInformationDisplay
            icon={<IconPhone size={20} />}
            content={selectedPatient.mobile}
          />
        </Box>
        <Tabs
          classNames={{ tabLabel: classes.tab }}
          mt={theme.spacing.lg}
          defaultValue="labs"
        >
          <Tabs.List>
            <Tabs.Tab value="labs">Labs</Tabs.Tab>
            <Tabs.Tab value="prescriptions">Prescriptions</Tabs.Tab>
            <Tabs.Tab value="message">Message</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel py={theme.spacing.md} value="labs">
            <TitleWithInfo
              title="Labs"
              label="View previous labs for patient"
            />
            {loadingUserLabs ? (
              <Loader size="xl" />
            ) : (
              <ScrollArea h={rem(425)}>
                {userLabs.length > 0 ? (
                  <Stack py="xs" spacing="md" px="sm">
                    {userLabs.map((item) => (
                      <Card key={item.id} padding="sm" radius="md" shadow="xl">
                        <Card.Section bg={theme.colors.teal[6]} p={8} />
                        <Title order={5} mt="xs">
                          Test for {item.patientName}
                        </Title>
                        <Text>Issued by : Dr {item.doctorName}</Text>
                        <Text>Reason: {item.reason}</Text>
                        <Text>Test: {item.test}</Text>
                        <Text>Created at: {item.createdAt.slice(0, 10)}</Text>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Text>No data found! Please try again</Text>
                )}
              </ScrollArea>
            )}
          </Tabs.Panel>
          <Tabs.Panel py={theme.spacing.md} value="prescriptions">
            <TitleWithInfo
              title="Prescriptions"
              label="View previous patient prescriptions"
            />
            {loadingPrescriptions ? ( // We might need to refactor this and the other card component a little bit as i am not entierly happy with how it looks both on the page and here.
              <Loader size="xl" />
            ) : (
              <ScrollArea h={rem(425)}>
                {patientPrescriptions.length > 0 ? (
                  <Stack py="xs" spacing="md" px="sm">
                    {patientPrescriptions.map((item) => (
                      <Card shadow="xl" key={item.id}>
                        <Card.Section bg={theme.colors.teal[6]} p={8} />
                        <Title order={5} mt="sm">
                          Prescription for {selectedPatient.firstName}{' '}
                          {selectedPatient.surName}
                        </Title>
                        <Text>Issued by: {item.issuerName}</Text>
                        <Text>Illness: {item.illness}</Text>
                        <Text>Medcation name: {item.medicationName}</Text>
                        <Text>Medication type: {item.medicationType}</Text>
                        <Text>
                          Issued on:{' '}
                          {item.issueDate.toLocaleString().slice(0, 10)}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Text>No data found! Please try again</Text>
                )}
              </ScrollArea>
            )}
          </Tabs.Panel>

          <Tabs.Panel py={theme.spacing.md} value="message">
            <TitleWithInfo
              title="Patient message"
              label="Send a message to a patient"
            />
            <PatientMessageForm formObject={formObject} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    )
  )
}

const useStyles = createStyles((theme) => ({
  shadow: {
    boxShadow: '0px 0px 5px #c7c7c7',
  },
  input: {
    height: 125,
    border: '2px solid #e0e0e0',
  },
  borderForInput: {
    border: '2px solid #e0e0e0',
  },
  formClass: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  tab: {
    textDecorationColor: theme.colors.teal[5],
  },
}))

export default SelectedPatientDisplay
