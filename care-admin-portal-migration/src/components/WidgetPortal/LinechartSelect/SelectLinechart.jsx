import React from 'react';
import { Select } from '@mantine/core';

const PortalSelectLinechart = ({ handleChange, classes }) => {
	return (
		<Select
			style={{ marginTop: 5, zIndex: 2 }}
			data={['Amount paid for consultations']}
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

export default PortalSelectLinechart;
