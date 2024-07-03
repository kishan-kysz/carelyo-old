import { Box, Textarea } from '@mantine/core'
import { useCallback, useState } from 'react'
import { useStateMachine } from 'little-state-machine'

const MAX_LENGTH = 1000

export default function Notes({
  handleNotes,
}: {
  handleNotes: (value: string) => void
}) {
  const { state } = useStateMachine()
  const [error, setError] = useState('')

  const saveNotes = useCallback(
    async (value) => {
      if (value.length > MAX_LENGTH) {
        return setError(`Diagnosis can't be more than ${MAX_LENGTH} characters`)
      }
      handleNotes(value)
      setError('')
    },
    [handleNotes],
  )

  return (
    <Box>
      <Textarea
        autosize
        minRows={4}
        maxRows={6}
        defaultValue={state?.sbar.notes}
        label="Doctor Confidential Notes"
        placeholder="Enter your confidential notes here"
        sx={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
        error={error && error}
        onChange={(e) => saveNotes(e.currentTarget.value)}
      />
    </Box>
  )
}
