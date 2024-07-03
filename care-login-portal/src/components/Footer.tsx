// components/Footer.tsx
import React from 'react'
import { Box } from '@mantine/core'
import { useTranslation } from 'react-i18next'

const yearNow = new Date().getFullYear()

const Footer: React.FC = () => {
  const { t, ready } = useTranslation(['default'])

  if (!ready) {
    // If translations are not ready, you can choose to render a loading state or an empty element
    return null // Or any other loading state you prefer
  }

  return (
    <Box
      sx={{ textAlign: 'center', color: '#999', fontSize: '0.8rem' }}
      px='xs'
    >
      <p>
        &copy; {yearNow} {t('footer-all-rights-reserved')}{' '}
      </p>
    </Box>
  )
}

export default Footer
