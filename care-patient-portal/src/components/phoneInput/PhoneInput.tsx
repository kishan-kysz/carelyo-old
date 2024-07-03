import {
  ActionIcon,
  Group,
  Input,
  Menu,
  Paper,
  ScrollArea,
  Text
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { forwardRef } from 'react'
import {
  CountryIso2,
  defaultCountries,
  FlagEmoji,
  parseCountry,
  usePhoneInput,
  usePhoneValidation
} from 'react-international-phone'
import { useTranslation } from 'react-i18next'
import { env } from '../../utils/env'

export default function PhoneInputMantine({
  disable,
  value,
  handleSetPhone
}: {
  disable : boolean,
  value: string
  handleSetPhone: (phone: string) => void
}) {
  
  const data = defaultCountries.map((c) => {
    const country = parseCountry(c)
    return {
      label: country.name,
      value: country.iso2,
      dialCode: country.dialCode
    }
  })

  const maskPhoneNumber = (phoneNumber: string) => {
		let phoneNumberArray = phoneNumber.split('');
		for (let i = 5; i <= 9; i++) {
			phoneNumberArray[i] = 'X';
		}
		const maskedPhoneNumber = phoneNumberArray.join('');
		return maskedPhoneNumber;
	};
  
  const { t, ready } = useTranslation(['default'])
  if (!ready) {
    return
  }
   const defaultCountry: CountryIso2 = env.VITE_DEFAULT_PHONE_NUMBER_COUNTRY as CountryIso2;

  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      initialCountry: defaultCountry,
      value,
      onCountryChange: () => {},
      countries: defaultCountries
    })
  handleSetPhone(phone)
  const { isValid, lengthMatch } = usePhoneValidation(phone)

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
      ref
    ) => (
      <Paper ref={ref} {...others} role='button' onClick={() => onClick(value)}>
        <Group
          noWrap
          mb={5}
          p={5}
          sx={(theme) => ({
            cursor: 'pointer',
            borderRadius: theme.radius.sm,
            '&:hover': {
              backgroundColor: theme.colors.gray[4]
            }
          })}
        >
          <FlagEmoji iso2={value} />
          <div>
            <Text size='sm'>{label}</Text>
          </div>
          <div
            style={{
              color: 'grey',
              marginLeft: '-10px'
            }}
          >
            <Text size='sm'>+{dialCode}</Text>
          </div>
        </Group>
      </Paper>
    )
  )

  const FlagComponent = () => {
    const [isOpen, { toggle }] = useDisclosure(false)
    return (
      <Menu
        opened={isOpen}
        shadow='md'
        width={320}
        position='bottom-end'
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
      id='mobile'
      withAsterisk={true}
      label={t('tr.PhoneInput-phone-label')}
      error={!isValid ? t('tr.PhoneInput-number-error') : ''}
    >
      <Input
        placeholder={t('tr.PhoneInput-enter-placeholder')}
        rightSection={<FlagComponent />}
        disabled = {disable}
        ref={inputRef}
        value={disable ? maskPhoneNumber(phone) : phone}
        onChange={handlePhoneValueChange}
      />
    </Input.Wrapper>
  )
}