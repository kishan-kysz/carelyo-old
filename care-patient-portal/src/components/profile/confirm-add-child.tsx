import { Box, Button, Group, SimpleGrid } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import useChildren from '../../hooks/use-children';
import useProfile from '../../hooks/use-profile';
import { useTranslation } from 'react-i18next';
import { createNewDate } from '../../utils';
import { useNavigate } from 'react-router-dom';

export default function ConfirmAddChild({
	prev,
	setOpened,
	setActive,
	form,
}: {
	prev: () => void;
	setOpened: (value: boolean) => void;
	setActive: (value: number) => void;
	form: any;
}) {
	const { t } = useTranslation(['default']);

	const { createChild } = useChildren();
	const { user } = useProfile();
	const navigate = useNavigate();
	const maskPhoneNumber = (phoneNumber: string) => {
			let phoneNumberArray = phoneNumber.split('');
			for (let i = 5; i <= 9; i++) {
				phoneNumberArray[i] = 'X';
			}
			const maskedPhoneNumber = phoneNumberArray.join('');
			return maskedPhoneNumber;
		};
		
	const maskDigit = (phoneNumber: string) => {
			let phoneNumberArray = phoneNumber.split('');
			for (let i = 3; i <= 6; i++) {
				phoneNumberArray[i] = 'X';
			}
			const maskedPhoneNumber = phoneNumberArray.join('');
			return maskedPhoneNumber;
		};


	const handleSubmit = async () => {
		if (user?.ninCard === null && user.nationalIdNumber === null) {
			showNotification({
				message:t('tr.please-add-nin-number-and-nin-card-first-then-you-can-add-child'),
				color: 'red',
				autoClose: 8000,
			});
			navigate('/profile');
		} else {
			await createChild({
				...form?.values,
			});
			form.reset();
			setActive(0);
			showNotification({
				color: 'green',
				title: t('tr.success'),
				message: t('tr.notification_success-child-registered'),
			});
		}
		setOpened(false);
	};

	return (
		<div>
			<SimpleGrid cols={1}>
				<Box
					sx={(theme) => ({
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[6]
								: theme.colors.gray[1],
						padding: theme.spacing.xl,
						borderRadius: theme.radius.md,
					})}
				>
					<div>
						{form?.values && (
							<>
								<div>
									<b>{'Name'}: </b>
									{form?.values.name}
								</div>
								<div>
									<b>{t('tr.gender')}: </b>
									{form?.values.gender}
								</div>
								<div>
									<b>{t('tr.date-of-birth')}: </b>
									{createNewDate(form?.values.dateOfBirth)}
								</div>
								{form.values.singleParent === false && (
									<div>
										<div>
											<b>{'Partner First Name'}: </b>
											{form?.values.partnerFirstName}
										</div>
										<div>
											<b>{'Partner Last Name'}: </b>
											{form?.values.partnerLastName}
										</div>
										<div>
											<b>{'Partner National ID Number'}: </b>
											{maskDigit(form?.values.partnerNationalIdNumber)}
										</div>
										<div>
											<b>{'Partner Phone Number'}: </b>
											{maskPhoneNumber(form?.values.partnerPhoneNumber)}
										</div>
										<div>
											<b>{'Partner Email Id'}: </b>
											{form?.values.partnerEmailId}
										</div>
									</div>
								)}
								<div>
									<b>{'Birth Certificate'}: </b>
									{form?.values.birthCertificate.name}
								</div>
								{form?.values.NINCard && (
									<div>
										<b>{'NINCard'}: </b>
										{form.values.NINCard.name}
									</div>
								)}
							</>
						)}
					</div>
					<div>
						<b>{'Single Parent'}: </b>
						{form?.values.singleParent ? 'Yes' : 'No'}
					</div>
				</Box>
			</SimpleGrid>
			<Group grow={true} position="right" my={'md'}>
				<Button variant="default" onClick={() => prev()}>
					{t('tr.edit')}
				</Button>
				<Button type="submit" onClick={handleSubmit}>
					{t('tr.submit')}
				</Button>
			</Group>
		</div>
	);
}
