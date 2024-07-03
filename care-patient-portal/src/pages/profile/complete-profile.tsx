import { useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, UseFormReturnType } from '@mantine/form';
import {
	Box,
	Button,
	Group,
	MultiSelect,
	Select,
	SimpleGrid,
	Stepper,
	TextInput,
	Title
} from '@mantine/core';
import { titles } from '../../constants/titles';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useCountrySelection } from '../../hooks/use-country-selection';
import Container from '../../components/layout/container';
import { ListItem } from '../../components/core/list-item';
import dayjs from 'dayjs';
import { ICompleteProfileRequest } from '../../api/types';
import useProfile from '../../hooks/use-profile';
import { showNotification } from '@mantine/notifications';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import 'react-phone-input-2/lib/style.css'
import { VITE_DEFAULT_COUNTRY} from '../../utils/auth'
import PhoneInputMantine from '../../components/phoneInput/PhoneInput';

export const CompleteProfile = () => {
	const [active, setActive] = useState(0);
	const { t } = useTranslation(['default']);
	const { completeProfile,user } = useProfile();
	
	const form = useForm<ICompleteProfileRequest>({
		initialValues: {
			title: '',
			firstName: user?.firstName ? user.firstName : '',
			surName: user?.surName ? user.surName : '',
			dateOfBirth: null,
			gender: '',
			country: VITE_DEFAULT_COUNTRY,
			city: '',
			community: '',
			state: '',
			address: '',
			language: [],
			mobile: '',
			referallCode : ''
		},

		validate: (values) => {
			if (active === 0) {
				return {
					firstName:
						values.firstName.length < 2
							? t('tr.firstname-must-have-at-least-2-letters')
							: null,
					surName:
						values.surName.length < 2
							? t('tr.surname-must-have-at-least-2-letters')
							: null,
					gender: values.gender.length < 1 ? t('tr.required') : null,
					dateOfBirth:
						values.dateOfBirth &&
							dayjs(Date.now()).diff(values.dateOfBirth) < 18
							? t('tr.you-must-be-at-least-18-years-old')
							: null,
					mobile: (values.mobile.length < 12) ? t('tr.mobile-number-should-be-atlest-8-numbers') : null,
				};
			}
			if (active === 1) {
				return {
					country: values.country.length < 1 ? t('tr.required') : null,
					city: values.city.length < 1 ? t('tr.required') : null,
					language: values.language.length < 1 ? t('tr.required') : null,
					community: values.community.length < 1 ? t('tr.required') : null,
					state: values.state.length < 1 ? t('tr.required') : null,
					address: values.address.length < 1 ? t('tr.required') : null,
					mobile: values.mobile.length < 12 ? t('tr.required') : null,
				};
			}
			return {};
		},
	});

	const nextStep = async () => {
		setActive((current) => {
			if (form.validate().hasErrors) {
				return current;
			}
			return current < 3 ? current + 1 : current;
		});
		if (active >= 2 && !form.validate().hasErrors) {
			await completeProfile(form.values, {
				onSuccess: () => {
					showNotification({
						title: t('tr.notification_success-success'),
						message: t('tr.profile-updated'),
					});
				},
			});
		}
	};
	const FormKeysToTitle: Record<string, string> = {
		title: t('tr.your-title'),
		firstName: t('tr.first-name'),
		surName: t('tr.last-name'),
		dateOfBirth: t('tr.date-of-birth'),
		gender: t('tr.gender'),
		country: t('tr.country'),
		state: t('tr.state'),
		city: t('tr.city'),
		community: t('tr.community'),
		address: t('tr.address'),
		language: t('tr.language'),
		mobile: t('tr.mobile'),
	};
	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current));

	return (
		<Container sx={{ marginTop: '1rem' }}>
			<Title order={2} my={4}>
				{t('tr.complete-profile').toUpperCase()}
			</Title>
			<Stepper active={active} breakpoint="sm" w="80%">
				<Stepper.Step
					sx={{
						fontWeight: 700, // Apply custom font weight
						color: 'black',
					}}
					label={t('tr.first-step').toUpperCase()}
					description={t('tr.personal-information').toUpperCase()}
				>
					<StepOne form={form}/>
				</Stepper.Step>

				<Stepper.Step
					sx={{
						fontWeight: 700, // Apply custom font weight
						color: 'black',
					}}
					label={t('tr.second-step').toUpperCase()}
					description={t('tr.your-location').toUpperCase()}
				>
					<StepTwo form={form} />
				</Stepper.Step>

				<Stepper.Completed>
					<SimpleGrid
						cols={2}
						spacing="xs"
						breakpoints={[
							{ minWidth: 600, cols: 2, spacing: 'lg' },
							{ maxWidth: 600, cols: 1, spacing: 'sm' },
						]}
					>
						<ListItem
							title={FormKeysToTitle['title']}
							description={form.values.title.charAt(0).toUpperCase()+form.values.title.slice(1)}
						/>
						<ListItem
							title={FormKeysToTitle['firstName']}
							description={form.values.firstName}
						/>
						<ListItem
							title={FormKeysToTitle['surName']}
							description={form.values.surName}
						/>
						<ListItem
							title={FormKeysToTitle['dateOfBirth']}
							description={dayjs(form.values.dateOfBirth).format('DD/MM/YYYY')}
						/>
						<ListItem
							title={FormKeysToTitle['gender']}
							description={form.values.gender}
						/>
						<ListItem
							title={FormKeysToTitle['country']}
							description={form.values.country}
						/>
						<ListItem
							title={FormKeysToTitle['state']}
							description={form.values.state}
						/>
						<ListItem
							title={FormKeysToTitle['city']}
							description={form.values.city}
						/>
						<ListItem
							title={FormKeysToTitle['community']}
							description={form.values.community}
						/>
						<ListItem
							title={FormKeysToTitle['address']}
							description={form.values.address}
						/>
						<ListItem
							title={FormKeysToTitle['language']}
							description={form.values.language.join(', ')}
						/>
						<ListItem
							title={FormKeysToTitle['mobile']}
							description={form.values.mobile}
						/>
					</SimpleGrid>
				</Stepper.Completed>
			</Stepper>

			<Group position="right" mt="xl">
				{active !== 0 && (
					<Button variant="default" onClick={prevStep}>
						{t('tr.back')}
					</Button>
				)}
				{active !== 3 && (
					<Button onClick={nextStep}>{active === 2 ? 'Submit' : 'Next'}</Button>
				)}
			</Group>
		</Container>
	);
};

