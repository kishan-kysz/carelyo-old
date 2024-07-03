import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Cell } from 'recharts';
import { createStyles } from '@mantine/styles';
import { CloseButton, Divider,
	useMantineColorScheme } from '@mantine/core';
import { renderActiveShape, COLORS } from './renderActiveShape';
import PieChartTitle from './PieChartTitle';
import { selectIllnesses } from './selectIllnesses';
const useStyles = createStyles((theme) => ({
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
export default function PieChartComponent({ data, onRemove }) {
	const { classes } = useStyles();
	const [activeIndex, setActiveIndex] = useState(0);
	const [chartData, setChartData] = useState(data);
	const values = data?.value?.map((item) => item.value);
	const { colorScheme } = useMantineColorScheme();
	const [illnessDisplayGender, setIllnessDisplayGender] = useState();
	const [illnessDisplayTime, setIllnessDisplayTime] = useState();
	const [illnessDisplayAge, setIllnessDisplayAge] = useState();
	const formatIllnessAndGender = illnessDisplayGender
		? Object.entries(illnessDisplayGender?.genders).map(([gender, count]) => ({ gender, count }))
		: [];
	const formatIllnessAndTime = illnessDisplayTime
		? Object.entries(illnessDisplayTime?.times).map(([time, count]) => ({ time, count }))
		: [];
	const formatIllnessAndAge = illnessDisplayAge
		? Object.entries(illnessDisplayAge?.ages).map(([age, count]) => ({ age, count }))
		: [];
	const sum =
		values?.length > 0
			? values.reduce((acc, value) => {
					return acc + value;
			  })
			: 0;

	useEffect(() => {
		setChartData(data);
	}, [data]);

	const onPieEnter = (_, index) => {
		setActiveIndex(index);
	};

	const handleSelectedIllnessGender = (value) => {
		setIllnessDisplayGender(chartData?.value.find((illness) => illness.illness === value));
	};
	const handleSelectedIllnessTime = (value) => {
		setIllnessDisplayTime(chartData?.value.find((illness) => illness.illness === value));
	};
	const handleSelectedIllnessAge = (value) => {
		setIllnessDisplayAge(chartData?.value.find((illness) => illness.illness === value));
	};
	const chartDataWithDefault = chartData?.value?.map((entry) => ({
		gender: entry.gender || 'Other',
		quantity: entry.quantity
	}));

	return (
		<>
			<CloseButton aria-label='Close modal' onClick={onRemove} style={{ position: 'absolute', top: 6 }} />
			<PieChartTitle title={chartData?.title} />
			{selectIllnesses(
				chartData,
				classes,
				handleSelectedIllnessGender,
				handleSelectedIllnessAge,
				handleSelectedIllnessTime
			)}
			<Divider color={colorScheme === 'light' ? '#afbcc7' : 'rgba(0,191,166,.7)'} />
			<ResponsiveContainer width='97%' height='92%'>
				<PieChart style={{ background: colorScheme === 'light' ? 'none' : '#1e1e1e' }}>
					{chartData?.title === 'Consultations Gender Distribution' ? (
						<Pie
							data={chartDataWithDefault}
							dataKey={'quantity'}
							nameKey={'gender'}
							cx='50%'
							cy='51%'
							innerRadius={'55%'}
							outerRadius={'75%'}
							blendStroke={true}
							labelLine={false}
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							onMouseEnter={onPieEnter}
							label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
							minAngle={10}
						>
							{chartData?.value?.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					) : chartData?.title === 'Illness And Gender' ? (
						<Pie
							data={formatIllnessAndGender}
							dataKey={'count'}
							nameKey={'gender'}
							cx='50%'
							cy='60%'
							innerRadius={'55%'}
							outerRadius={'75%'}
							blendStroke={true}
							labelLine={false}
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							onMouseEnter={onPieEnter}
							label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
							minAngle={10}
						>
							{chartData?.value?.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					) : chartData?.title === 'Illness And Time' ? (
						<Pie
							data={formatIllnessAndTime}
							dataKey={'count'}
							nameKey={'time'}
							cx='50%'
							cy='60%'
							innerRadius={'55%'}
							outerRadius={'75%'}
							blendStroke={true}
							labelLine={false}
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							onMouseEnter={onPieEnter}
							label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
							minAngle={10}
						>
							{chartData?.value?.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					) : chartData?.title === 'Illness And Age' ? (
						<Pie
							data={formatIllnessAndAge}
							dataKey={'count'}
							nameKey={'age'}
							cx='50%'
							cy='60%'
							innerRadius={'55%'}
							outerRadius={'75%'}
							blendStroke={true}
							labelLine={false}
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							onMouseEnter={onPieEnter}
							label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
							minAngle={10}
						>
							{chartData?.value?.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					) : chartData?.title === 'Consultations Age Distribution' ? (
						<Pie
							data={chartData?.value}
							dataKey={'numberOfConsultations'}
							nameKey={'ageSpan'}
							cx='50%'
							cy='50%'
							innerRadius={'55%'}
							outerRadius={'75%'}
							blendStroke={true}
							labelLine={false}
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							onMouseEnter={onPieEnter}
							label={({ percent }) => {
								if (percent > 0) {
									return `${(percent * 100).toFixed(0)}%`;
								} else {
									return null;
								}
							}}
							minAngle={10}
						>
							{chartData?.value?.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					) : (
						<Pie
							data={chartData?.value}
							dataKey={'value'}
							nameKey={'title'}
							cx='50%'
							cy='50%'
							innerRadius={'55%'}
							outerRadius={'75%'}
							blendStroke={true}
							labelLine={false}
							minAngle={10}
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							onMouseEnter={onPieEnter}
							label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
						>
							{chartData.value?.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					)}

					{sum === 0 && (
						<Pie data={[{ name: 'No Data', value: 1 }]} dataKey={'value'} nameKey={'name'} fill='#d3d3d3' />
					)}

					<Legend align='left' verticalAlign='bottom' layout='horizontal' />
				</PieChart>
			</ResponsiveContainer>
		</>
	);
}
