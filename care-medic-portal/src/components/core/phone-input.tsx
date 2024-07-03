import {
  ActionIcon,
  Group,
  Input,
  Menu,
  Paper,
  ScrollArea,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { forwardRef } from 'react'
import {
  CountryIso2,
  defaultCountries,
  FlagEmoji,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone'
import { PhoneNumberUtil } from 'google-libphonenumber'

type PhoneInputProps = {
  value: string
  handleSetPhone: (phone: string) => void
}

const PhoneInput = ({ value, handleSetPhone }: PhoneInputProps) => {
  const data = defaultCountries.map((c) => {
    const country = parseCountry(c)
    return {
      label: country.name,
      value: country.iso2,
      dialCode: country.dialCode,
    }
  })

  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'ng',
      value,
    })
  handleSetPhone(phone)
  const isValid = isPhoneValid(phone)

  const FlagComponent = () => {
    const [isOpen, { toggle }] = useDisclosure(false)
    return (
      <Menu
        opened={isOpen}
        shadow="md"
        width={320}
        position="bottom-end"
        zIndex={99}
      >
        <Menu.Target>
          <ActionIcon onClick={toggle}>
            <FlagEmoji iso2={country} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <ScrollArea h={200}>
            {data.map((item) => (
              <SelectItem key={item.value} {...item} onClick={setCountry} />
            ))}
          </ScrollArea>
        </Menu.Dropdown>
      </Menu>
    )
  }
  return (
    <Input.Wrapper
      id="mobile"
      withAsterisk
      label="Phone number"
      description="Please enter your phone number"
      error={!isValid ? 'Enter correct phone number' : undefined}
    >
      <Input
        placeholder="Enter your phone number eg. +234"
        rightSection={<FlagComponent />}
        ref={inputRef}
        value={phone}
        onChange={handlePhoneValueChange}
      />
    </Input.Wrapper>
  )
}

export default PhoneInput

const phoneUtil = PhoneNumberUtil.getInstance()

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone))
  } catch (error) {
    return false
  }
}
const SelectItem = forwardRef<
  HTMLDivElement,
  {
    label: string
    value: CountryIso2
    dialCode: string
    onClick: (val: CountryIso2) => void
  }
>(
  (
    {
      label,
      value,
      dialCode,
      onClick,
      ...others
    }: {
      label: string
      value: CountryIso2
      dialCode: string
      onClick: (val: CountryIso2) => void
    },
    ref,
  ) => (
    <Paper ref={ref} {...others} role="button" onClick={() => onClick(value)}>
      <Group
        noWrap
        mb={5}
        p={5}
        sx={(theme) => ({
          cursor: 'pointer',
          borderRadius: theme.radius.sm,
          '&:hover': {
            backgroundColor: theme.colors.gray[4],
          },
        })}
      >
        <FlagEmoji iso2={value} />
        <div>
          <Text size="sm">{label}</Text>
        </div>
        <div
          style={{
            color: 'grey',
            marginLeft: '-10px',
          }}
        >
          <Text size="sm">+{dialCode}</Text>
        </div>
      </Group>
    </Paper>
  ),
)
SelectItem.displayName = 'SelectItem'
