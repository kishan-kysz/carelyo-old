import React from 'react';
import { Select } from '@mantine/core';

const PortalSelectTable = ({ handleChange, classes }) => {
	return (
		<Select
			style={{ marginTop: 5, zIndex: 2 }}
			data={[
				{
					value: 'Current Accepted Consultations Per Doctor',
					label: 'Current Accepted Consultations Per Doctor',
	
				},
				{
					value: 'Consultations Total Time Spent Per Doctor',
					label: 'Consultations Total Time Spent Per Doctor',

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

export default PortalSelectTable;
