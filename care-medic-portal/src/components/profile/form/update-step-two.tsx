import {
  Box,
  Checkbox,
  Divider,
  Group,
  rem,
  Stack,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useUserFormContext } from './profile-form-context'
import { DisplayTextBox } from './update-step-one'
import { useCallback, useState } from 'react'

function UpdateStepTwo() {
  const { values, errors, getInputProps, setFieldValue } = useUserFormContext()
  const [isSameAsHomeAddress, setIsSameAsHomeAddress] = useState(false)
  const homeAddress = `${values.street} ${values.streetNumber}, ${values.city}, ${values.state}, ${values.country}`
  const setWorkAddress = useCallback(
    (isChecked: boolean) => {
      if (isChecked) {
        setIsSameAsHomeAddress(true)
        setFieldValue('workAddress', homeAddress)
      } else {
        setIsSameAsHomeAddress(false)
        setFieldValue('workAddress', '')
      }
    },
    [homeAddress, setFieldValue],
  )

  return (
    <>
      <DisplayTextBox value={values.hospital} title="Provider Name" />
      <TextInput
        label="Work Address"
        placeholder="1234 Main Street"
        error={errors?.workAddress}
        withAsterisk={true}
        {...getInputProps('workAddress')}
        description="If you are self-employed write home address or P.O Box"
        rightSection={
          <Box>
            <Tooltip label="Same as home address">
              <Checkbox
                color="blue"
                checked={isSameAsHomeAddress}
                onChange={(event) => {
                  setWorkAddress(event.currentTarget.checked)
                }}
              />
            </Tooltip>
          </Box>
        }
        rightSectionProps={{ align: 'center' }}
        rightSectionWidth={rem(50)}
      />
      <Group grow>
        <TextInput
          label="Work mobile"
          error={errors?.workMobile}
          placeholder="08012345678"
          withAsterisk={true}
          {...getInputProps('workMobile')}
        />
        <TextInput
          label="Work email"
          error={errors?.workEmail}
          placeholder="doctorvenice@email.com"
          withAsterisk={true}
          {...getInputProps('workEmail')}
        />
      </Group>
      <Stack>
        <Divider
          label="Education"
          labelPosition="center"
          my="md"
          labelProps={{ size: 'lg', color: 'dark' }}
          color="brand"
        />

        <TextInput
          label="Name of university"
          placeholder="Enter name of university"
          error={errors?.university}
          withAsterisk={true}
          {...getInputProps('university')}
        />

        <DatePickerInput
          label="Graduation year"
          withAsterisk={true}
          error={errors?.graduationDate}
          placeholder="What year did you graduate"
          {...getInputProps('graduationDate')}
        />
      </Stack>
    </>
  )
}

export default UpdateStepTwo
