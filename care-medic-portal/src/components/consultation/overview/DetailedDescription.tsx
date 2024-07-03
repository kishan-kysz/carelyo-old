import { Accordion, Text } from '@mantine/core'

export default function DetailedDescription({ text }) {
  return (
    <Accordion variant="contained" radius="xs">
      <Accordion.Item value="Detailed Description">
        <Accordion.Control>Read Patient&apos;s Complaints</Accordion.Control>
        <Accordion.Panel>{text}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
