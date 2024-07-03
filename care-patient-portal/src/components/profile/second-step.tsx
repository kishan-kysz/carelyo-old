import { Button, Group, Space, Text, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Fragment, useEffect, useState } from 'react';
import { ChildForm } from './add-children';
import axiosApi from '../../api';
import PhoneInputMantine from '../phoneInput/PhoneInput';

const SecondStep = ({
	next,
	prev,
	form,
}: {
	next: () => void;
	prev: () => void;
	form: ChildForm;
}) => {
	const { t } = useTranslation(['default']);
	const [userData, setUserData] = useState<any>(null);
	const [email, setEmail] = useState('');
	const api = axiosApi();

	useEffect(() => {
		if (email !== '') {
			api
				.get(`/v1/users/getUserByEmail/${email}`)
				.then((response) => {
					const userDataRes = response.data;
					setUserData(userDataRes);
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
				});
		} else {
			form.values.partnerFirstName = '';
			form.values.partnerLastName = '';
			form.values.partnerPhoneNumber = '';
			form.values.partnerNationalIdNumber = '';
			setUserData(null);
		}
	}, [email]);

	const handleEmailChange = (email: string) => {
		form.values.partnerEmailId = email;
		setEmail(email);
		setUserData(null)
	};

	const handleSetPhone = (phone: string) => {
		userData?.mobile != null
			?  userData.mobile
			: (form.values.partnerPhoneNumber = phone);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if(userData.email != null ){
		form.values.partnerPhoneNumber = userData?.mobile || '';
		form.values.partnerEmailId = userData?.email || '';
		form.values.partnerFirstName = userData?.firstName || '';
		form.values.partnerLastName = userData?.surName || '';
		form.values.partnerNationalIdNumber = userData?.nationalIdNumber || '';
		}
		next();
	};

	const maskDigit = (phoneNumber: string) => {
			let phoneNumberArray = phoneNumber.split('');
			for (let i = 3; i <= 6; i++) {
				phoneNumberArray[i] = 'X';
			}
			const maskedPhoneNumber = phoneNumberArray.join('');
			return maskedPhoneNumber;
		};

	return (
		<Fragment>
			<form onSubmit={handleSubmit}>
				<div style={{ textAlign: 'center' }}>
					<Text style={{ fontWeight: 'bold' }} mb={5}>
						{t('tr.partner-details')}
					</Text>
					<Space h="xs" />
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr',
						columnGap: '20px',
					}}
				>
					<div>
						<TextInput
							withAsterisk={true}
							mb={'sm'}
							label={t('tr.email')}
							placeholder={t('tr.email')}
							onChange={(e) => handleEmailChange(e.target.value)}
						/>
					</div>
					<div>
						<PhoneInputMantine
							disable={userData?.mobile != null}
							value={
								userData?.mobile != null
									? userData.mobile
									: form.values.partnerPhoneNumber
							}
							handleSetPhone={handleSetPhone}
						/>
					</div>
					<div>
						<TextInput
							withAsterisk={true}
							mb={'sm'}
							label={t('tr.first-name')}
							placeholder={t('tr.first-name')}
							value={userData?.firstName || form.values.partnerFirstName}
							disabled={!!userData?.firstName}
							onChange={(e) =>
								form.setFieldValue('partnerFirstName', e.target.value)
							}
						/>
					</div>
					<div>
						<TextInput
							withAsterisk={true}
							mb={'sm'}
							label={t('tr.last-name')}
							placeholder={t('tr.last-name')}
							value={userData?.surName || form.values.partnerLastName}
							disabled={!!userData?.surName}
							onChange={(e) =>
								form.setFieldValue('partnerLastName', e.target.value)
							}
						/>
					</div>
					<div>
						<TextInput
							label={t('tr.national-identification-number-label')}
							placeholder={t('tr.national-identification-number-label')}
							mb={'sm'}
							value={
								!!userData?.nationalIdNumber ?  maskDigit(userData?.nationalIdNumber) :
								form.values.partnerNationalIdNumber
							}
							disabled={!!userData?.nationalIdNumber}
							onChange={(e) =>
								form.setFieldValue('partnerNationalIdNumber', e.target.value)
							}
						/>
					</div>
				</div>
				<Group position="center" mt="xl">
					<Button variant="default" onClick={() => prev()}>
						{t('tr.back')}
					</Button>
					<Button type="submit">{t('tr.next-step')}</Button>
				</Group>
			</form>
		</Fragment>
	);
};

export default SecondStep;
