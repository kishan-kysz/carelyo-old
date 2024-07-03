import { Box, Container, Tabs } from '@mantine/core';
import {
	IconBabyCarriage,
	IconClipboardHeart,
	IconCreditCard,
	IconHeartbeat,
	IconId,
	IconUser
} from '@tabler/icons-react';
import { Fragment, lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageTitle from '../../components/core/page-title';
import LoadingIndicator from '../../components/loading-indicator';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import useProfile from '../../hooks/use-profile';
import { showNotification } from '@mantine/notifications';
import { useLocation } from 'react-router-dom';

const AccountDetails = lazy(
	() => import('../../components/profile/account-details')
);
const AddChildren = lazy(() => import('../../components/profile/add-children'));
const BillingInfo = lazy(() => import('../../components/profile/billing-info'));
const MedicalInfo = lazy(() => import('../../components/profile/medical-info'));
const PatientInfo = lazy(() => import('../../components/profile/patient-info'));
const VitalsInfo = lazy(() => import('../../components/profile/vitals-info'));

export const Profile = () => {
	const { t } = useTranslation(['default']);

	const { user } = useProfile();
	const location = useLocation();
	const [nationalIdExists, setNationalIdExists] = useState(false);

	useEffect(() => {
	  const checkNationalIdExists = () => {
		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
		const createdAtDate = new Date(user?.createdAt);
		const nationalIdIncomplete = !user?.nationalIdNumber && user?.createdAt;
	
		const nationalIdExistsValue = !(nationalIdIncomplete && createdAtDate < twoWeeksAgo);
		setNationalIdExists(nationalIdExistsValue);
	
		if (!nationalIdExistsValue) {
		  showNotification({
			message: `${t('tr.complete-profile')}`,
			color: 'red',
			autoClose: 5000,
		  });
		}
	  };
	  checkNationalIdExists();
	}, [location.pathname]); // Dependency on user to ensure it runs when user data changes
	
	
	return (
		<Fragment>
			<Container sx={{ flex: '1', justifyContent: 'flex-start' }}>
				<PageTitle heading={`${t('tr.profile').toUpperCase()}`} />
			</Container>
			<Container size={'md'}>
				<Box p={15}>
					<Tabs defaultValue="Account-Details">
						{/*List*/}
						<Tabs.List position={'center'} grow={true}>

							 
							<Tabs.Tab
								value="Account-Details"
								icon={<IconUser size={mantineConfig.mantine.global.iconSize} />}
								color={mantineConfig.mantine.title.color}
								style={{
									fontFamily: mantineConfig.mantine.global.fontFamily,
									fontSize: mantineConfig.mantine.text.fontSize,
								}}
								w="10"
							>
								{t('tr.account-details').toUpperCase()}
							</Tabs.Tab>
							<Tabs.Tab
							disabled = {!nationalIdExists}
								value="Patient-Info"
								icon={<IconId size={mantineConfig.mantine.global.iconSize} />}
								color={mantineConfig.mantine.title.color}
								style={{
									fontFamily: mantineConfig.mantine.global.fontFamily,
									fontSize: mantineConfig.mantine.text.fontSize,
								}}
							>
								{t('tr.patient-info').toUpperCase()}
							</Tabs.Tab>
							<Tabs.Tab
							disabled = {!nationalIdExists}
								value="Vitals"
								icon={
									<IconHeartbeat size={mantineConfig.mantine.global.iconSize} />
								}
								color={mantineConfig.mantine.title.color}
								style={{
									fontFamily: mantineConfig.mantine.global.fontFamily,
									fontSize: mantineConfig.mantine.text.fontSize,
								}}
							>
								{t('tr.vitals').toUpperCase()}
							</Tabs.Tab>
							<Tabs.Tab
							disabled = {!nationalIdExists}
								value="Medical-Info"
								icon={
									<IconClipboardHeart
										size={mantineConfig.mantine.global.iconSize}
									/>
								}
								color={mantineConfig.mantine.title.color}
								style={{
									fontFamily: mantineConfig.mantine.global.fontFamily,
									fontSize: mantineConfig.mantine.text.fontSize,
								}}
							>
								{t('tr.medical-info').toUpperCase()}
							</Tabs.Tab>
							<Tabs.Tab
							disabled = {!nationalIdExists}
								value="Children"
								icon={
									<IconBabyCarriage
										size={mantineConfig.mantine.global.iconSize}
									/>
								}
								color={mantineConfig.mantine.title.color}
								style={{
									fontFamily: mantineConfig.mantine.global.fontFamily,
									fontSize: mantineConfig.mantine.text.fontSize,
								}}
							>
								{t('tr.children').toUpperCase()} <b />
							</Tabs.Tab>
							<Tabs.Tab
							disabled = {!nationalIdExists}
								value="Billing-Info"
								icon={
									<IconCreditCard
										size={mantineConfig.mantine.global.iconSize}
									/>
								}
								color={mantineConfig.mantine.title.color}
								style={{
									fontFamily: mantineConfig.mantine.global.fontFamily,
									fontSize: mantineConfig.mantine.text.fontSize,
								}}
							>
								{t('tr.billing-info').toUpperCase()}
							</Tabs.Tab>
							{/*<Tabs.Tab value='Invite-Friend' icon={<IconShare size={14} />}>
								{t('tr.invite-friend')}
							</Tabs.Tab>*/}
						</Tabs.List>

						{/*Panels*/}
						{/*Account Details*/}
						<Suspense fallback={<LoadingIndicator />}>
							<Tabs.Panel value="Account-Details" pt="xs">
								<AccountDetails />
							</Tabs.Panel>

							{/*Patient Info*/}
							<Tabs.Panel value="Patient-Info" pt="xs">
								<PatientInfo />
							</Tabs.Panel>

							{/*Patient vitals*/}
							<Tabs.Panel value="Vitals" pt="xs">
								<VitalsInfo />
							</Tabs.Panel>

							{/* Medical Info*/}
							<Tabs.Panel value="Medical-Info" pt="xs">
								<MedicalInfo />
							</Tabs.Panel>

							{/*Children*/}
							<Tabs.Panel value="Children" pt="xs">
								<AddChildren />
							</Tabs.Panel>

							{/*Billing Info*/}
							<Tabs.Panel value="Billing-Info" pt="xs">
								<BillingInfo />
							</Tabs.Panel>

							{/*Invite Friend
							<Tabs.Panel value='Invite-Friend' pt='xs'>
								<InviteFriend />
							</Tabs.Panel>
							*/}
						</Suspense>
					</Tabs>
				</Box>
			</Container>
		</Fragment>
	);
};
