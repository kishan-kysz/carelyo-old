import {
  ActionIcon,
  Group,
  Paper,
  PaperProps,
  SimpleGrid,
  Text,
} from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'

export default function ItemDetail({
  title,
  value,
  props,
  completed,
  withIcon = false,
  color,
}: {
  title: string
  value: string
  props?: PaperProps
  completed?: boolean
  withIcon?: boolean
  color?: string
}) {
  return (
    <Paper
      p="xs"
      radius={0}
      sx={(theme) => ({
        '&:not(:last-child)': {
          marginBottom: 'sm',
        },
        '&:nth-of-type(odd)': {
          backgroundColor: theme.colors.gray[2],
        },
      })}
      {...props}
    >
      <SimpleGrid cols={2}>
        <Group>
          <Text color="dimmed">{title}</Text>
          {withIcon ? (
            completed ? (
              <ActionIcon color="green">
                {' '}
                <IconCheck />
              </ActionIcon>
            ) : (
              <ActionIcon color="red">
                {' '}
                <IconX />
              </ActionIcon>
            )
          ) : null}
        </Group>
        <Text color={color}>{value}</Text>
      </SimpleGrid>
    </Paper>
  )
}
