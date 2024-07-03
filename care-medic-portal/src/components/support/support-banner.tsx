import { createStyles, Group, Stack, Text, Title } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: `calc(${theme.spacing.xl} * 2)`,
  },
  body: {
    width: '70%',
  },
  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },
}))

export const SupportBanner = ({ name }: { name: string }) => {
  const { classes } = useStyles()
  return (
    <Group position="apart" py="xl">
      <Stack spacing={0}>
        <Title className={classes.title}>Support Center</Title>
        <Text fw={500} fz="xl" mb={5}>
          Hello {name},{' '}
        </Text>
        <Text color="dimmed">Welcome to Carelyo Support Center.</Text>
      </Stack>
    </Group>
  )
}
