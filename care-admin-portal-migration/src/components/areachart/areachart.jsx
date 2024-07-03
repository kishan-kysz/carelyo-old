import AreaChartAges from './areaChartAges';
import { Loader, CloseButton, Text, useMantineColorScheme } from '@mantine/core';
import AreaChartConsultationsOverTime from './areaChartConsultationsOverTime';
import { useState } from 'react';
import { dataChangeOnSelect } from '.././barChart/dataChangeOnSelect';

const AreaChartComponent = ({ title, consultationsMetrics, ageMetrics, onRemove, onDateRangeChange }) => {
	const [selectedValue, setSelectedValue] = useState('Day');
	const [selectedAverages, setSelectedAverages] = useState();
	const [selectData, setSelectData] = useState([]);
	const { colorScheme } = useMantineColorScheme();
	const formatWeek = (name) => {
		return `${name.slice(0, 4)} W.${name.slice(6, 8)}`;
	};
	const formatHour = (name) => {
		return `${name.slice(5, 10)} ${name.slice(11, 13)}:00`;
	};
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
	let arr = dataChangeOnSelect(consultationsMetrics, selectedValue, formatHour, selectedAverages, formatWeek);
	return (
		<>
			{ageMetrics && title === 'Consultations Age Distribution' && (
				<AreaChartAges title={title} ageMetrics={ageMetrics} onRemove={onRemove} colorScheme={colorScheme} />
			)}
			{consultationsMetrics && title === 'Consultations Over Time' && (
				<AreaChartConsultationsOverTime
					onRemove={onRemove}
					handleChange={handleChange}
					selectData={selectData}
					handleAveragesChange={handleAveragesChange}
					handleDateRangeChange={handleDateRangeChange}
					arr={arr}
					title={title}
					colorScheme={colorScheme}
				/>
			)}
			{!ageMetrics && title === 'Consultations Age Distribution' && (
				<>
					<Text align='center' mt={5} weight={700}>
						Consultations Age Distribution
					</Text>
					<Loader
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)'
						}}
						size='xl'
					/>
					<CloseButton aria-label='Close modal' onClick={onRemove} style={{ position: 'absolute', top: 2, left: 2 }} />
				</>
			)}
			{!consultationsMetrics && title === 'Consultations Over Time' && (
				<>
					<Text align='center' mt={5} weight={700}>
						Consultations Over Time
					</Text>
					<Loader
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)'
						}}
						size='xl'
					/>
					<CloseButton aria-label='Close modal' onClick={onRemove} style={{ position: 'absolute', top: 2, left: 2 }} />
				</>
			)}
		</>
	);
};

export default AreaChartComponent;
