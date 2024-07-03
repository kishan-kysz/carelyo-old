import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid } from 'recharts';
import { CloseButton, Select, Text } from '@mantine/core';
import { CustomTooltip } from './CustomTooltip';
import { DatePickerInput } from '@mantine/dates';

const AreaChartConsultationsOverTime = ({
	onRemove,
	handleChange,
	selectData,
	handleAveragesChange,
	handleDateRangeChange,
	arr,
	title,
	colorScheme
}) => {
	return (
		<>
			<Text align='center' mt={5} weight={700}>
				{title}
			</Text>
			<CloseButton aria-label='Close modal' onClick={onRemove} style={{ position: 'absolute', top: 2, left: 2 }} />
			<div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
				<Select
					style={{ width: '30%', marginLeft: 60 }}
					data={['Hour', 'Day', 'Week', 'Month', 'Year']}
					placeholder='Week/Month/Year'
					required={true}
					clearable
					clearbuttonlabel='Clear selection'
					onChange={(e) => handleChange(e)}
				/>
				<Select
					style={{ width: '30%' }}
					data={selectData}
					placeholder='Pick Averages'
					required={true}
					disabled={selectData.length === 0}
					clearable
					clearbuttonlabel='Clear selection'
					onChange={(e) => handleAveragesChange(e)}
					mb={5}
				/>
				<DatePickerInput
					label=''
					placeholder='Select consultation dates'
					style={{ width: '48%' }}
					onChange={handleDateRangeChange}
				/>
			</div>
			<ResponsiveContainer width="98%" height='80%'>
				<AreaChart
					data={arr?.sort((a, b) => (a.name > b.name ? 1 : -1))}
					margin={{
						top: 30,
						right: 30,
						left: 5,
						bottom: 10
					}}
				>
					<defs>
						<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#2598fd" stopOpacity={0.7} />
							<stop offset="85%" stopColor="#00c49f" stopOpacity={0.3} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray={colorScheme === 'light' ? '3 3' : '0.5 3'} />
					<Area dataKey="data" stroke="#2451B7" fill="url(#color)" />

					<XAxis dataKey="name" label={{ position: 'insideBottom', offset: -1 }} />

					<YAxis
						datakey="data"
						axisLine={false}
						tickLine={false}
						tickCount={12}
						label={{ value: 'Consultations', angle: -90, position: 'insideLeft' }}
					/>

					<Tooltip content={<CustomTooltip />} position={{ y: 10 }} />

					<CartesianGrid opacity={0.1} vertical={false} />
				</AreaChart>
			</ResponsiveContainer>
		</>
	);
};

export default AreaChartConsultationsOverTime;
