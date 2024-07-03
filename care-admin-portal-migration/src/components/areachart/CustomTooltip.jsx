import { Text, useMantineColorScheme,Box } from '@mantine/core';

export function CustomTooltip({ active, payload, label }) {
	const { colorScheme } = useMantineColorScheme();
	if (active && payload) {
		return (
			<Box
				w='100%'
				h='auto'
				sx={{
					borderRadius: '0.25rem',
					background: '#26313c',
					color: '#fff',
					padding: 10,
					boxShadow:
						colorScheme === 'light'
							? '15px 17px 11px -4px rgba(0,0,0,0.30), 2px 2px 2px 0px rgba(3,186,98,0.8) inset'
							: '15px 17px 11px -4px rgba(0,0,0,0.33), 1px 1px 3px 0px rgba(3,186,98,0.6) inset',
					textAlign: 'center',
					fontWeight: 600
				}}
			>
				{payload[0]?.name === 'Consultations' && <Text>Date: {label}</Text>}
				{payload[0]?.name === 'Consultations' && <Text>Consultations: {payload[0]?.value}</Text>}
				{payload[0]?.name === 'numberOfConsultations' && <Text>Consultations: {payload[0]?.value}</Text>}
				{payload[0]?.name === 'numberOfConsultations' && <Text>Ages: {label}</Text>}
				{payload[0]?.name === 'Consultations Age Distribution' && <Text>Consultations: {payload[0]?.value}</Text>}
				{payload[0]?.name === 'Consultations Age Distribution' && <Text>Ages: {label}</Text>}
				{payload[0]?.name === 'data' && <Text>Consultations: {payload[0]?.value}</Text>}
				{payload[0]?.payload?.avgdata && <Text>Average: {payload[0]?.payload?.avgdata}</Text>}
				{payload[0]?.name === 'Illness And Age Distribution' && <Text>Age: {payload[0]?.payload?.age}</Text>}
				{payload[0]?.name === 'Illness And Age Distribution' && <Text>Amount: {payload[0]?.payload?.count}</Text>}
				{payload[0]?.name === 'Illness And Gender Distribution' && <Text>Gender: {payload[0]?.payload?.gender}</Text>}
				{payload[0]?.name === 'Illness And Gender Distribution' && <Text>Amount: {payload[0]?.payload?.count}</Text>}
				{payload[0]?.name === 'Illness And Time Distribution' && <Text>Time: {payload[0]?.payload?.time}</Text>}
				{payload[0]?.name === 'Illness And Time Distribution' && <Text>Amount: {payload[0]?.payload?.count}</Text>}
			</Box>
		);
	}
	return null;
}
