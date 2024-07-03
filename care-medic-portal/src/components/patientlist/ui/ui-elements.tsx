import {
  Box,
  Flex,
  Text,
  Title,
  Tooltip,
  createStyles,
  useMantineTheme,
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

interface IPropsFancyInformationDisplay {
  icon?: JSX.Element
  content: string | number
}

interface IPropsTitleWithInfo {
  title: string
  label: string
}

const FancyInformationDisplay = ({
  icon,
  content,
}: IPropsFancyInformationDisplay) => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  return (
    <Flex
      align="center"
      gap={theme.spacing.xs}
      py={theme.spacing.sm}
      className={classes.border}
    >
      {icon}
      <Text size={14}>{content}</Text>
    </Flex>
  )
}

const TitleWithInfo = ({ title, label }: IPropsTitleWithInfo) => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  return (
    <Flex justify="space-between" align="center">
      <Title mb="sm" order={4}>
        {title}
      </Title>

      <Tooltip
        className={classes.pointerOnHover}
        color="teal"
        label={label}
        position="top-start"
      >
        <Box>
          <IconInfoCircle color={theme.colors.teal[6]} width={24} height={24} />
        </Box>
      </Tooltip>
    </Flex>
  )
}

const useStyles = createStyles((theme) => ({
  pointerOnHover: {
    cursor: 'pointer',
  },
  border: {
    borderBottom: `2px solid ${theme.colors.teal[6]} `,
  },
}))

export { FancyInformationDisplay, TitleWithInfo }
