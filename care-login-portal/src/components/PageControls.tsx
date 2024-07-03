import {
  Anchor,
  Button,
  Center,
  createStyles,
  Group,
  Text
} from '@mantine/core'
import { BsArrowLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse'
    }
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center'
    }
  }
}))

const PageControls = ({ isLoading }: { isLoading: boolean }) => {
  const { t, ready } = useTranslation(['default'])
  if (!ready) {
    return
  }
  const { classes } = useStyles()
  return (
    <Group position='apart' mt='lg' className={classes.controls}>
      <Text color='dimmed' size='sm' className={classes.control}>
        <Center inline={true}>
          <BsArrowLeft size={15} />
          <Anchor ml={5} component={Link} to={'/'}>
            {t('PageControls-back')}
          </Anchor>
        </Center>
      </Text>
      <Button loading={isLoading} className={classes.control} type='submit'>
        {t('PageControls-Reset-Pass')}
      </Button>
    </Group>
  )
}

export default PageControls
