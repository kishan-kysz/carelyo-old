import {
  Box,
  Button,
  Space,
  Text,
  TextInput,
  Group,
  Checkbox,
  Modal
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageTitle'
import { IRegisterReq } from '../utils/types'
import { axiosInstance } from '../utils/api'
import { customNotification } from '../utils/customNotification'
import { ROUTES } from '../utils/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { Signup } from '../utils/validation'
import PageWrapper from '../components/PageWrapper'
import PhoneInputMantine from '../components/PhoneInput'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import TermsAndConditions from '../components/TermsAndConditions'
import PrivacyPolicy from '../components/PrivacyPolicy'

const Register = () => {
  const { t, ready } = useTranslation(['default'])
  if (!ready) {
    return
  }
  const [opened, { open, close }] = useDisclosure()
  const [isOpen, { toggle }] = useDisclosure()
  const [phone, setPhone] = useState('')
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors }
  } = useForm<IRegisterReq>({
    mode: 'onBlur',
    resolver: zodResolver(Signup)
  })
  const registerPatient = async (
    data: IRegisterReq
  ): Promise<{ message: string }> => {
    const response = await axiosInstance<IRegisterReq, { message: string }>(
      ROUTES.registerPatient,
      'POST',
      data
    )
    return response.data
  }

  const navigate = useNavigate()
  const { mutateAsync, isLoading } = useMutation(registerPatient, {
    onSuccess: (data) => {
      customNotification({
        title: data.message,
        type: 'success',
        message: t('register-notif-success')
      })
      reset()
      navigate('/')
    },
    onError: (error: AxiosError) => {
      customNotification({
        title: t('register-notif-error'),
        message: error.response?.data.message,
        type: 'error'
      })
    }
  })
  const onSubmit = (data: IRegisterReq) => mutateAsync(data)

  const [query] = useSearchParams()
  const referral = query.get('referral')
  useEffect(() => {
    if (referral) {
      setValue('referralCode', referral)
    }
  }, [referral, setValue])
  const handleSetPhone = (phone: string) => {
    setPhone(phone)
    setValue('mobile', phone)
  }

  const [checked, setChecked] = useState(false)

  const handleCheckbox = (consent: boolean) => {
    setChecked(consent)
    setValue('consent', consent)
  }

  return (
    <PageWrapper>
      <Modal
        title='Terms and conditions'
        size='xl'
        opened={opened}
        onClose={close}
      >
        <TermsAndConditions close={close} />
      </Modal>
      <Modal title='Privacy policy' size='xl' opened={isOpen} onClose={toggle}>
        <PrivacyPolicy />
      </Modal>
      <PageHeader
        title={t('register-form-header-title')}
        description={t('register-form-header-desc')}
        link='/'
        label={t('register-form-header-label')}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb='xl'>
          {referral && (
            <Text align='center' color='teal' mb='sm'>
              {t('register-form-referral')}
              <Text color='dimmed' size='sm'>
                {' '}
                {t('register-form-enter-details')}
              </Text>
            </Text>
          )}

          <TextInput
            size='md'
            label={t('register-form-email')}
            placeholder={t('register-form-email-placeholder')}
            description={t('register-form-email-desc')}
            {...register('email')}
            error={errors?.email?.message}
            required={true}
          />
          <Space h='md' />
          <PhoneInputMantine value={phone} handleSetPhone={handleSetPhone} />
          <TextInput
            size='md'
            label={t('register-form-referral-label')}
            description={t('register-form-referral-desc')}
            error={errors.referralCode?.message}
            {...register('referralCode')}
            disabled={!!referral}
            placeholder={t('register-form-referral-placeholder')}
            mt='md'
          />

          <Group position='center' mt='lg'>
            <Checkbox
              size='md'
              mt='md'
              checked={checked}
              onChange={(event) => handleCheckbox(event.currentTarget.checked)}
              value={checked.toString()}
              description={t('register-form-tos-desc')}
              label={
                <Box display='flex'>
                  <Text size='sm'>
                    {t('register-form-tos-accept')}{' '}
                    <Text
                      ml={4}
                      size='sm'
                      color='teal'
                      onClick={open}
                      tabIndex={0}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          open()
                        }
                      }}
                      sx={{
                        display: 'inline',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {t('register-form-tos-terms')}
                    </Text>
                  </Text>
                </Box>
              }
              required={true}
            />
          </Group>
          <Button
            size='md'
            fullWidth={true}
            mt='xl'
            type='submit'
            loading={isLoading}
          >
            {t('register-form-btn')}
          </Button>
        </Box>
      </form>
    </PageWrapper>
  )
}

export default Register
