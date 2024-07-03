import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconCircleX } from '@tabler/icons-react'
import { AiOutlineEnter } from 'react-icons/ai'
import { capitalize } from '@utils/helpers'

interface SymptomsStore {
  type: 'Symptom' | 'relatedSymptom'
  value: string
}

const MappedSymptoms = ({ Symptom, deleteSymptom }) => {
  return (
    <Box
      key={Symptom.value}
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[2],
        borderRadius: theme.radius.sm,
        padding: theme.spacing.xs,
        color: theme.colors.dark[9],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${theme.colors.dark[2]}`,
        width: '100%',
        '&:hover': {
          backgroundColor: theme.colors.dark[2],
        },
      })}
    >
      <Text>{capitalize(Symptom.value)}</Text>
      <ActionIcon
        onClick={() => deleteSymptom(Symptom.value)}
        color="red"
        variant="light"
        size="sm"
      >
        <IconCircleX />
      </ActionIcon>
    </Box>
  )
}
const Form = ({
  withHeader,
  SymptomsList,
  handleSaveSymptom,
  SymptomsCount,
  RSymptomsCount,
  toggle,
}: {
  withHeader?: boolean
  SymptomsList: SymptomsStore[]
  handleSaveSymptom: (data: { Symptom: string; relatedSymptom: string }) => void
  SymptomsCount: number
  RSymptomsCount: number
  toggle?: () => void
}) => {
  const { onSubmit, getInputProps, values, reset } = useForm<{
    Symptom: string
    relatedSymptom: string
  }>({
    initialValues: {
      Symptom: '',
      relatedSymptom: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!(values.Symptom || values.relatedSymptom)) {
        errors.Symptom = 'Symptom is required'
      }

      if (values.Symptom === values.relatedSymptom) {
        errors.relatedSymptom = "Symptom and Related Symptom can't be same"
      }
      if (
        SymptomsList.filter((s) => s.type === 'Symptom').filter(
          (s) => s.value === values.Symptom.toLowerCase(),
        ).length > 0
      ) {
        errors.Symptom = 'Symptom already exists'
      }
      if (
        SymptomsList.filter((s) => s.type === 'relatedSymptom').filter(
          (s) => s.value === values.relatedSymptom.toLowerCase(),
        ).length > 0
      ) {
        errors.relatedSymptom = 'Related Symptom already exists'
      }
      if (
        SymptomsList.filter((s) => s.type === 'Symptom').length > 4 &&
        values.Symptom.length > 1
      ) {
        errors.Symptom = "Symptom can't be more than 5"
      }
      if (
        SymptomsList.filter((s) => s.type === 'relatedSymptom').length > 4 &&
        values.relatedSymptom.length > 1
      ) {
        errors.relatedSymptom = "Related Symptom can't be more than 5"
      }
      if (values.Symptom.length > 100) {
        errors.Symptom = "Symptom can't be more than 100 characters"
      }
      if (values.relatedSymptom.length > 100) {
        errors.relatedSymptom =
          "Related Symptom can't be more than 100 characters"
      }
      if (
        values.relatedSymptom.length > 1 &&
        values.relatedSymptom.length < 3
      ) {
        errors.relatedSymptom =
          "Related Symptom can't be less than 3 characters"
      }
      if (
        SymptomsList.filter((s) => s.value === values.Symptom.toLowerCase())
          .length >= 1 ||
        SymptomsList.filter(
          (s) => s.value === values.relatedSymptom.toLowerCase(),
        ).length >= 1
      ) {
        errors.Symptom = 'Symptom already exists'
        errors.relatedSymptom = 'Related Symptom already exists'
      }
      return errors
    },
  })
  const handleSubmit = (data) => {
    handleSaveSymptom(data)
    reset()
  }

  return (
    <form
      style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px' }}
      onSubmit={onSubmit((data) => {
        handleSubmit(data)
      })}
    >
      {withHeader && (
        <Stack spacing={0}>
          <Text>
            Document the symptoms and corresponding related symptoms of patient
            complaints
          </Text>
          <Text color="dimmed" size="sm" mb="xs">
            Use Manage Symptoms if you need to delete or make changes
          </Text>
        </Stack>
      )}
      <Stack spacing={15}>
        <TextInput
          label={`Symptoms (${SymptomsCount}) *Write and press Enter to save*`}
          rightSection={
            <ActionIcon
              onClick={() => handleSubmit(values)}
              color="blue"
              variant="light"
              size="sm"
            >
              <AiOutlineEnter />
            </ActionIcon>
          }
          labelProps={{
            sx: {
              color: SymptomsCount > 4 ? 'red' : 'green',
            },
          }}
          {...getInputProps('Symptom', { withError: true })}
        />
        <TextInput
          label={`Related Symptoms (${RSymptomsCount}) *Write and press Enter to save*`}
          rightSection={
            <ActionIcon
              onClick={() => handleSubmit(values)}
              color="blue"
              variant="light"
              size="sm"
            >
              <AiOutlineEnter />
            </ActionIcon>
          }
          labelProps={{
            sx: {
              color: RSymptomsCount > 4 ? 'red' : 'green',
            },
          }}
          {...getInputProps('relatedSymptom', { withError: true })}
        />
        <Group my={5} position="right">
          {toggle ? (
            <Button onClick={toggle} color="#10751c">
              Edit Symptoms
            </Button>
          ) : undefined}
          <Button type="submit" color="#10751c">
            Mark As Done
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
type DiagnosisProps = {
  SymptomsList: SymptomsStore[]
  setSymptoms: (SymptomsStore) => void
}
export default function SymptomsHandler({
  SymptomsList,
  setSymptoms,
}: DiagnosisProps) {
  const handleSaveSymptom = (data: {
    Symptom: string
    relatedSymptom: string
  }) => {
    let syms = SymptomsList.filter((s) => s.type === 'Symptom')
    let relatedSyms = SymptomsList.filter((s) => s.type === 'relatedSymptom')
    if (data.Symptom) {
      syms.push({ type: 'Symptom', value: data.Symptom.toLowerCase() })
    }
    if (data.relatedSymptom) {
      relatedSyms.push({
        type: 'relatedSymptom',
        value: data.relatedSymptom.toLowerCase(),
      })
    }
    return setSymptoms([...syms, ...relatedSyms])
  }
  const deleteSymptom = (Symptom: string) => {
    return setSymptoms(SymptomsList.filter((s) => s.value !== Symptom))
  }

  const [opened, { close, toggle }] = useDisclosure(false)

  const SymptomOutput = SymptomsList.filter(
    (Symptom) => Symptom.type === 'Symptom',
  )
  const RelatedSymptomOutput = SymptomsList.filter(
    (Symptom) => Symptom.type === 'relatedSymptom',
  )

  return (
    <>
      <Form
        withHeader={true}
        RSymptomsCount={RelatedSymptomOutput.length}
        SymptomsList={SymptomsList}
        toggle={toggle}
        handleSaveSymptom={handleSaveSymptom}
        SymptomsCount={SymptomOutput.length}
      />

      <Modal opened={opened} onClose={close} centered={true}>
        <SimpleGrid cols={2} my={5}>
          <Stack>
            <Text color="dimmed">Symptoms</Text>
            {SymptomOutput.map((Symptom) =>
              MappedSymptoms({ Symptom, deleteSymptom }),
            )}
          </Stack>
          <Stack>
            <Text color="dimmed">Related Symptoms</Text>
            {RelatedSymptomOutput.map((Symptom) =>
              MappedSymptoms({ Symptom, deleteSymptom }),
            )}
          </Stack>
        </SimpleGrid>
        <Form
          RSymptomsCount={RelatedSymptomOutput.length}
          SymptomsList={SymptomsList}
          handleSaveSymptom={handleSaveSymptom}
          SymptomsCount={SymptomOutput.length}
        />
      </Modal>
    </>
  )
}
