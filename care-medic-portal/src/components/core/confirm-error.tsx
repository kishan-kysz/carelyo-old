import { Button, Stack, Text } from '@mantine/core'

type ErrorWithActionProps = {
  error: string
  action: () => void
  actionText?: string
}
export const ConfirmError = ({
  error,
  action,
  actionText,
}: ErrorWithActionProps) => {
  return (
    <Stack>
      <Text size="lg" color="dark.5">
        {error}
      </Text>
      <Button color="yellow" variant="subtle" onClick={action}>
        {actionText || ' Try again'}{' '}
      </Button>
    </Stack>
  )
}
