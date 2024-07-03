import { Container, ContainerProps, Stack, Text, Title } from '@mantine/core'
import { IconBrowserOff } from '@tabler/icons-react'

export const NotSupported = (props: ContainerProps) => {
  return (
    <Container size="sm" {...props}>
      <Stack align="center" justify="center" mt="20rem">
        <IconBrowserOff size={64} />
        <Title order={4} mt="lg">
          Cannot access this page on mobile
        </Title>
        <Text size="sm" mt="md">
          Please use a desktop browser to access this page
        </Text>
      </Stack>
    </Container>
  )
}