const StepOne = ({
	form,
}: {
	form: UseFormReturnType<ICompleteProfileRequest>;
}) => {
	const { t } = useTranslation(['default']);
	const initialYear = new Date().getFullYear() - 18;
	
	const handleSetPhone = (phone: string) => {
		form.values.mobile = phone
	  }

	const genders = [
		t('tr.male'),
		t('tr.female'),
		t('tr.non-binary'),
		t('tr.prefer-not-to-say'),
	];

	return (
		<Box>
			<Title
				mb={'sm'}
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.gender').toUpperCase()} <span style={{ color: 'red' }}>*</span>
			</Title>
			<Select
				mb={'sm'}
				data={genders}
				size={mantineConfig.mantine.input.size}
				placeholder={`${t('tr.select-your-gender')}`}
				withAsterisk={true}
				required={true}
				{...form.getInputProps('gender')}
			/>

			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb={'sm'}
			>
				{t('tr.your-title').toUpperCase()}{' '}
				<span style={{ color: 'red' }}>*</span>
			</Title>
			<Select
				mb={'sm'}
				size={mantineConfig.mantine.input.size}
				required={true}
				placeholder={`${t('tr.choose-your-title')}`}
				data={titles.map((option) => ({
					value: option,
					label: `${t(`tr.${option}`)}`,
				}))}
				{...form.getInputProps('title')}
			/>
			<Title
				mb={'sm'}
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.first-name').toUpperCase()}{' '}
				<span style={{ color: 'red' }}>*</span>
			</Title>
			<TextInput
				size={mantineConfig.mantine.input.size}
				mb={'sm'}
				withAsterisk={true}
				placeholder={`${t('tr.your-first-name')}`}
				required={true}
				{...form.getInputProps('firstName')}
			/>

			<Title
				mb={'sm'}
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.last-name').toUpperCase()}{' '}
				<span style={{ color: 'red' }}>*</span>
			</Title>
			<TextInput
				mb={'sm'}
				size={mantineConfig.mantine.input.size}
				withAsterisk={true}
				placeholder={`${t('tr.your-last-name')}`}
				required={true}
				{...form.getInputProps('surName')}
			/>

			<div>
				<PhoneInputMantine 
				disable ={false}
				value= {form.values.mobile} 
				 handleSetPhone={handleSetPhone} />
			</div>

			<Title
				style={{ marginTop: '15px' }}
				mb={'sm'}
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.date-of-birth').toUpperCase()}{' '}
				<span style={{ color: 'red' }}>*</span>
			</Title>
			<DatePickerInput
				size={mantineConfig.mantine.input.size}
				clearable={true}
				defaultLevel="decade"
				placeholder={'YYYY-MM-DD'}
				mb={'sm'}
				maxDate={new Date(initialYear, 12)}
				required={true}
				icon={<IconCalendar size={16} />}
				{...form.getInputProps('dateOfBirth')}
			/>
			<Title
            				mb={'sm'}
            				color={mantineConfig.mantine.input.label.color}
            				size={mantineConfig.mantine.input.label.fontSize}
            				weight={mantineConfig.mantine.input.label.fontWeight}
            			>
            				{t('tr.referall-code-optional').toUpperCase()}{' '}
            			</Title>
            			<TextInput
            				size={mantineConfig.mantine.input.size}
            				mb={'sm'}
            				withAsterisk={true}
            				placeholder={`${t('tr.referall-code-optional')}`}
            				required={true}
            				{...form.getInputProps('referallCode')}
            			/>
		</Box>
	);
};

