import {
  Avatar,
  Box,
  Flex,
  Text,
  Title,
  Transition,
  createStyles,
} from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IPatients } from '@types'
import { IconChevronRight } from '@tabler/icons-react'
import { Dispatch, SetStateAction } from 'react'
const PatientCard = ({
  patient,
  setId,
  selectedPatientId,
}: {
  patient: IPatients
  setId: Dispatch<SetStateAction<number>>
  selectedPatientId: number
}) => {
  const { hovered, ref } = useHover()
  const { classes, cx } = useStyles()
  return (
    <Box
      component="article"
      ref={ref}
      className={cx(
        classes.patientCard,
        { [classes.active]: hovered === true },
        { [classes.active]: selectedPatientId === patient.userId },
      )}
      onClick={() => {
        setId(patient.userId)
      }}
    >
      <Avatar radius="xl" size="lg" />
      <Flex justify="center" align="flex-start" direction="column">
        <Title order={5}>
          {patient.firstName} {patient.surName}
        </Title>
        <Text size="xs" color="gray">
          {patient.email}
        </Text>
      </Flex>
      <Transition
        transition="fade"
        duration={325}
        timingFunction="ease"
        mounted={hovered || selectedPatientId === patient.userId}
      >
        {(styles) => (
          <Box style={{ ...styles, alignSelf: 'center' }} ml="auto">
            <IconChevronRight fontWeight="small" size={28} />
          </Box>
        )}
      </Transition>
    </Box>
  )
}

const useStyles = createStyles((theme) => ({
  patientCard: {
    padding: theme.spacing.md,
    cursor: 'pointer',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    display: 'flex',
    gap: theme.spacing.md,
    borderRadius: theme.radius.md,
    border: '1px solid #e0e0e0',
    transition: 'all 325ms ease ',
    '&:hover': {
      background: theme.colors.teal[1],
      borderColor: theme.colors.teal[1],
    },
  },
  active: {
    background: theme.colors.teal[1],
    borderColor: theme.colors.teal[1],
  },
}))

export default PatientCard
