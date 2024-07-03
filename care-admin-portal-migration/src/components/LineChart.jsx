import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CloseButton, Text, Select } from '@mantine/core';

export default function LineChartComponent({ data, onRemove, setPeriod }) {
	const handleChange = (event) => {
		setPeriod(event);
	};

	return (
		<>
			<Text align='center' mt={5} weight={700}>
				Amount Paid For Consultations
			</Text>
			<CloseButton aria-label="Close modal" onClick={onRemove} style={{ position: 'absolute', top: 2, left: 2 }} />
			<div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
				<Select
					style={{ width: '30%', marginLeft: 60 }}
					data={['Hour', 'Day', 'Week', 'Month', 'Year']}
					placeholder="Week/Month/Year"
					required={true}
					clearable
					clearbuttonlabel="Clear selection"
					onChange={(e) => handleChange(e)}
				/>
			</div>
			<ResponsiveContainer width="100%" height="80%">
				<LineChart
					data={data}
					width={500}
					height={300}
					barGap={-30}
					margin={{
						top: 30,
						right: 40,
						left: 0,
						bottom: 10
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="period" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="amountPaid" stroke="#8884d8" activeDot={{ r: 8 }} />
				</LineChart>
			</ResponsiveContainer>
		</>
	);
}
