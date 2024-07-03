import { Button, Group, Paper, Stack, Title } from '@mantine/core'
import ItemDetail from '../../core/item-detail'
import { IAcceptedConsultation } from '@types'
import useConsultation from '@hooks/use-consultation'
import { useStateMachine } from 'little-state-machine'
import { useState } from 'react'

type SummaryProps = {
  current: IAcceptedConsultation['currentConsultation']
  diagnosis: string
  symptoms: string[]
  relatedSymptoms: string[]
  consultationId: number
  reset?: () => void
  status: string
}
export default function Summary({
  current,
  diagnosis,
  symptoms,
  relatedSymptoms,
  consultationId,
  reset,
  status,
}: SummaryProps) {
  const canFinishConsultation =
    !!diagnosis && symptoms?.length >= 1 && relatedSymptoms?.length >= 1
  const { finish, finishLoading } = useConsultation()
  const { state } = useStateMachine()
  const [formSubmitted, setFormSubmitted] = useState(false) // Declare formSubmitted state
  const handleSubmit = async () => {
    await finish({
      id: consultationId,
      diagnosis,
      relatedSymptoms,
      symptoms,
      sbar: state.sbar,
    })
    reset()
    setFormSubmitted(true)
  }

  return (
    <Paper>
      {status === 'incomplete' ? (
        <Title order={2}>Summarize the incomplete consultation</Title>
      ) : (
        <Title order={2}>Summarize the consultation </Title>
      )}
      <Stack mt="md">
        <ItemDetail
          title="Follow Up"
          color="dimmed"
          value={
            current?.followUp ? 'Follow up has been booked' : 'No follow up'
          }
          completed={!!current?.followUp}
        />
        <ItemDetail
          color="dimmed"
          title="Labs"
          value={
            current.labs?.length >= 1
              ? `${current.labs?.length} lab records created`
              : 'No lab records'
          }
          completed={current.labs?.length >= 1}
        />
        <ItemDetail
          color="dimmed"
          title="Prescription"
          value={
            current.prescriptions?.length >= 1
              ? `${current.labs?.length} prescriptions created`
              : 'No prescriptions'
          }
          completed={current.prescriptions?.length >= 1}
        />
        <ItemDetail
          color={!diagnosis ? 'red' : ''}
          title="Diagnosis"
          value={
            diagnosis ? 'Your diagnosis has been saved' : 'Diagnosis is missing'
          }
          completed={!!diagnosis}
        />
        <ItemDetail
          color={symptoms.length < 1 ? 'red' : ''}
          title="Symptoms"
          value={
            symptoms?.length >= 1
              ? `${symptoms?.length} added`
              : 'No Symptoms added'
          }
          completed={symptoms.length >= 1}
        />
        <ItemDetail
          color={relatedSymptoms.length < 1 ? 'red' : ''}
          title="Related Symptoms"
          value={
            relatedSymptoms?.length >= 1
              ? `${relatedSymptoms?.length} added`
              : 'No related symptoms added'
          }
          completed={relatedSymptoms.length >= 1}
        />
        <Group position="right">
          <Button
            disabled={!canFinishConsultation}
            loading={finishLoading}
            onClick={handleSubmit}
          >
            Finish consultation
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}
