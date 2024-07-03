import { Stack, Text } from '@mantine/core'

export const TitleDescription = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <Stack
      p="xs"
      spacing={0}
      sx={(theme) => ({
        radius: theme.radius.md,
        '&:not(:last-child)': {
          marginBottom: 'sm',
        },
        '&:nth-of-type(odd)': {
          backgroundColor: theme.colors.gray[2],
        },
      })}
    >
      <Text color="dark.4">{title}</Text>
      <Text size="sm" color="dark.2" p={5}>
        {description}
      </Text>
    </Stack>
  )
}
