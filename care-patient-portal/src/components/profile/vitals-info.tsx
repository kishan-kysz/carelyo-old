import { Avatar, Flex, Group, Select, Tabs, Text, Title } from '@mantine/core';
import { Fragment, useState } from 'react';
import {
	IconBabyCarriage,
	IconClipboardHeart,
	IconHeartPlus,
	IconUser,
} from '@tabler/icons-react';
import useVitals from '../../hooks/use-vitals';
import BloodPressure from '../vitals/blood-pressure';
import BloodOxgen from '../vitals/blood-oxygen';
import Pulse from '../vitals/pulse';
import Temperature from '../vitals/temperature';
import RespiratoryRate from '../vitals/respiratory-rate';
import BloodGlucose from '../vitals/blood-glucose';
import Menstruation from '../vitals/menstruation';
import useProfile from '../../hooks/use-profile';
import LoadingIndicator from '../loading-indicator';
import { useTranslation } from 'react-i18next';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import useChildren from '../../hooks/use-children';
import VitalsChildInfo from './vitals-child-info';

type vitalType =
	| 'pressure'
	| 'oxygen'
	| 'glucose'
	| 'pulse'
	| 'temperature'
	| 'respiratory'
	| 'menstruation';

const VitalsInfo = () => {
	const { t } = useTranslation(['default']);
	const { vitals } = useVitals();
	const { user } = useProfile();
	const { activeChildren } = useChildren();
	const [selectedValue, setSelectedValue] = useState<vitalType>('pressure');
	const [selectedChildValue, setSelectedChildValue] = useState<string>('0');
	const listData: { value: string | vitalType; label: string }[] = [
		{ value: 'pressure', label: t('tr.blood-pressure') },
		{ value: 'oxygen', label: t('tr.blood-oxygen') },
		{ value: 'glucose', label: t('tr.blood-glucose') },
		{ value: 'pulse', label: t('tr.pulse') },
		{ value: 'temperature', label: t('tr.temperature') },
		{ value: 'respiratory', label: t('tr.respiratory-rate') },
		...(user?.polygenic.gender === 'Female' 
			? [{ value: 'menstruation', label: t('tr.menstruation') }]
			: [])
	];

	if (!vitals) {
		return <LoadingIndicator />;
	}

	const childListData: { value: string; label: string }[] = activeChildren?.map(child => ({
		value: child.childId.toString(),
		label: child.name
	})) || [];

	const mapVitalsToComponent: Record<vitalType, JSX.Element> = {
		pressure: <BloodPressure data={vitals.bloodPressure} />,
		oxygen: <BloodOxgen data={vitals.bloodOxygen} />,
		glucose: <BloodGlucose data={vitals.bloodGlucose} />,
		pulse: <Pulse data={vitals.heartRate} />,
		temperature: <Temperature data={vitals.bodyTemperature} />,
		respiratory: <RespiratoryRate data={vitals.respiratoryRate} />,
		menstruation: <Menstruation data={vitals.menstruation} />,
	};

	return (
		<Fragment>
			<Tabs
				color="teal.8"
				variant="pills"
				radius="xl"
				defaultValue="patientVitals"
			>
				<Flex
					mih={50}
					justify="center"
					align="center"
					direction="row"
					wrap="wrap"
				>
					<Tabs.List>
						<Flex
							gap="xs"
							justify="center"
							align="center"
							direction="row"
							wrap="wrap"
						>
							<Tabs.Tab
								value="patientVitals"
								icon={<IconUser size="0.8rem" />}
								sx={{ border: '1px solid #CED4DA' }}
							>
								{t('tr.patient')}
							</Tabs.Tab>
							<Tabs.Tab
								value="childVitals"
								icon={<IconBabyCarriage size="0.8rem" />}
								sx={{ border: '1px solid #CED4DA' }}
							>
								 {t('tr.children')}
							</Tabs.Tab>
						</Flex>
					</Tabs.List>
				</Flex>
				<Tabs.Panel value="patientVitals" pt="xs">
					<Group position="center">
						<Title
							color={mantineConfig.mantine.input.label.color}
							size={mantineConfig.mantine.input.label.fontSize}
							weight={mantineConfig.mantine.input.label.fontWeight}
						>{`${t('tr.pick-one-vital')}`}</Title>
						<Select
							size={mantineConfig.mantine.input.size}
							placeholder={`${t('tr.pick-one-vital')}`}
							icon={<IconClipboardHeart size="1.5rem" />}
							defaultValue={'pressure'}
							onChange={(e) => setSelectedValue(e as vitalType)}
							data={listData}
						/>
					</Group>

					{/* Patient vitals */}
					{selectedValue ? (
						mapVitalsToComponent[selectedValue]
					) : (
						<Flex mt="3rem" direction="column" align="center" justify="center">
							<Text p="xs" maw={400}>
								<Flex align="center" justify="center">
									<Flex align="center" justify="center">
										<Avatar.Group spacing="xl">
											<Avatar size="xl" color="cyan.5" radius={50} my={20}>
												<IconUser size="4rem" />
											</Avatar>
											<Avatar size="xl" color="teal" radius={50} my={20}>
												<IconHeartPlus size="4rem" />
											</Avatar>
										</Avatar.Group>
									</Flex>
								</Flex>
								<Text
									align="center"
									mb={30}
									weight={700}
									size={17}
									color="gray.6"
									px={10}
								>
									{t('tr.here-is-how-to-add-your-vitals')}
								</Text>
								<Text mb={30} weight={400} size={15} color="gray.7">
									{t('tr.step-1')} {t('tr.pick-a-vital-from-the-menu-above')}
									<Text>
										{t('tr.step-2')}
										{t('tr.press-the-add-button')}
									</Text>
									<Text>
										{t('tr.step-3')} {t('tr.fill-in-the-needed-information')}
									</Text>
									<Text>
										{t('tr.step-4')} {t('tr.press-the-save-button')}
									</Text>
								</Text>
							</Text>
						</Flex>
					)}
				</Tabs.Panel>

				<Tabs.Panel value="childVitals" pt="xs">
					<Group position="center">
						<Title
							color={mantineConfig.mantine.input.label.color}
							size='sm'
							weight={mantineConfig.mantine.input.label.fontWeight}
						>{`${t('tr.pick-one-child')}`}</Title>
						<Select
							placeholder={`${t('tr.pick-one-child')}`}
							icon={<IconUser size="0.9rem" />}
							onChange={(e) => setSelectedChildValue(e as string)}
							data={childListData}
						/>
					</Group>
					{selectedChildValue !== '0' ? 
						(activeChildren && activeChildren.length > 0 ? (
							activeChildren.map(child => (
								selectedChildValue === child.childId.toString() ? (
									<VitalsChildInfo key={child.childId} child={child} />
								) : null
							))
						): null) : (
							<Flex mt="3rem" direction="column" align="center" justify="center">
								<Text p="xs" maw={500}>
									<Flex align="center" justify="center">
										<Flex align="center" justify="center">
											<Avatar.Group spacing="xl">
												<Avatar size="xl" color="cyan.5" radius={50} my={20}>
													<IconBabyCarriage size="4rem" />
												</Avatar>
												<Avatar size="xl" color="teal" radius={50} my={20}>
													<IconHeartPlus size="4rem" />
												</Avatar>
											</Avatar.Group>
										</Flex>
									</Flex>
									<Text align="center" mb={30} weight={700} size={17} color="gray.6" px={10}>
										{t('tr.here-is-how-to-add-your-childs-vitals')}
									</Text>
									<Text mb={30} weight={400} size={15} color="gray.7" px={10}>
										<Text>
											{t('tr.step-1')} {t('tr.pick-a-child-from-the-menu-above')}
										</Text>
										<Text>
											{t('tr.step-2')} {t('tr.pick-a-vital-from-the-menu-above')}
										</Text>
										<Text>
											{t('tr.step-3')} {t('tr.press-the-add-button')}
										</Text>
										<Text>
											{t('tr.step-4')} {t('tr.fill-in-the-needed-information')}
										</Text>
										<Text>
											{t('tr.step-5')} {t('tr.press-the-save-button')}
										</Text>
									</Text>
								</Text>
							</Flex>
						)}
				</Tabs.Panel>
			</Tabs>
		</Fragment>
	);
};

export default VitalsInfo;
