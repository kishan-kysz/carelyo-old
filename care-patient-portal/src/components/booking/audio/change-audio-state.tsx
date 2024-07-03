// import { createStyles, SegmentedControl } from '@mantine/core';
// import { type Dispatch, SetStateAction } from 'react';
// import { useTranslation } from 'react-i18next';
// import mantineConfig from '../../../assets/styles/config/mantine.config.json';
// import { useMediaQuery } from '@mantine/hooks';

// const useStyles = createStyles((theme) => ({
// 	root: {
// 		backgroundColor:
// 			theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
// 		boxShadow: theme.shadows.md,
// 		border: `1px solid ${
// 			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
// 		}`,
// 	},

// 	active: {
// 		backgroundColor: theme.colors.brand[3],
// 	},

// 	control: {
// 		border: '0 !important',
// 	},
// 	label: {
// 		color: mantineConfig.mantine.navigation.SegmentedControl.text.color,
// 		fontWeight: mantineConfig.mantine.navigation.SegmentedControl.text
// 			.fontWeight as FontWeight,
// 		fontSize: mantineConfig.mantine.navigation.SegmentedControl.text
// 			.fontSize as FontSize,
// 	},
// 	labelActive: {
// 		color: `${theme.white} !important`,
// 	},
// }));
// export type ActiveComponents = 'Listen' | 'Record' | 'Notes';

// export default function ComponentState({
// 	activeComponent,
// 	setActiveComponent,
// }: {
// 	activeComponent: string;
// 	setActiveComponent: Dispatch<SetStateAction<ActiveComponents>>;
// }) {
// 	const { t } = useTranslation(['default']);
// 	// const { classes } = useStyles();
// 	const isMobile = useMediaQuery('(max-width: 640px)');
// 	const componentState = [
// 		{ value: 'Record', label: `${t('tr.record').toUpperCase()}` },
// 		{ value: 'Listen', label: `${t('tr.listen').toUpperCase()}` },
// 		{ value: 'Notes', label: `${t('tr.note').toUpperCase()}` },
// 	];

// 	const controlStyles = {
// 		radius: mantineConfig.mantine.navigation.SegmentedControl.radius,
// 		size: isMobile
// 			? 'lg'
// 			: mantineConfig.mantine.navigation.SegmentedControl.size,
// 		color: mantineConfig.mantine.navigation.SegmentedControl.color,
// 		// Add other styles here as needed
// 	};

// 	const textStyles = {
// 		fontSize: mantineConfig.mantine.navigation.SegmentedControl.text.fontSize,
// 		fontWeight:
// 			mantineConfig.mantine.navigation.SegmentedControl.text.fontWeight,
// 		color: mantineConfig.mantine.navigation.SegmentedControl.text.color,
// 	};

// 	return (
// 		<SegmentedControl
// 			value={activeComponent}
// 			onChange={(value) => setActiveComponent(value as ActiveComponents)}
// 			{...controlStyles}
// 			data={componentState}
// 			styles={{ text: textStyles }}
// 		/>
// 	);
// }

import { SegmentedControl } from '@mantine/core';
import { type Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import mantineConfig from '../../../assets/styles/config/mantine.config.json';
import { useMediaQuery } from '@mantine/hooks';

export type ActiveComponents = 'Listen' | 'Record' | 'Notes';

export default function ComponentState({
	activeComponent,
	setActiveComponent,
}: {
	activeComponent: string;
	setActiveComponent: Dispatch<SetStateAction<ActiveComponents>>;
}) {
	const { t } = useTranslation(['default']);
	const isMobile = useMediaQuery('(max-width: 640px)');
	const componentState = [
		{ value: 'Record', label: `${t('tr.record').toUpperCase()}` },
		{ value: 'Listen', label: `${t('tr.listen').toUpperCase()}` },
		{ value: 'Notes', label: `${t('tr.note').toUpperCase()}` },
	];

	const controlStyles = {
		radius: mantineConfig.mantine.navigation.SegmentedControl.radius,
		size: isMobile ? 'lg' : 'xl', // Set size to 'lg' for mobile, 'xl' for larger screens
		color: mantineConfig.mantine.navigation.SegmentedControl.color,
	};

	return (
		<SegmentedControl
			value={activeComponent}
			onChange={(value) => setActiveComponent(value as ActiveComponents)}
			{...controlStyles}
			data={componentState}
			style={{ backgroundColor: '#fff' }} // Set background color here
		/>
	);
}


