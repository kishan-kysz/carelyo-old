import { Table, CloseButton, ScrollArea, Box, Loader, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { IconDatabaseOff } from '@tabler/icons-react';
import { createStyles } from '@mantine/styles';
const useStyles = createStyles((theme) => ({
	header: {
		position: 'sticky',
		top: 0,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		transition: 'box-shadow 150ms ease',

		'&::after': {
			content: '""',
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`
		}
	},

	scrolled: {
		boxShadow: theme.shadows.sm
	},
	table: {
	
		fontWeight: 600,
		borderBottom: theme.colorScheme === 'light' ? '1px solid #b4ece5' : '1px solid rgba(180,236,228,.3)',
		boxShadow: '0 0 10px 0 rgba(0,0,0,0.1)',
		borderRadius: 6,
		'&:hover': {
			boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)'
		}
	}
}));
const AcceptedPerDoctorTable = ({
	acceptingDoctorsResponseMetrics,
	onRemove,
	totalCompletedConsultationTimePerDoctorMetrics,
	title
}) => {
	const { classes, cx } = useStyles();
	const [objects, setObjects] = useState([]);
	const [tableTitle, setTableTitle] = useState('');
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		setTableTitle(title);
		title && title === 'Current Accepted Consultations Per Doctor'
			? setObjects(acceptingDoctorsResponseMetrics?.sort((a, b) => a.userId - b.userId))
			: setObjects(totalCompletedConsultationTimePerDoctorMetrics?.sort((a, b) => a.userId - b.userId));
	}, [acceptingDoctorsResponseMetrics, totalCompletedConsultationTimePerDoctorMetrics, title]);

	const rows = objects?.map((obj) => {
		let random = Math.floor(Math.random() * 10000000);
		if (title === 'Current Accepted Consultations Per Doctor') {
			return (
				<tr key={obj.userId + obj.email + random}>
					<td>{obj.userId}</td>
					<td>
						{obj.firstName} {obj.lastName}
					</td>
					<td>{obj.email}</td>
				</tr>
			);
		} else if (title === 'Consultations Total Time Spent Per Doctor') {
			return (
				<tr key={obj.userId + obj.email}>
					<td>{obj.userId}</td>
					<td>
						{obj.firstName} {obj.lastName}
					</td>
					<td>{obj.email}</td>
					<td>{obj.days}</td>
					<td>
						{obj.hours}:{obj.minutes}:{obj.seconds}
					</td>
				</tr>
			);
		}
	});

	return (
		<div style={{ height: 'inherit', overflow: 'hidden' }}> 
			<ScrollArea h={'inherit'} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} mr={2} ml={2}>
				<CloseButton aria-label='Close modal' onClick={onRemove} style={{ position: 'absolute', top: 2, left: 2, }} />
				<Text style={{ fontWeight: 600, textAlign: 'center', marginBottom: 5 }}>{title}</Text>

				<Table highlightOnHover withColumnBorders  fontSize='xs' striped className={classes.table}>
					<thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
						<tr>
							<th>Id</th>
							<th>Name</th>
							<th>Email</th>
							{tableTitle === 'Consultations Total Time Spent Per Doctor' ? <th>Days</th> : null}
							{tableTitle === 'Consultations Total Time Spent Per Doctor' ? <th>Hours/Minutes/Seconds</th> : null}
						</tr>
					</thead>
					{objects < 0 ? null : <tbody>{rows}</tbody>}
				</Table>
				{!objects ? (
					<Box mt={50} style={{ display: 'flex', justifyContent: 'center' }}>
						<IconDatabaseOff /> Nothing here just yet... <Loader size='sm' ml={5} />
					</Box>
				) : null}
			</ScrollArea>
		</div>
	);
};

export default AcceptedPerDoctorTable;
