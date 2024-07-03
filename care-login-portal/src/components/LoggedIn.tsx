import { Anchor, Text, Avatar, Group, Stack } from '@mantine/core'
import useAuth from '../hooks/useAuth'
import Translation from './Translation'

const LoggedIn = () => {
  const { data } = useAuth()

  return (
    <Group p='md' position='center'>
      {data &&
        data.map(
          (item) =>
            item.id && (
              <Stack
                key={item.id}
                align='center'
                spacing={0}
                justify='center'
                p={0}
              >
                <Anchor
                  href={item.url}
                  target='_blank'
                  component='a'
                  rel='noopener noreferrer'
                  aria-label={`Go to ${item.text} app`}
                >
                  <Avatar
                    src={item.avatar}
                    color='teal'
                    size='lg'
                    sx={(theme) => ({
                      borderRadius: '100%',
                      backgroundColor: theme.colors.gray[3],
                      ':hover': {
                        transition: 'all 0.4s linear',
                        backgroundColor: theme.colors.gray[5],
                        border: '1px solid',
                        cursor: 'pointer'
                      }
                    })}
                  />
                </Anchor>
                <Text color='dimmed' align='center' size='xs'>
                  {' '}
                  {item.text}{' '}
                </Text>
              </Stack>
            )
        )}
      <Translation />
    </Group>
  )
}
export default LoggedIn
