import {
  ActionIcon,
  Box,
  Image,
  createStyles,
  useMantineTheme,
} from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IconFileUpload } from '@tabler/icons-react'
import { IconUser } from '@tabler/icons-react'
import { Fragment } from 'react'

const useStyles = createStyles((theme) => ({
  outerBox: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    opacity: 1,
    display: 'block',
    transition: '.5s ease',
    backfaceVisibility: 'hidden',
  },
  icon: {
    opacity: 1,
    position: 'absolute',
    bottom: 0,
    right: 5,
    zIndex: 10,
    transition: 'all linear 0.1s',
  },
  userIcon: {
    margin: '0 auto',
  },
}))
export default function ProfileImage({
  image,
  show,
}: {
  image?: string
  show: () => void
}) {
  const { classes } = useStyles()
  const { hovered, ref } = useHover()
  const theme = useMantineTheme()

  return (
    <Box m={'auto'} ref={ref} className={classes.outerBox}>
      {image ? (
        // <NextImage
        //   src={image}
        //   alt="Profile Picture"
        //   width={ref.current?.clientWidth || 200}
        //   height={200}
        //   className={classes.image}
        // />
        <>
          <Image
            src={image}
            alt="Profile picture"
            width={ref.current?.clientWidth || 200}
            height={200}
            className={classes.image}
          />
        </>
      ) : (
        <Box m={'2px auto'} w={'fit-content'}>
          <IconUser size={200} color={theme.colors.gray[5]} />
        </Box>
      )}

      <Fragment>
        {/* <Overlay opacity={0.1} blur={2} sx={{ zIndex: 1 }} /> */}
        <ActionIcon
          onClick={show}
          className={classes.icon}
          size="xl"
          color="teal"
          radius="xl"
        >
          <IconFileUpload color="teal" size={28} />
        </ActionIcon>
      </Fragment>
    </Box>
  )
}
