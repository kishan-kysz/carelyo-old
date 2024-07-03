import {
  Box,
  Checkbox,
  Chip,
  createStyles,
  Divider,
  Group,
  Input,
  Text,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useUserFormContext } from './profile-form-context'
import dayjs from 'dayjs'
import { useState } from 'react'

const useStyles = createStyles((theme, _params) => ({
  label: {
    '&[data-checked]': {
      '&, &:hover': {
        backgroundColor: theme.colors.brand[theme.fn.primaryShade()],
        color: theme.white,
      },
    },
  },
}))
export const DisplayTextBox = ({
  value,
  title,
}: {
  value: string
  title?: string
}) => {
  return (
    <Box
      my="xs"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.xs,
      })}
    >
      {' '}
      {title && (
        <Text size="sm" color="dark">
          {title}
        </Text>
      )}
      <Text>{value} </Text>
    </Box>
  )
}

export default function UpdateStepOne() {
  const { values, errors, getInputProps } = useUserFormContext()
  const { classes } = useStyles()
  const [streetNumberValue, setStreetNumberValue] = useState('')

  const handleStreetNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target

    // Allow only numbers and alphabets by using a regular expression
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '')

    setStreetNumberValue(filteredValue)
  }
  return (
    <>
      <Group grow>
        <DisplayTextBox value={values.firstName} />
        <DisplayTextBox value={values.lastName} />
      </Group>
      <Group grow>
        <DatePickerInput
          label="Date of birth"
          withAsterisk={true}
          error={errors?.dateOfBirth}
          {...getInputProps('dateOfBirth')}
          excludeDate={(date) =>
            date.getFullYear() > dayjs(Date.now()).subtract(18, 'year').year()
          }
          placeholder="What year where you born"
        />
        <Input.Wrapper
          label="Gender"
          withAsterisk={true}
          error={errors?.gender}
        >
          <Chip.Group {...getInputProps('gender')}>
            <Group position="center">
              <Chip classNames={classes} value="male">
                Male{' '}
              </Chip>
              <Chip classNames={classes} value="female">
                {' '}
                Female{' '}
              </Chip>
              <Chip classNames={classes} value="other">
                {' '}
                Other{' '}
              </Chip>
            </Group>
          </Chip.Group>
        </Input.Wrapper>
      </Group>
      <Group p="xs" my={10}>
        <Checkbox
          checked={values.consent}
          label="I agree to Carelyo terms and conditions"
          {...getInputProps('consent')}
        />
      </Group>
      <Divider
        label="Residence"
        labelPosition="center"
        my="md"
        labelProps={{ size: 'lg', color: 'dark' }}
        color="brand"
      />
      <Group grow>
        <TextInput
          value={undefined}
          label="Country of medical/dental practice?"
          placeholder="Enter country of practice"
          withAsterisk={true}
          error={errors?.country}
          {...getInputProps('country')}
        />
        <TextInput
          value={undefined}
          label="State/region/jurisdiction?"
          placeholder="Enter your state or region"
          withAsterisk={true}
          error={errors?.state}
          {...getInputProps('state')}
        />
      </Group>
      <Group grow>
        <TextInput
          label="City?"
          value={undefined}
          placeholder="Enter your city"
          withAsterisk={true}
          error={errors?.city}
          {...getInputProps('city')}
        />
        <TextInput
          value={undefined}
          label="Practice location address?"
          placeholder="Enter the street or address"
          withAsterisk={true}
          error={errors?.street}
          {...getInputProps('street')}
        />
      </Group>
      <Group grow>
        <TextInput
          type="number"
          label="Practice Zip code?"
          value={undefined}
          placeholder="Enter the post code:10010"
          withAsterisk={true}
          {...getInputProps('zipCode')}
        />
        <TextInput
          type="number"
          error={errors?.streetNumber}
          label="Practice location number?"
          value={streetNumberValue}
          onChange={handleStreetNumberChange}
          placeholder="Only numbers and alphabets allowed"
          withAsterisk={true}
          {...getInputProps('streetNumber')}
        />
      </Group>
    </>
  )
}
