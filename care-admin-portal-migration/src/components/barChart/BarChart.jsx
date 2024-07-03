import React, { useState } from 'react';
import { Loader, useMantineColorScheme } from '@mantine/core';
import { dataChangeOnSelect } from './dataChangeOnSelect';
import dynamic from 'next/dynamic';

// Disable SSR for BarchartAge component
const BarchartAge = dynamic(() => import('./BarchartAge'), { ssr: false });

// Disable SSR for BarChartConsultationMetrics component
const BarChartConsultationMetrics = dynamic(() => import('./barChartConsultationMetrics'), { ssr: false });

// Disable SSR for BarchartIllnessAndAge component
const BarchartIllnessAndAge = dynamic(() => import('./barChartIllnessAndAge'), { ssr: false });

// Disable SSR for BarchartIllnessAndTime component
const BarchartIllnessAndTime = dynamic(() => import('./barChartIllnessAndTime'), { ssr: false });

// Disable SSR for BarchartIllnessAndGender component
const BarchartIllnessAndGender = dynamic(() => import('./barChartIllnessAndGender'), { ssr: false });



import { ColorArr } from '../styles/ColorArr';
import { createStyles } from '@mantine/styles';
const useStyles = createStyles(() => ({
	input: {
		borderTop: 'none',
		borderLeft: 'none',
		borderRight: 'none',
		borderBottom: '1px solid rgba(0,191,166,.7)',
		fontWeight: 600,
		fontSize: 18,
		backgroundColor: 'transparent',
		textAlign: 'center',
		paddingTop: 10,
		'&:focus': {
			borderBottom: '1px solid rgba(0,191,166,.7)'
		}
	},
	rightSection: {
		width: 0
	}
}));

export default function BarChartComponent({
	consultationsMetrics,
	onRemove,
	onDateRangeChange,
	ageMetrics,
	title,
	illnessAndAgeMetrics,
	illnessAndTimeMetrics,
	illnessAndGenderMetrics
}) {
	const [selectedValue, setSelectedValue] = useState('Month');
	const [selectedAverages, setSelectedAverages] = useState();
	const [selectData, setSelectData] = useState([]);
	const { classes } = useStyles();
	const { colorScheme } = useMantineColorScheme();
	const formatWeek = (name) => {
		return `${name.slice(0, 4)} W.${name.slice(6, 8)}`;
	};
	const formatHour = (name) => {
		return `${name.slice(5, 10)} ${name.slice(11, 13)}:00`;
	};

	let arr = dataChangeOnSelect(consultationsMetrics, selectedValue, formatHour, selectedAverages, formatWeek);

	const handleDateRangeChange = (dates) => {
		onDateRangeChange(dates);
	};

	const handleChange = (event) => {
		setSelectedValue(event);

		event === 'Day'
			? setSelectData(['Per Hour'])
			: event === 'Week'
			? setSelectData(['Per Hour', 'Per Day'])
			: event === 'Month'
			? setSelectData(['Per Hour', 'Per Day', 'Per Week'])
			: event === 'Year'
			? setSelectData(['Per Hour', 'Per Day', 'Per Week', 'Per Month'])
			: setSelectData([]);
	};
	const handleAveragesChange = (event) => {
		setSelectedAverages(event);
	};
	const COLORS = ColorArr();

	const CustomizedLabel = (props) => {
		const { x, y, value } = props;
		return (
			<text x={x} y={y} dy={-2} fontSize='20' fill={colorScheme === 'light' ? 'black' : 'rgba(0,191,166,.9)'}>
				{value === 0 ? null : value}
			</text>
		);
	};
	arr?.sort((a, b) => (a.name > b.name ? 1 : -1));

	return (
		<>
			{ageMetrics && title === 'Consultations Age Distribution' ? (
				<BarchartAge
					onRemove={onRemove}
					ageMetrics={ageMetrics}
					CustomizedLabel={CustomizedLabel}
					COLORS={COLORS}
					colorScheme={colorScheme}
				/>
			) : title === 'Consultations Over Time' ? (
				<BarChartConsultationMetrics
					onRemove={onRemove}
					handleChange={handleChange}
					selectData={selectData}
					handleAveragesChange={handleAveragesChange}
					handleDateRangeChange={handleDateRangeChange}
					arr={arr}
					CustomizedLabel={CustomizedLabel}
					COLORS={COLORS}
					colorScheme={colorScheme}
				/>
			) : title === 'Illness And Age' ? (
				<BarchartIllnessAndAge
					onRemove={onRemove}
					CustomizedLabel={CustomizedLabel}
					COLORS={COLORS}
					illnessAndAgeMetrics={illnessAndAgeMetrics}
					classes={classes}
					colorScheme={colorScheme}
				/>
			) : title === 'Illness And Time' ? (
				<BarchartIllnessAndTime
					onRemove={onRemove}
					CustomizedLabel={CustomizedLabel}
					COLORS={COLORS}
					illnessAndTimeMetrics={illnessAndTimeMetrics}
					classes={classes}
					colorScheme={colorScheme}
				/>
			) : title === 'Illness And Gender' ? (
				<BarchartIllnessAndGender
					onRemove={onRemove}
					CustomizedLabel={CustomizedLabel}
					COLORS={COLORS}
					illnessAndGenderMetrics={illnessAndGenderMetrics}
					classes={classes}
					colorScheme={colorScheme}
				/>
			) : (
				<Loader
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)'
					}}
					size='xl'
				/>
			)}
		</>
	);
}
