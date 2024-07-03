import { zodResolver } from '@hookform/resolvers/zod'
import { Box, TextInput, Text, Title, Button } from '@mantine/core'

import PageControls from '../components/PageControls'
import PageHeader from '../components/PageTitle'
import PageWrapper from '../components/PageWrapper'
import { customNotification } from '../utils/customNotification'
import { IForgotPassword } from '../utils/types'
import { ForgotPasswordSchema } from '../utils/validation'
import { axiosInstance } from '../utils/api'
import { ROUTES } from '../utils/routes'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'

const ForgotPassword = () => {
  const { t, ready } = useTranslation(['default'])
  if (!ready) {
    return
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IForgotPassword>({
    mode: 'onBlur',
    resolver: zodResolver(ForgotPasswordSchema)
  })

  const resetPassword = async (data: IForgotPassword): Promise<string> => {
    const response = await axiosInstance<IForgotPassword, string>(
      ROUTES.forgotPassword,
      'POST',
      data
    )

    return response.data
  }

  const [success, setSuccess] = React.useState(false)

  const { mutateAsync, isLoading } = useMutation(resetPassword, {
    onSuccess: () => {
      reset()
      setSuccess(true)
    },
    onError: (error: AxiosError) => {
      customNotification({
        title: t('forgotpass-onerror-title'),
        message:
          error.response?.data.message || t('forgotpass-onerror-message'),
        type: 'error'
      })
    }
  })

  const onSubmit = (data: IForgotPassword) => mutateAsync(data)

  return (
    <PageWrapper>
      {success ? (
        <>
          <Title order={3}>{t('forgotpass-response-title')}</Title>
          <Text color='dimmed' mt='md'>
            {t('forgotpass-response-info1')}
            <br /> {t('forgotpass-response-info2')}
          </Text>
          <Link to='/'>
            <Button mt='md'>{t('forgotpass-login')}</Button>
          </Link>
        </>
      ) : (
        <>
          <PageHeader
            title={t('forgotpass-title')}
            description={t('forgotpass-title-desc')}
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb='xl'>
              <TextInput
                label={t('forgotpass-form-label')}
                placeholder={t('forgotpass-form-placeholder')}
                {...register('email')}
                error={errors?.email?.message}
                required={true}
              />
            </Box>
            <PageControls isLoading={isLoading} />
          </form>
        </>
      )}
    </PageWrapper>
  )
}

export default ForgotPassword