const StepTwo = ({
	form,
}: {
	form: UseFormReturnType<ICompleteProfileRequest>;
}) => {
	const { t } = useTranslation(['default']);
	const {
		availableCountries,
		languages,
		activeCountryStates,
		activeStateCities,
		selectedCountry,
		handleCountrySelect,
		handleStateSelect,
		handleCitySelect,
		selectedState,
		selectedCity,
	} = useCountrySelection();
	return (
		<Box>
			<Title
				mb={'sm'}
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.country').toUpperCase()} <span style={{ color: 'red' }}>*</span>
			</Title>
			<Select
				data={availableCountries}
				required={true}
				placeholder={`${t('tr.your-country')}`}
				withAsterisk={true}
				mb={'sm'}
				defaultValue={selectedCountry}
				onSearchChange={handleCountrySelect}
				{...form.getInputProps('country')}
				disabled
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb={'sm'}
			>
				{t('tr.state').toUpperCase()} <span style={{ color: 'red' }}>*</span>
			</Title>
			<Select
				required={true}
				placeholder={`${t('tr.select-your-state')}`}
				withAsterisk={true}
				mb={'sm'}
				data={activeCountryStates}
				defaultValue={selectedState}
				onSearchChange={handleStateSelect}
				{...form.getInputProps('state')}
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb={'sm'}
			>
				{t('tr.city').toUpperCase()} <span style={{ color: 'red' }}>*</span>
			</Title>
			<Select
				placeholder={`${t('tr.select-your-city')}`}
				required={true}
				withAsterisk={true}
				mb={'sm'}
				data={activeStateCities}
				defaultValue={selectedCity}
				onSearchChange={handleCitySelect}
				{...form.getInputProps('city')}
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb={'sm'}
			>
				{t('tr.language').toUpperCase()} <span style={{ color: 'red' }}>*</span>
			</Title>
			<MultiSelect
				required={true}
				clearable={true}
				withAsterisk={true}
				searchable={true}
				nothingFound="No options, Select a country first"
				mb={'sm'}
				placeholder={`${t('tr.pick-one')}`}
				data={languages}
				{...form.getInputProps('language')}
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb={'sm'}
			>
				{t('tr.address').toUpperCase()} <span style={{ color: 'red' }}>*</span>
			</Title>
			<TextInput
				placeholder={`${t('tr.your-address')}`}
				required={true}
				mb={'sm'}
				withAsterisk={true}
				{...form.getInputProps('address')}
			/>
			<Title
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
				mb={'sm'}
			>
				{t('tr.local-government-area').toUpperCase()}{' '}
				<span style={{ color: 'red' }}>*</span>
			</Title>
			<TextInput
				required={true}
				mb={'sm'}
				withAsterisk={true}
				placeholder={`${t('tr.provide-your-local-government-area')}`}
				{...form.getInputProps('community')}
			/>
		</Box>
	);
};
