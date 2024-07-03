import React from 'react';
import { Select } from '@mantine/core';

const PortalSelectAreaChart = ({ classes, handleChange }) => {
	return (
		<Select
			style={{ marginTop: 5, zIndex: 2 }}
			data={[
				{
					value: 'Consultations Over Time',
					label: 'Consultations Over Time',
		
				},
				{
					value: 'Consultations Age Distribution',
					label: 'Consultations Age Distribution',
				
				}
			]}
			label="What type of data do you want to display?"
			placeholder="Select one"
			clearbuttonlabel="Clear selection"
			clearable
			classNames={classes}
			onChange={handleChange}
			required={true}
		/>
	);
};

export default PortalSelectAreaChart;
