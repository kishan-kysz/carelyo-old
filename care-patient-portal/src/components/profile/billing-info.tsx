import {
	Box,
	Button,
	Group,
	MultiSelect,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import {
	COUNTRY,
	LANGUAGES_ANGOLA,
	LANGUAGES_GHANA,
	LANGUAGES_NAMIBIA,
	LANGUAGES_NIGERIA,
	LANGUAGES_RWANDA,
	LANGUAGES_SIERRALEONE,
	LANGUAGES_TANZANIA,
} from '../../constants';
import { countries, countryList } from '../../constants/country-states';
import { useTranslation } from 'react-i18next';
import useProfile from '../../hooks/use-profile';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import Wallet from './Wallet';

const BillingInfo = () => {
	const { user, updateProfile ,updateLocal } = useProfile();
	const { t } = useTranslation(['default']);
	const form = useForm({
		initialValues: {
			language: user?.locale.languages,
			address: user?.location.address,
			community: user?.location.community,
			postCode: user?.location.zipCode || undefined,
			country: user?.location.country,
			state: user?.location.state,
			city: user?.location.city,
		},
	});

	const [selectedCity, setSelectedCity] = useState('');
	const [selectedState, setSelectedState] = useState('');
	const [selectedCountry, setSelectedCountry] = useState<countries>(
		user?.location.country || 'Nigeria'
	);

	const handleSetCountry = (country: countries) => {
		setSelectedCountry(country);
		setSelectedState('');
		setSelectedCity('');
	};
	const handleSetState = (state: string) => {
		setSelectedState(state);
		setSelectedCity('');
	};
	const handleSetCity = (city: string) => setSelectedCity(city);
	type SelectData = { label: string; value: string };
	const [cities, setCities] = useState<SelectData[]>([]);
	const [states, setStates] = useState<SelectData[]>([]);
	const[showWallet, setShowWallet] = useState<Boolean>(false)
	const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

	

	useEffect(() => {
		if (selectedCountry) {
			setStates(
				countryList[selectedCountry].flatMap((state) => {
					return Object.keys(state).map((key) => ({
						label: key,
						value: key,
					}));
				})
			);
			form.setFieldValue('country', selectedCountry);
		}
		if (selectedCountry && selectedState) {
			setCities(
				countryList[selectedCountry][0][selectedState].flatMap((city) => ({
					label: city,
					value: city,
				}))
			);
			form.setFieldValue('state', selectedState);
		}
		if (selectedCountry && selectedState && selectedCity) {
			form.setFieldValue('city', selectedCity);
		}
	}, [selectedCity, selectedState, selectedCountry]);

	const selectLanguage = (tempCountry: string) => {
		switch (tempCountry) {
			case 'Nigeria':
				return LANGUAGES_NIGERIA;
			case 'Tanzania':
				return LANGUAGES_TANZANIA;
			case 'Rwanda':
				return LANGUAGES_RWANDA;
			case 'Ghana':
				return LANGUAGES_GHANA;
			case 'Namibia':
				return LANGUAGES_NAMIBIA;
			case 'Angola':
				return LANGUAGES_ANGOLA;
			case 'Sierra Leone':
				return LANGUAGES_SIERRALEONE;
			default:
				return [];
		}
	};
	return (
		
		<form
			onSubmit={form.onSubmit(async (values) => {
				// await updateProfile({
					
				// });

				await updateLocal({
					location: {
						address: values.address,
						zipCode: values.postCode,
						community: values.community,
						city: values.city,
						state: values.state,
						country: values.country,
					},
					locale: {
						languages: values.language,
					},
				});
				form.resetDirty();
			})}
		>
			<Box
				sx={(theme) => ({
					backgroundColor:
						theme.colorScheme === 'dark'
							? theme.colors.dark[6]
							: theme.colors.gray[0],
					//textAlign: 'center',
					padding: theme.spacing.xl,
					borderRadius: theme.radius.md,
				})}
			>
				<SimpleGrid
					cols={2}
					spacing={10}
					breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 'xl' }]}
				>
					<Stack
						spacing={0}
						sx={(theme) => ({
							[theme.fn.largerThan('sm')]: {
								borderBottom: 0,
								borderRight: `1px solid ${theme.colors.gray[3]}`,
							},
							[theme.fn.smallerThan('sm')]: {
								borderBottom: `1px solid ${theme.colors.gray[3]}`,
								borderRight: 0,
							},
						})}
					>
						<Title
							mb="xs"
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{' '}
							{/* {t('tr.transfer')} */}
							{`${t('tr.transfer')}: ${import.meta.env.VITE_BANK} ${import.meta.env.VITE_BANKACCOUNT}`}
						</Title>
						<Text fw={800} color="brand" size="md">
						{' '}
						{t('tr.current-balance')} :{' '}
							{user?.wallet ? user.wallet?.balance : 0}
						</Text>
						
				  		<Button onClick={() =>{setShowWallet(!showWallet) } }  mx="md">{t('tr.add-money').toUpperCase()}</Button>
						 {showWallet && (
                <Wallet currentStep={currentStep} onNextStep={handleNextStep} setShowWallet={setShowWallet} setCurrentStep={setCurrentStep}/>
                  )}  


					</Stack>
					<Stack spacing={0}>
						<Title
							mb="xs"
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>
							{' '}
							{t('tr.your-account-balance')}
						</Title>
						<Text fw={500} color="black" size="sm">
							{t('tr.earnings')}
						</Text>
						<Text fw={200} color="brand">
							{t('tr.coming-soon')}
						</Text>
					</Stack>
				</SimpleGrid>
			</Box>
			<Title
				mb="xs"
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.local-government-area')}
			</Title>
			<TextInput
				mb={'sm'}
				disabled={true}
				size={mantineConfig.mantine.input.size}
				placeholder={`${t('tr.local-government-area')}`}
				{...form.getInputProps('community')}
			/>
			{/* <Title
				mb="xs"
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.provider')}
			</Title> */}
			{/* <TextInput
				size={mantineConfig.mantine.input.size}
				mb={'sm'}
				disabled={true}
				placeholder={`${t('tr.powered-by')}`}
				{...form.getInputProps('address')}
			/> */}
			<Title
				mb="xs"
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.country')}
			</Title>
			<Select
				size={mantineConfig.mantine.input.size}
				nothingFound="No options"
				mb={'sm'}
				placeholder={`${t('tr.pick-one')}`}
				description={'Contact the support team to change the country'}
				disabled={true}
				data={COUNTRY}
				onSearchChange={(e) => handleSetCountry(e as countries)}
				{...form.getInputProps('country')}
			/>
			<Title
				mb="xs"
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.state')}
			</Title>
			<Select
				size={mantineConfig.mantine.input.size}
				nothingFound="No options"
				mb={'sm'}
				disabled={true}
				//value={selectedState}
				placeholder={`${t('tr.pick-one')}`}
				data={states}
				onSearchChange={(e) => handleSetState(e)}
				{...form.getInputProps('state')}
			/>
			<Title
				mb="xs"
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.city')}
			</Title>
			<Select
				size={mantineConfig.mantine.input.size}
				nothingFound="No options"
				mb={'sm'}
				data={cities}
				//value={selectedCity}
				onSearchChange={(e) => handleSetCity(e)}
				{...form.getInputProps('city')}
				placeholder={`${t('tr.pick-one')}`}
			/>
			<Title
				mb="xs"
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.postal-code')}
			</Title>
			<TextInput
				size={mantineConfig.mantine.input.size}
				mb={'sm'}
				/* 				label={t('tr.postal-code')} */
				placeholder={`${t('tr.postal-code')}`}
				{...form.getInputProps('postCode')}
			/>
			<Title
				mb="xs"
				color={mantineConfig.mantine.input.label.color}
				size={mantineConfig.mantine.input.label.fontSize}
				weight={mantineConfig.mantine.input.label.fontWeight}
			>
				{t('tr.language')}
			</Title>
			<MultiSelect
				size={mantineConfig.mantine.input.size}
				searchable={true}
				nothingFound="No options"
				dropdownPosition="top"
				mb={'sm'}
				data={selectLanguage(selectedCountry)}
				placeholder={`${t('tr.pick-one')}`}
				{...form.getInputProps('language')}
			/>

			<Group grow={true} position="right" my={'md'}>
				<Button disabled={!form.isDirty()} type="submit">
					{t('tr.save-changes')}
				</Button>
			</Group>
		</form>
		
		
	);
};

export default BillingInfo;
