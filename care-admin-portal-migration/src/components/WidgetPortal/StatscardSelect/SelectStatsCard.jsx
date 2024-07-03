import React from 'react';
import { Select } from '@mantine/core';

const WidgetPortalSelectType = ({ handleChange, classes }) => {
	const data = [
		{ value: 'Registered Doctors', label: 'Registered Doctors'},
		{ value: 'Total Consultations', label: 'Total Consultations' },
		{ value: 'Total Patients', label: 'Total Patients' },
		{ value: 'Monthly Revenue', label: 'Monthly Revenue'},
		{ value: 'Incoming Consultations', label: 'Incoming Consultations' },
		{ value: 'Booked Consultations', label: 'Booked Consultations' },
		{ value: 'Accepted Consultations', label: 'Accepted Consultations' },
		{ value: 'Ongoing Consultations', label: 'Ongoing Consultations'},
		{ value: 'Finished Consultations', label: 'Finished Consultations'},
		{ value: 'Consultations Rating Distribution', label: 'Average Rating Consultations' }
	  ];
	return (
		<Select
			style={{ marginTop: 5, zIndex: 2 }}
			data={data}
			label="What type of data do you want to display?"
			placeholder="Select one"
			clearbuttonlabel="Clear selection"
			classNames={classes}
			onChange={handleChange}
			required={true}
		/>
	);
};

export default WidgetPortalSelectType;
