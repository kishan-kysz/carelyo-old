import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { useState } from 'react'
import UpdateStepOne from './update-step-one'
import UpdateStepTwo from './update-step-two'
import { IconMedicalCross, IconUserCircle } from '@tabler/icons-react'
import useProfile from '@hooks/use-profile'
import { UserFormProvider, useUserForm } from './profile-form-context'
import dayjs from 'dayjs'
import useConfirmModal from '@hooks/use-confirm-modal'
import { errorType } from '../../../api'
import { AxiosError } from 'axios'
import { showNotification } from '@mantine/notifications'
import { datetime } from '@utils/datetime'

export default function CompleteProfile() {
  const [active, setActive] = useState(0)
  const { user, updateProfileMutation, isLoading: userLoading } = useProfile()
  const [errors, setErrors] = useState<errorType['errors']>(null)
  const validateAge = (date: Date | string) => {
    //must be 18 years old  to register  and cant be more than 100 years old
    const age = dayjs().diff(date, 'year')
    if (!date) return 'You must enter your date of birth'
    if (age < 18) {
      return 'You must be 18 years old to register'
    }
    if (age > 100) {
      return 'You must be less than 100 years old to register'
    }
  }

  const { mutateAsync, isLoading, status } = updateProfileMutation
  const form = useUserForm({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      dateOfBirth: dayjs().subtract(18, 'year').toDate(),
      gender: user?.gender,
      university: user?.university,
      graduationDate: undefined,
      city: user?.city,
      consent: false,
      state: user?.state,
      country: user?.country,
      street: user?.street,
      zipCode: user?.zipCode,
      streetNumber: user?.streetNumber,
      hospital: user?.hospital,
      accountType: user?.accountType,
      workAddress: user?.workAddress,
      workMobile: user?.workMobile,
      workEmail: user?.workEmail,
      name: undefined,
    },
    validate: (values) => {
      if (active === 0) {
        return {
          dateOfBirth: validateAge(values.dateOfBirth), //must be 18 years old  to register
          gender: values.gender ? undefined : 'You must enter your gender',
          country: values.country ? undefined : 'Please enter your country',
          state: values.state ? undefined : 'Please enter your state',
          city: values.city ? undefined : 'Please enter your city',
          street: values.street ? undefined : 'Please enter your street',
          zipCode: values.zipCode ? undefined : 'Please enter your zip code',
          consent: values.consent
            ? undefined
            : 'You must agree to the terms and conditions',
          streetNumber: values.streetNumber
            ? undefined
            : 'Please enter your street number',
        }
      }
      if (active === 1) {
        return {
          university: values.university
            ? undefined
            : 'Please enter your university',
          workAddress: values.workAddress
            ? undefined
            : 'Please enter your work address',
          workMobile: values.workMobile
            ? undefined
            : 'Please enter your work mobile',
          workEmail: values.workMobile
            ? undefined
            : 'Please enter your work email',
          graduationDate: values.graduationDate
            ? undefined
            : 'Please enter your graduation date',
        }
      }
    },
  })
  const fieldHasError = (field: string) =>
    !!errors.find((e) => e.field === field)
  const getErrorMessage = (field: string) =>
    errors.find((e) => e.field === field)?.message.toLowerCase()
  const hasServerOrRunTimeError = (err) =>
    !!err.find((e) => e.code === 'server_error' || e.code === 'runtime_error')
  const onSubmit = async () => {
    const { dateOfBirth, graduationDate, ...rest } = form.values

    await mutateAsync(
      {
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        graduationDate: new Date(graduationDate).toISOString(),
        accountType: 'Doctor',
        ...rest,
      },
      {
        onError: (error: AxiosError<errorType>) => {
          showConfirmModal(false)
          showNotification({
            title: 'Something went wrong',
            message:
              'Some errors occurred while updating your profile. Please try again later',
            color: 'red',
            icon: <IconMedicalCross size={24} />,
          })

          setErrors(error.response.data.errors)
        },
      },
    )
  }
  const { ConfirmModal, showConfirmModal } = useConfirmModal(onSubmit)

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current))
  const nextStep = () => {
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current
      }
      return current < 2 ? current + 1 : current
    })
    if (!form.validate().hasErrors && active > 1) {
      showConfirmModal(true)
    }
  }
  const handleStatusText = () => {
    //handles the status text
    if (status === 'error' && errors?.length === 0) {
      return 'Something went wrong, please try again later'
    }
    switch (status) {
      case 'success':
        return 'Profile Updated Successfully'
      case 'error':
        return 'Some errors occurred, Fix them to continue'
      case 'idle':
        return 'Check the information you provided is correct'
      case 'loading':
        return 'Wait a moment while we update your profile'
      default:
        return 'Please complete your profile to continue'
    }
  }
  return (
    <>
      <LoadingOverlay visible={userLoading} />
      <Box
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Container
          size="xl"
          mt="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '90%',
            justifyContent: 'space-between',
          }}
        >
          <Stack mb="md" spacing="xs">
            <Title order={2}>Profile Incomplete!</Title>
            <Text color="brand">
              {' '}
              Please complete your profile to continue.
            </Text>
          </Stack>
          <UserFormProvider form={form}>
            <ConfirmModal isLoading={isLoading} />
            <Stepper active={active} breakpoint="md" sx={{ flex: 1 }}>
              <Stepper.Step
                label="Personal Details"
                icon={<IconUserCircle size={18} />}
                description="Submit details about you"
              >
                <UpdateStepOne />
              </Stepper.Step>
              <Stepper.Step
                label="Work Details"
                icon={<IconMedicalCross size={18} />}
                description="Submit details about your work and education"
              >
                <UpdateStepTwo />
              </Stepper.Step>
              <Stepper.Completed>
                <Stack spacing="xs">
                  <Divider
                    mt="sm"
                    color="dark"
                    labelPosition="center"
                    label={
                      <Title order={3} align="center" color="dark">
                        {handleStatusText()}{' '}
                      </Title>
                    }
                  />
                  <SimpleGrid cols={2} spacing={2}>
                    {Object.entries(form.values).map(([key, value]) => {
                      if (key === 'userId') {
                        return null
                      }
                      if (typeof value === 'boolean') {
                        return (
                          <>
                            <Text
                              weight={700}
                              color={
                                errors && fieldHasError(key) ? 'red' : 'gray'
                              }
                              key={`${key}${value}`}
                            >
                              {key.toUpperCase()}{' '}
                            </Text>
                            <Group
                              color={
                                errors && fieldHasError(key) ? 'red' : 'dark'
                              }
                            >
                              <Text color="dark" weight={700}>
                                {value ? 'Yes' : 'No'}
                              </Text>
                              {errors && fieldHasError(key) ? (
                                <Text color="red" span={true} ml="md">
                                  {getErrorMessage(key)}
                                </Text>
                              ) : null}
                            </Group>
                          </>
                        )
                      }
                      if (
                        key === 'graduationDate' ||
                        key === 'dateOfBirth' ||
                        value instanceof Date
                      ) {
                        return (
                          <>
                            <Text
                              weight={700}
                              color={
                                errors && fieldHasError(key) ? 'red' : 'gray'
                              }
                              key={`${key}${value}`}
                            >
                              {key.toUpperCase()}{' '}
                            </Text>
                            <Group
                              color={
                                errors && fieldHasError(key) ? 'red' : 'dark'
                              }
                            >
                              <Text color="dark" weight={700}>
                                {datetime(value).format('YYYY/MM/DD')}
                              </Text>
                              {errors && fieldHasError(key) ? (
                                <Text color="red" span={true} ml="md">
                                  {getErrorMessage(key)}
                                </Text>
                              ) : null}
                            </Group>
                          </>
                        )
                      }

                      return (
                        <>
                          <Text
                            weight={700}
                            color={
                              errors && fieldHasError(key) ? 'red' : 'gray'
                            }
                            key={`${key}${value}`}
                          >
                            {key.toUpperCase()}{' '}
                          </Text>
                          <Group
                            color={
                              errors && fieldHasError(key) ? 'red' : 'dark'
                            }
                          >
                            {/**@ts-ignore **/}
                            <Text color="dark" weight={700}>
                              {value}
                            </Text>
                            {errors && fieldHasError(key) ? (
                              <Text color="red" span={true} ml="md">
                                {getErrorMessage(key)}
                              </Text>
                            ) : null}
                          </Group>
                        </>
                      )
                    })}
                  </SimpleGrid>
                </Stack>
              </Stepper.Completed>
            </Stepper>
          </UserFormProvider>
          <Group position="center" mt="xl">
            <Button disabled={active === 0} variant="subtle" onClick={prevStep}>
              Previous
            </Button>
            {!form.isValid() ? (
              <Tooltip label="Please fill in all required fields">
                <Button loading={isLoading} onClick={nextStep}>
                  {active <= 1 ? 'Next' : ' Submit'}
                </Button>
              </Tooltip>
            ) : (
              <Button loading={isLoading} onClick={nextStep}>
                {active <= 1 ? 'Next' : ' Submit'}
              </Button>
            )}
          </Group>
        </Container>
      </Box>
    </>
  )
}
CompleteProfile.title = 'Profile Incomplete!'
