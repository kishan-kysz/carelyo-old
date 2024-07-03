// components/CookiesBanner.tsx
import React from 'react'
import { Button, Text, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export function CookiesBanner({ accept }: { accept: () => void }) {
  const { t, ready } = useTranslation(['default'])

  if (!ready) {
    // If translations are not ready, you can choose to render a loading state or an empty element
    return null // Or any other loading state you prefer
  }

  return (
    <>
      <Text color='dimmed' size='xs'>
        {t('cookies-message')}
      </Text>

      <Group position='right' mt='xs'>
        <Button
          variant='subtle'
          size='xs'
          color='blue'
          target='_blank'
          component='a'
          rel='noopener noreferrer'
          href='https://www.cookiesandyou.com/'
        >
          {t('cookies-learn-more')}
        </Button>
        <Button variant='outline' size='xs' onClick={accept}>
          {t('cookies-accept')}
        </Button>
      </Group>
    </>
  )
}
