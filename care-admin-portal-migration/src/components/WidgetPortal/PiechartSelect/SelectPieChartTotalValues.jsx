import React from 'react';
import { MultiSelect } from '@mantine/core';

const SelectPieChartTotalValues = ({ handleChange, classes }) => {
	return (
		<MultiSelect
			style={{ marginTop: 5, zIndex: 2 }}
			data={[
				{ value: 'Registered Doctors', label: 'Registered Doctors'},
				{ value: 'Total Consultations', label: 'Total Consultations'},
				{ value: 'Total Patients', label: 'Total Patients', group: 'Patient' },
				{ value: 'Ongoing Consultations', label: 'Ongoing Consultations' },
				{ value: 'Accepted Consultations', label: 'Accepted Consultations' },
				{ value: 'Booked Consultations', label: 'Booked Consultations'},
				{ value: 'Finished Consultations', label: 'Finished Consultations'},
				{ value: 'Incoming Consultations', label: 'Incoming Consultations' },
			]}
			maxSelectedValues={5}
			label="What type of data do you want to display?"
			placeholder="Select up to 5"
			clearbuttonlabel="Clear selection"
			clearable
			classNames={classes}
			onChange={handleChange}
			required={true}
		/>
	);
};

export default SelectPieChartTotalValues;
