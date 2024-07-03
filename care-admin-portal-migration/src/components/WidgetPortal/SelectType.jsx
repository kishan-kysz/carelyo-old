import React from 'react';
import { Select } from '@mantine/core';

const WidgetPortalSelectType = ({ handleSelect, classes }) => {
	const data =['Stats card', 'Linechart', 'Piechart', 'Areachart', 'Barchart', 'Table'];
	return (
		<Select
		size="md"
		mt="md"
			data={data}
			placeholder="Select one"
			label="Choose what type of Widget you want to add"
			classNames={classes}
			onChange={handleSelect}
			required={true}
		clearbuttonlabel="Clear selection"
		/>
	);
};

export default WidgetPortalSelectType;
