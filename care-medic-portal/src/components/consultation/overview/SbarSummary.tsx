import { useStateMachine } from 'little-state-machine'
import { useDisclosure } from '@mantine/hooks'
import { Box, Button, Drawer, Group } from '@mantine/core'
import { Diagnosis } from './Diagnosis'
import { TitleDescription } from '../../core/title-description'
import { capitalize } from '@utils/helpers'

export const SbarSummary = () => {
  const { state } = useStateMachine()
  const [opened, { close, open }] = useDisclosure(false)
  return (
    <Box>
      {Object.keys(state.sbar).map((key) => {
        return (
          <TitleDescription
            key={key}
            title={capitalize(key)}
            description={state.sbar[key]}
          />
        )
      })}
      <Group position="right" mt={5}>
        <Button color="teal" variant="light" onClick={open} right={20}>
          {' '}
          Edit Diagnosis
        </Button>
      </Group>
      <Drawer
        opened={opened}
        onClose={close}
        withOverlay={false}
        withinPortal={true}
        title="Diagnosis"
        position="right"
      >
        <Diagnosis close={close} />
      </Drawer>
    </Box>
  )
}
