import React from 'react';
import { useState, useEffect } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CloseButton, Select, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {CustomTooltip} from '../areachart/CustomTooltip';
const BarChartConsultationMetrics = ({
	onRemove,
	handleChange,
	selectData,
	handleAveragesChange,
	handleDateRangeChange,
	arr,
	CustomizedLabel,
	COLORS,
	colorScheme
}) => {
	const [isClient, setIsClient] = useState(false)
	return (
		<>
			<Text align='center' mt={5} weight={700}>
				Consultation Metrics
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
				/>
				<DatePickerInput
					label=''
					placeholder='Select consultation dates'
					style={{ width: '48%' }}
					onChange={handleDateRangeChange}
				/>
			</div>

			<ResponsiveContainer width='100%' height='80%'>
				<BarChart 
					width={500}
					height={300}
					data={arr}
					barGap={-30}
					margin={{
						top: 30,
						right: 30,
						left: 4,
						bottom: 10
					}}
				>
					<CartesianGrid strokeDasharray={colorScheme === 'light' ? '3 3' : '0.5 3'} />
					<XAxis dataKey='name' label={{ value: 'Period', position: 'insideBottom', offset: -4 }} />
					<YAxis
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

					<Bar dataKey='data' name='Consultations' barSize={30}  label={<CustomizedLabel />} >
						{arr?.map((entry, index) => {
							const color = COLORS[index % COLORS.length];

							return <Cell key={`cell-${index}`} fill={color} />;
						})}
					</Bar>
					<Bar dataKey='avgdata' name='Average' barSize={30}>
						{arr?.map((entry, index) => {
							const color = COLORS[index % COLORS.length];

							return <Cell key={`cell-${index}`} fill={color} />;
						})}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		
		</>
	);
};

export default BarChartConsultationMetrics;
