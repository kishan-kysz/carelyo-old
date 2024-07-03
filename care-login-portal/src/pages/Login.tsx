import { zodResolver } from '@hookform/resolvers/zod'
import {
  Anchor,
  Box,
  Button,
  Group,
  PasswordInput,
  TextInput,
  Center
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageTitle'
import PageWrapper from '../components/PageWrapper'
import { axiosInstance, persistUserCredentialsToCookies } from '../utils/api'
import { customNotification } from '../utils/customNotification'
import { DOCTORURL, PATIENTURL, ROUTES, SYSADMIN } from '../utils/routes'
import { ILoginReq, ILoginRes, SSOLogin } from '../utils/types'
import { Signin } from '../utils/validation'
import { useTranslation } from 'react-i18next'
import { useGoogleLogin } from '@react-oauth/google'
import GoogleButton from 'react-google-button'
const Login = () => {
  const { t, ready } = useTranslation(['default'])
  if (!ready) {
    return
  }
  const authenticateUser = async (data: ILoginReq) => {
    const response = await axiosInstance<ILoginReq, ILoginRes>(
      ROUTES.login,
      'POST',
      data
    )
    return response.data
  }

  const authenticateSSOUser = async (data: SSOLogin) => {
    try {
      const response = await axiosInstance<SSOLogin, ILoginRes>(
        ROUTES.ssoLogin,
        'POST',
        data
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.errors[0].message );
        if (error.response.data.errors[0].message = "login with carelyo Credential") {
          customNotification({
            title: t('login-error'),
            //@ts-ignore
            message: t('login-account-exists'),
            type: 'error'
          })
        } else {
          customNotification({
            title: t('login-error'),
            //@ts-ignore
            message: error?.response?.data?.message,
            type: 'error'
          })
        }


      }
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginReq>({
    mode: 'onBlur',
    resolver: zodResolver(Signin)
  })

  const { mutateAsync: mutateAsyncLogin, isLoading: isLoading } = useMutation(authenticateUser, {
    onSuccess: async (data) => {
      redirectResponse(data);
    },
    onError: (error) => {
      if (error) {
        customNotification({
          title: t('login-error'),
          //@ts-ignore
          message: error?.response?.data?.message,
          type: 'error'
        })
      }
    }
  })
  const { mutateAsync: mutateAsyncSSO } = useMutation(authenticateSSOUser, {
    onSuccess: async (data) => {
      redirectResponse(data)
    },

  })
  const onSubmit = async (data: ILoginReq) => {
    await mutateAsyncLogin(data)
  }
  const onSSOLogin = useGoogleLogin({
    onSuccess: async (data: SSOLogin) => {
      await mutateAsyncSSO(data)
    }
  })

  const redirectResponse = async (data: ILoginRes) => {
    await persistUserCredentialsToCookies(data)
    if (data.role.includes('SYSTEMADMIN')) {
      customNotification({
        title: t('login-success'),
        message: t('login-redirect-admin'),
        type: 'success'
      })
      setTimeout(() => {
        return window.location.replace(SYSADMIN)
      }, 1500)
    }
    if (data.role.includes('DOCTOR')) {
      customNotification({
        title: t('login-success'),
        message: t('login-redirect-doctor'),
        type: 'success'
      })
      setTimeout(() => {
        return window.location.replace(DOCTORURL)
      }, 1500)
    }
    if (data.role.includes('PATIENT')) {
      customNotification({
        title: t('login-success'),
        message: t('login-redirect-patient'),
        type: 'success'
      })
      setTimeout(() => {
        return window.location.replace(PATIENTURL)
      }, 1500)
    }
  }
  return (
    <>
      <PageWrapper>
        <PageHeader
          title={t('login-welcome-header')}
          style={{ marginBottom: '20px' }} // Adjust the value as needed
        />
        <Center mt='sm'>
          <GoogleButton
            style={{
              width: '300px',
              marginBottom: '20px'
            }}
            onClick={() => onSSOLogin()}
          />
        </Center>
        <PageHeader description={t('login-description-header')} />
        <PageHeader link='/signup' label={t('login-createacc-header')} />
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '12px' }}>
          <Box mb='xl'>
            <TextInput
              size='md'
              label={t('login-form-email')}
              placeholder={t('login-form-email-placeholder')}
              required={true}
              {...register('email')}
              error={errors.email?.message}
              description={t('login-form-email-enter')}
            />
            <PasswordInput
              size='md'
              label={t('login-form-password')}
              description={t('login-form-password-desc')}
              {...register('password')}
              error={errors.password?.message}
              placeholder={t('login-form-password-placeholder')}
              required={true}
              mt='md'
            />
            <Group position='right' mt='sm'>
              <Anchor to='/forgot-password' size='sm' component={Link}>
                {t('login-form-password-forgot')}
              </Anchor>
            </Group>
            <Button
              size='md'
              loading={isLoading}
              fullWidth={true}
              mt='sm'
              type='submit'
            >
              {t('login-signin')}
            </Button>
          </Box>
        </form>
      </PageWrapper>
    </>
  )
}

export default Login
