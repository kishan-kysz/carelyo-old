import { React } from 'react';
import { Container } from '@mantine/core';
import { DashGrid } from '../components/home/DashGrid';

function Dashboard() {
	return (
		<Container maw={1920} bg={"#fff"} >
			<DashGrid />
		</Container>
	);
}

export default Dashboard;
