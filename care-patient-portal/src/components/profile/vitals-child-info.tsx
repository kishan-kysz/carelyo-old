import { Avatar, Flex, Group, Select, Text, Title } from '@mantine/core';
import { Fragment, useState } from 'react';
import {
	IconBabyCarriage,
	IconClipboardHeart,
	IconHeartPlus,
} from '@tabler/icons-react';
import LoadingIndicator from '../loading-indicator';
import { useTranslation } from 'react-i18next';
import useChildVitals from '../../hooks/use-child-vitals';
import { IChildrenResponse } from '../../api/types';
import ChildBloodPressure from '../vitals/child-blood-pressure';
import ChildBloodOxgen from '../vitals/child-blood-oxygen';
import ChildBloodGlucose from '../vitals/child-blood-glucose';
import ChildPulse from '../vitals/child-pulse';
import ChildTemperature from '../vitals/child-temperature';
import ChildRespiratoryRate from '../vitals/child-respiratory-rate';
import ChildMenstruation from '../vitals/child-menstruation';
import mantineConfig from '../../assets/styles/config/mantine.config.json';

type vitalType =
	| 'pressure'
	| 'oxygen'
	| 'glucose'
	| 'pulse'
	| 'temperature'
	| 'respiratory'
	| 'menstruation';

const VitalsChildInfo = ({
	child
}: {
	child: IChildrenResponse;
}) => {
	const { t } = useTranslation(['default']);
	const { childVitals } = useChildVitals(child);
	const [selectedValue, setSelectedValue] = useState<vitalType>('pressure');
	const listData: { value: string | vitalType; label: string }[] = [
		{ value: 'pressure', label: t('tr.blood-pressure') },
		{ value: 'oxygen', label: t('tr.blood-oxygen') },
		{ value: 'glucose', label: t('tr.blood-glucose') },
		{ value: 'pulse', label: t('tr.pulse') },
		{ value: 'temperature', label: t('tr.temperature') },
		{ value: 'respiratory', label: t('tr.respiratory-rate') },
		...(child?.polygenic.gender === 'Girl'
			? [{ value: 'menstruation', label: t('tr.menstruation') }]
			: [])
	];

	if (!childVitals) {
		return <LoadingIndicator />;
	}

	const mapVitalsToComponent: Record<vitalType, JSX.Element> = {
		pressure: <ChildBloodPressure child={child} data={childVitals.bloodPressure} />,
		oxygen: <ChildBloodOxgen child={child} data={childVitals.bloodOxygen} />,
		glucose: <ChildBloodGlucose child={child} data={childVitals.bloodGlucose} />,
		pulse: <ChildPulse child={child} data={childVitals.heartRate} />,
		temperature: <ChildTemperature child={child} data={childVitals.bodyTemperature} />,
		respiratory: <ChildRespiratoryRate child={child} data={childVitals.respiratoryRate} />,
		menstruation: <ChildMenstruation child={child} data={childVitals.menstruation} />,
	};

	return (
		<Fragment>
			<Group position="center" mt={15}>
				<Title
					color={mantineConfig.mantine.input.label.color}
					size='sm'
					weight={mantineConfig.mantine.input.label.fontWeight}
				>{`${t('tr.pick-one-vital')}`}</Title>
				<Select
					placeholder={`${t('tr.pick-one-vital')}`}
					icon={<IconClipboardHeart size="0.9rem" />}
					defaultValue={'pressure'}
					onChange={(e) => setSelectedValue(e as vitalType)}
					data={listData}
				/>
			</Group>
			{selectedValue ? (
				mapVitalsToComponent[selectedValue]
			) : (
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
			)
			}
		</Fragment>
	)
};

export default VitalsChildInfo;
