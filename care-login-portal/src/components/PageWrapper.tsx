import { Paper } from '@mantine/core'

interface Props {
  children: React.ReactNode
}

const PageWrapper = ({ children }: Props) => {
  return (
    <Paper m='0px auto' maw={550} p={30} mx={'auto'} mt={10}>
      {children}
    </Paper>
  )
}

export default PageWrapper
