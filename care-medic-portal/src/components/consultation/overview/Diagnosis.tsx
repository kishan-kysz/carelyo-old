import { useForm, zodResolver } from '@mantine/form'
import { Button, Group, Stack, Textarea } from '@mantine/core'
import Notes from './Notes'
import { useIcd10 } from '@hooks/useIcd10'
import { useStateMachine } from 'little-state-machine'
import { setSbar } from '@utils/actions'
import { z } from 'zod'
import Icd10Search from '@components/core/icd10-search'
import { cd10 } from '@prisma/client'
import { useState } from 'react'

const DiagnosisSchema = z.object({
  situation: z.string().max(1500),
  background: z.string().max(1500),
  assessment: z.string().max(1500),
  diagnosis: z.string().max(1500),
  notes: z.string().max(1500),
  recommendation: z.string().max(1500),
})
export const Diagnosis = ({ close }: { close?: () => void }) => {
  const { state, actions } = useStateMachine({
    setSbar,
  })
  const { getInputProps, setValues, onSubmit, setFieldValue } = useForm<
    z.infer<typeof DiagnosisSchema>
  >({
    initialValues: {
      situation: state.sbar.situation,
      background: state.sbar.background,
      assessment: state.sbar.assessment,
      diagnosis: state.sbar.diagnosis,
      notes: state.sbar.notes,
      recommendation: state.sbar.recommendation,
    },
    validate: zodResolver(DiagnosisSchema),
  })
  const handleSubmit = (values) => {
    actions.setSbar(values)
    if (close) {
      close()
    }
  }
  const handleNotes = (value) => {
    setValues({ notes: value })
  }
  const handleDiagnosis = (value) => {
    const currentDiagnosis = getInputProps('diagnosis').value
    setValues({
      diagnosis: `${currentDiagnosis} ${
        currentDiagnosis.length > 1 ? '\n' : ''
      } ${value}`,
    })
  }
  const { SearchIcd10 } = useIcd10(handleDiagnosis)
  const [selected, setSelected] = useState<cd10[]>([])
  const handleSelectIcd10 = (val: cd10) => {
    setSelected([...selected, val])
  }

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack
        spacing={4}
        style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px' }}
      >
        <Textarea
          label="Situation"
          {...getInputProps('situation')}
          placeholder="Presenting complaint"
          onChange={(e) => {
            setFieldValue('situation', e.currentTarget.value)
          }}
        />
        <Textarea
          label="Background"
          {...getInputProps('background')}
          placeholder="History of presenting complaints"
          onChange={(e) => {
            setFieldValue('background', e.currentTarget.value)
          }}
        />
        <Textarea
          label="Assessment"
          {...getInputProps('assessment')}
          placeholder="Your assessment of the presented complaints"
          onChange={(e) => {
            setFieldValue('assessment', e.currentTarget.value)
          }}
        />
        <Icd10Search
          selected={selected}
          setSelected={setSelected}
          handleDiagnosis={handleDiagnosis}
        />
        <Textarea
          label="Diagnosis"
          {...getInputProps('diagnosis')}
          placeholder="Your diagnosis for the presented complaints"
          onChange={(e) => {
            setFieldValue('diagnosis', e.currentTarget.value)
          }}
        />{' '}
        <Notes handleNotes={handleNotes} />
        <Textarea
          label="Recommendation"
          {...getInputProps('recommendation')}
          placeholder="Your recommendation for the presented complaints"
          onChange={(e) => {
            setFieldValue('recommendation', e.currentTarget.value)
          }}
        />
        <Group position="right" mt={10}>
          <Button
            variant="filled"
            color="teal"
            type="submit"
            size="md"
            sx={{
              color: 'white',
            }}
          >
            Mark As Done
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
