import {
  Autocomplete,
  Box,
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import {
  createPrescriptionMutation,
  deletePrescriptionRequest,
  editPrescriptionRequest,
} from '@routes'
import { createPrescription, IPrescription } from '@types'
import isEqual from '../../../utils/isEqual'
import { HandleCurrent } from '../current/HandleCurrent'
import drugList from '../../../assets/drugList.json'
import { IconSearch } from '@tabler/icons-react'
import { DatePickerInput } from '@mantine/dates'

const PrescriptionForm = ({
  func,
  defaultData,
  type = 'create',
  isLoading,
}: {
  func: (data: IPrescription) => Promise<void>
  defaultData?: IPrescription
  type?: 'create' | 'edit'
  isLoading?: boolean
}) => {
  const [medicines] = useState(drugList)
  const numberOptions = [...Array(100)].map((_, index) => `${index + 1}`)
  const [medName, setMedName] = useState('')
  const [strengths, setStrengths] = useState([])
  const [dosageForm, setDosageForm] = useState([])

  const drugNames = useMemo(() => {
    return medicines?.map((item) => {
      return item['NAME OF DRUG']
    })
  }, [medicines])

  useEffect(() => {
    if (medName) {
      const strengthList = medicines?.reduce((res, curr) => {
        if (medName === curr['NAME OF DRUG']) {
          res.push(curr['STRENGTHS'])
        }
        return res
      }, [])
      setStrengths(strengthList)
    }
  }, [medName, medicines])

  useEffect(() => {
    if (medName) {
      const dosageFormList = medicines.reduce((res, curr) => {
        if (medName === curr['NAME OF DRUG']) {
          res.push(curr['DOSAGE FORM'])
        }
        return res
      }, [])
      setDosageForm(dosageFormList)
    }
  }, [medName, medicines])

  const form = useForm({
    initialValues: {
      ...defaultData,
    },
    validate: zodResolver(createPrescription),
  })
  const handleSubmit = async (data: IPrescription) => {
    await func(data)
    form.reset()
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <SimpleGrid my={16} cols={2}>
          {drugNames && (
            <Autocomplete
              icon={<IconSearch />}
              data={drugNames}
              description="Name of the medication"
              onChange={(e) => {
                form.setFieldValue('medicationName', e)
                setMedName(e)
              }}
              label="Medication Name"
              placeholder="Search medicine"
              limit={25}
            />
          )}

          <Select
            data={numberOptions}
            description="Dosage of the medication"
            {...form.getInputProps('dosage')}
            label="Dosage"
            placeholder="Select dosage"
          />
          <Select
            data={numberOptions}
            description="Frequency of the medication"
            {...form.getInputProps('frequency')}
            label="Frequency"
            placeholder="Frequency of medication"
          />

          <Select
            data={numberOptions}
            description="Quantity of the medication"
            {...form.getInputProps('quantity')}
            label="Quantity"
            placeholder="Select quantity"
          />
          <DatePickerInput
            type="range"
            description="Duration of the medication"
            // {...form.getInputProps("treatmentDuration")}
            onChange={(e) => {
              form.setFieldValue('treatmentDuration', e.toString())
            }}
            label="Treatment Duration"
            placeholder="Select timespan of duration"
          />

          <Select
            placeholder="Strength"
            data={strengths}
            description="Strength of the medication"
            {...form.getInputProps('medicationStrength')}
            label="Medication Strength"
          />
          <Select
            data={dosageForm}
            description="Type of the medication"
            {...form.getInputProps('medicationType')}
            label="Dosage Form"
            placeholder="Select medication type"
          />
          <TextInput
            description="Illness the medication is for"
            {...form.getInputProps('illness')}
            label="Illness"
          />
        </SimpleGrid>
        <Group position="right">
          <Button type="submit" color="#10751c" loading={isLoading}>
            {type === 'create' ? 'Create Prescription' : 'Save'}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
export default function HandlePrescription({
  id,
  prescriptions,
}: {
  id: number
  prescriptions: IPrescription[]
}) {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading } = useMutation(createPrescriptionMutation, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['acceptedConsultation'])
      showNotification({
        title: 'Success!',
        message: 'Prescription created successfully',
      })
    },
    onError: (error: AxiosError) => {
      showNotification({
        title: 'Error!',
        message:
          // @ts-expect-error error has type of unknown.
          error.response.data.errors[0].message || 'Something went wrong',
        color: 'red',
      })
    },
  })
  const { mutateAsync: edit, isLoading: isLoadingEdit } = useMutation(
    ['editPrescription'],
    editPrescriptionRequest,
    {
      onSuccess: (data) => {
        {
          showNotification({
            title: 'Success!',
            message: data.message,
          })
        }
      },
      onError: (error: AxiosError) => {
        showNotification({
          title: 'Error!',
          message:
            // @ts-ignore
            error.response.data.errors[0].message || 'Something went wrong',
          color: 'red',
        })
      },
      onSettled: () => {
        queryClient
          .invalidateQueries(['acceptedConsultation'])
          .then(() => close())
      },
    },
  )
  const { mutateAsync: deletePrescription } = useMutation(
    ['deletePrescription'],
    deletePrescriptionRequest,
    {
      onSuccess: (data) => {
        showNotification({
          title: 'Success!',
          message: data.message,
        })
      },
      onError: (error: AxiosError) => {
        showNotification({
          title: 'Error!',
          message:
            // @ts-expect-error error has type of unknown.
            error.response.data.errors[0].message || 'Something went wrong',
          color: 'red',
        })
      },
      onSettled: async () => {
        await queryClient
          .invalidateQueries(['acceptedConsultation'])
          .then(() => handleDelete.close())
      },
    },
  )
  const [prescription, setPrescription] = useState<IPrescription>()
  const [editModalOpen, { close, open }] = useDisclosure(false)
  const [deleteModal, handleDelete] = useDisclosure(false)
  const handleSubmit = async (data: IPrescription) => {
    const requestData = { ...data, consultationId: id }
    await mutateAsync(requestData)
  }
  const handleEditSubmit = async (data: IPrescription) => {
    if (isEqual(prescription, data)) {
      return close()
    }
    close()
    await edit(data)
  }
  const handleSelectEdit = (prescription: IPrescription) => {
    setPrescription(prescription)
    open()
  }
  const handleSelectDelete = (prescription: IPrescription) => {
    setPrescription(prescription)
    handleDelete.open()
  }

  return (
    <Box>
      <HandleCurrent
        data={prescriptions}
        handleSelectEdit={handleSelectEdit}
        handleSelectDelete={handleSelectDelete}
        isLoading={isLoadingEdit}
        type="prescriptions"
      />
      <PrescriptionForm func={handleSubmit} />
      <Modal
        opened={editModalOpen}
        onClose={close}
        centered={true}
        title="Edit Prescription request"
      >
        <PrescriptionForm
          func={handleEditSubmit}
          defaultData={prescription}
          type="edit"
        />
      </Modal>
      <Modal
        opened={deleteModal}
        onClose={handleDelete.close}
        centered={true}
        title="Delete Prescription request"
      >
        <Text>Are you sure you want to delete this prescription?</Text>
        <Text>{prescription?.medicationName}</Text>
        <Group position="right" mt="md">
          <Button
            size="xs"
            color="blue"
            loading={isLoading}
            onClick={handleDelete.close}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={async () => {
              await deletePrescription({ id: prescription?.id })
              handleDelete.close()
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Box>
  )
}
