import { Paper, SimpleGrid } from '@mantine/core'
import BookingQueue from '../components/dashboard/booking-queue'
import { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import MessagesQueue from '../components/dashboard/messages-queue'
import React, { useEffect, useState } from 'react'

const Dashboard: NextPageWithLayout = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const responsiveComponentStyles = {
    fontSize: '12px', // Example: Reduce font size
    padding: '2px', // Example: Reduce padding
  }

  if (isMobileOrTablet) {
    return (
      <SimpleGrid
        h="100%"
        w="100%"
        p="sm"
        cols={2}
        spacing="lg"
        breakpoints={[{ maxWidth: 1024, cols: 1, spacing: 'sm' }]}
      >
        <Paper
          withBorder
          p="xl"
          radius="lg"
          h="100%"
          style={responsiveComponentStyles}
        >
          <BookingQueue />
        </Paper>
        <Paper
          withBorder
          p="xl"
          radius="lg"
          h="100%"
          style={responsiveComponentStyles}
        >
          <MessagesQueue />
        </Paper>
      </SimpleGrid>
    )
  }

  return (
    <SimpleGrid
      h="100%"
      w="100%"
      p="sm"
      cols={2}
      spacing="lg"
      breakpoints={[
        { maxWidth: 980, cols: 2, spacing: 'md' },
        { maxWidth: 755, cols: 1, spacing: 'sm' },
        { maxWidth: 600, cols: 1, spacing: 'sm' },
      ]}
    >
      <Paper withBorder p="md" radius="lg" h="100%">
        <MessagesQueue />
      </Paper>
      <Paper withBorder p="md" radius="lg" h="100%">
        <BookingQueue />
      </Paper>
    </SimpleGrid>
  )
}

Dashboard.getLayout = (page) => <Layout title="Dashboard">{page} </Layout>

export default Dashboard
