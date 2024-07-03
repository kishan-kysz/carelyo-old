import React from 'react';
import { Text } from '@mantine/core';

const PieChartTitle = ({ title }) => {
	return title === 'Consultations Gender Distribution' ? (
		<Text align="center" mt={6} weight={700} mb={2}>
			Consultations Gender Distribution
		</Text>
	) : title === 'Consultations Age Distribution' ? (
		<Text align="center" mt={6} weight={700} mb={2}>
			Consultations Age Distribution
		</Text>
	) : title === 'Illness And Gender' ? (
		<Text align="center" mt={6} weight={700} mb={2}>
			Illness And Gender Distribution
		</Text>
	) : title === 'Illness And Age' ? (
		<Text align="center" mt={6} weight={700} mb={2}>
			Illness And Age Distribution
		</Text>
	) : title === 'Illness And Time' ? (
		<Text align="center" mt={6} weight={700} mb={2}>
			Illness And Time Distribution
		</Text>
	) : (
		<Text align="center" mt={1} weight={700} mb={5}>
			Total Values
		</Text>
	);
};

export default PieChartTitle;
