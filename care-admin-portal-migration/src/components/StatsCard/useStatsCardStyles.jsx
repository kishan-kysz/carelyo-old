import { createStyles } from '@mantine/styles';

export const useStatsCardStyles = createStyles((theme) => ({
	item: {
		boxShadow: '-.700rem .400rem 1rem -0.90rem rgba(0,191,166,.7)',

	
		fontWeight: 'bold',
	
		height: 'inherit',
		transition: 'box-shadow 0.2s linear',

		'&:hover': {
			cursor: 'grab',
		}
	},
	value: {
		fontSize: 24,
		fontWeight: 600
	},
	title: {
		fontWeight: 700,
		textTransform: 'uppercase'
	},
	group: {
		displayDirection: 'column'
	}
}));
