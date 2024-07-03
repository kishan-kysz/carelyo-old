import { useRouter } from 'next/router'
import {
  ActionIcon,
  Badge,
  BadgeProps,
  createStyles,
  Group,
  SegmentedControl,
  Title,
} from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'

const useStyles = createStyles(() => ({
  header: {
    display: ' flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: ' 1px solid rgba(0 0 0 / 20%)',
    paddingBottom: 8,
  },
}))
export const DashboardHeader = ({
  title,
  path,
  rightBadge,
  badgeProps,
  handleFilter,
  consultation = false,
  defaultValue,
}: {
  title: string
  path?: string
  rightBadge?: string
  badgeProps?: BadgeProps
  handleFilter?: (val: string) => void
  consultation?: boolean
  defaultValue?: string
}) => {
  const { classes } = useStyles()
  const router = useRouter()
  return (
    <Group className={classes.header}>
      <Title order={4} color="gray">
        {title}
      </Title>
      {path ? (
        <ActionIcon onClick={() => router.push(path)}>
          <IconExternalLink
            size={28}
            style={{ cursor: 'pointer', marginRight: '0.1rem' }}
          />
        </ActionIcon>
      ) : null}
      {rightBadge && !path && <Badge {...badgeProps}>{rightBadge}</Badge>}
      {consultation && defaultValue && (
        <SegmentedControl
          defaultValue={defaultValue}
          color="#10751c"
          data={[
            { value: 'VIRTUAL', label: 'Virtual' },
            { value: 'PHYSICAL', label: 'Physical' },
          ]}
          onChange={handleFilter}
        />
      )}
    </Group>
  )
}
