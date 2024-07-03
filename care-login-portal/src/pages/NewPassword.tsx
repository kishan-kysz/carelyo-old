import { Box, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { INewPassword } from '../utils/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetPassword } from '../utils/validation'
import { useEffect } from 'react'
import PageHeader from '../components/PageTitle'
import PageControls from '../components/PageControls'
import PageWrapper from '../components/PageWrapper'
import { axiosInstance } from '../utils/api'
import { ROUTES } from '../utils/routes'
import { useMutation } from '@tanstack/react-query'
import { customNotification } from '../utils/customNotification'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

const NewPassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<INewPassword>({
    mode: 'onBlur',
    resolver: zodResolver(ResetPassword)
  })
  const { t, ready } = useTranslation(['default'])
  if (!ready) {
    return
  }
  const newPassword = async (data: INewPassword): Promise<string> => {
    const response = await axiosInstance<INewPassword, string>(
      ROUTES.resetPassword,
      'POST',
      data
    )
    return response.data
  }

  const navigate = useNavigate()

  const { mutateAsync, isLoading } = useMutation(newPassword, {
    onSuccess: (data) => {
      customNotification({
        title: data,
        type: 'success',
        message: t('newpass-change-success')
      })
      reset()
      navigate('/')
    },
    onError: (error: AxiosError) => {
      customNotification({
        title: t('newpass-change-error'),
        message: error.response?.data.message,
        type: 'error'
      })
    }
  })

  const onSubmit = (data: INewPassword) => {
    mutateAsync(data)
  }
  const [query] = useSearchParams()
  const token = query.get('k')
  const router = useNavigate()
  useEffect(() => {
    if (!token) {
      return router('/')
    }
    setValue('token', token)
  }, [token, setValue])

  return (
    <PageWrapper>
      <PageHeader
        title={t('newpass-form-title')}
        description={t('newpass-form-desc')}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb='xl'>
          <TextInput
            label={t('newpass-form-email-label')}
            placeholder={t('newpass-form-email-placeholder')}
            required={true}
            {...register('email')}
            error={errors?.email?.message}
          />
          <PasswordInput
            label={t('newpass-form-password-label')}
            placeholder={t('newpass-form-password-placeholder')}
            required={true}
            {...register('password')}
            error={errors?.password?.message}
          />
          <PasswordInput
            label={t('newpass-form-passconf-label')}
            placeholder={t('newpass-form-passconf-placeholder')}
            required={true}
            {...register('confirmPassword')}
            error={errors?.confirmPassword?.message}
          />
          <PageControls isLoading={isLoading} />
        </Box>
      </form>
    </PageWrapper>
  )
}

export default NewPassword
