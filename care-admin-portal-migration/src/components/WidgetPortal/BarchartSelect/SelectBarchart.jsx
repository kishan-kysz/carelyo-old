import React from 'react';
import { Select } from '@mantine/core';

const PortalSelectBarchart = ({ classes, handleChange }) => {
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

				},
				{
					value: 'Illness And Age',
					label: 'Illness And Age',

				},
				{
					value: 'Illness And Time',
					label: 'Illness And Time',

				},
				{
					value: 'Illness And Gender',
					label: 'Illness And Gender',
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

export default PortalSelectBarchart;
