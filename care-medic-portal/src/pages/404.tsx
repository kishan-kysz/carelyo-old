import { Anchor, Center, Stack, Title } from '@mantine/core'
import Link from 'next/link'
import Layout from '@components/layout'

const FourOhFour = () => {
  return (
    <Center>
      <Stack>
        <Title>404 - Page Not Found</Title>
        <Link href="/" passHref={true}>
          <Anchor align="center"> Go back home</Anchor>
        </Link>
      </Stack>
    </Center>
  )
}
FourOhFour.getLayout = (page) => {
  return <Layout title="4 Oh 4 - Page not found">{page}</Layout>
}
export default FourOhFour
