import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CloseButton, Text } from '@mantine/core';
import {CustomTooltip} from '../areachart/CustomTooltip';
const BarchartAge = ({ onRemove, ageMetrics, CustomizedLabel, COLORS, colorScheme }) => {
	return (
		<>
			<Text align='center' mt={5} weight={700}>
				Consultation Age Distribution
			</Text>
			<CloseButton aria-label='Close modal' onClick={onRemove} style={{ position: 'absolute', top: 2, left: 2 }} />
			<ResponsiveContainer width='100%' height='90%'>
				<BarChart
					width={500}
					height={300}
					data={ageMetrics.sort((a, b) => (a.ageSpan > b.ageSpan ? 1 : -1))}
					barGap={-30}
					margin={{
						top: 30,
						right: 30,
						left: 4,
						bottom: 10
					}}
				>
					<CartesianGrid strokeDasharray={colorScheme === 'light' ? '3 3' : '0.5 3'} />
					<XAxis dataKey='ageSpan' label={{ value: 'Ages', position: 'insideBottom', offset: -4 }} />
					<YAxis
						dataKey='numberOfConsultations'
						axisLine={false}
						tickLine={false}
						tickCount={28}
						label={{ value: 'Consultations', angle: -90, position: 'insideLeft' }}
					/>
					<Tooltip
						content={<CustomTooltip />}
						position={{ y: 10 }}
						cursor={{ fillOpacity: 0.1, fill: 'rgba(3,186,98,1)' }}
					/>

					<Bar
						dataKey='numberOfConsultations'
						name='Consultations Age Distribution'
						barSize={30}
						label={<CustomizedLabel />}
						isAnimationActive={false}
					>
						{ageMetrics?.map((entry, index) => {
							return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
						})}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</>
	);
};

export default BarchartAge;
