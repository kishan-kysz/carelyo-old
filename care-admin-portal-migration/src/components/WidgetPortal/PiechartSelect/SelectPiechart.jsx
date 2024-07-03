import React from 'react';
import { Select } from '@mantine/core';

const PortalSelectPiechart = ({ classes, handleSelectedChildType }) => {
	return (
		<Select
			style={{ marginTop: 5, zIndex: 2 }}
			data={[
				{ value: 'Total values', label: 'Total Values' },
				{
					value: 'Consultations Gender Distribution',
					label: 'Consultations Gender Distribution',
				},
				{
					value: 'Consultations Age Distribution',
					label: 'Consultations Age Distribution',
				},
				{
					value: 'Illness And Gender',
					label: 'Illness And Gender',
				},
				{
					value: 'Illness And Time',
					label: 'Illness And Time',
				},
				{
					value: 'Illness And Age',
					label: 'Illness And Age',
				}
			]}
			label='What type of data do you want to display?'
			placeholder='Select one'
			clearbuttonlabel='Clear selection'
			clearable
			classNames={classes}
			onChange={handleSelectedChildType}
			required={true}
		/>
	);
};

export default PortalSelectPiechart;
