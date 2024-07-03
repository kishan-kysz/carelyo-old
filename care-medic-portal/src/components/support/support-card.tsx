import {
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { ReactNode } from 'react'
import { DefaultMantineColor } from '@mantine/styles/lib/theme/types/MantineColor'
import { useHover } from '@mantine/hooks'

interface SupportCardProps {
  title: string
  description: ReactNode
  icon: ReactNode
  btnColor?: DefaultMantineColor
  btnText?: string
  action: () => void
}

export const SupportCard = ({
  title,
  description,
  icon,
  action,
  btnColor,
  btnText,
}: SupportCardProps) => {
  const { ref, hovered } = useHover()
  return (
    <Card
      shadow="sm"
      ref={ref}
      p="md"
      radius="md"
      onClick={action}
      sx={(theme) => ({
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          backgroundColor: theme.colors.gray[1],
          boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)',
        },
      })}
    >
      <Stack spacing="md">
        <Group>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon
              color={btnColor || 'blue'}
              size="lg"
              variant="light"
              style={{ marginRight: 10, fontSize: 30 }}
            >
              {icon}
            </ThemeIcon>
            <Text weight={700} size="lg">
              {title}
            </Text>
          </div>
          {hovered ? (
            <Text size="sm" color="gray">
              {btnText || 'Learn more'}
            </Text>
          ) : null}
        </Group>
        <Divider />
        <Box mt="md" p="md">
          <Text color="dimmed">{description}</Text>
        </Box>
      </Stack>
    </Card>
  )
}
