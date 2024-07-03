import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid } from 'recharts';
import { Text, CloseButton } from '@mantine/core';
import { CustomTooltip } from './CustomTooltip';

const AreaChartAges = ({ title, ageMetrics, onRemove, colorScheme }) => {
	return (
		<>
			<Text align='center' mt={5} weight={700}>
				{title}
			</Text>
			<CloseButton aria-label='Close modal' onClick={onRemove} style={{ position: 'absolute', top: 2, left: 2 }} />
			<ResponsiveContainer width="98%" height='85%'>
				<AreaChart
					data={ageMetrics?.sort((a, b) => (a.ageSpan > b.ageSpan ? 1 : -1))}
					margin={{
						top: 30,
						right: 30,
						left: 5,
						bottom: 10
					}}
				>
					<defs>
						<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#2598fd" stopOpacity={0.7} />
							<stop offset="85%" stopColor="#00c49f" stopOpacity={0.3} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray={colorScheme === 'light' ? '3 3' : '0.5 3'} />
					<Area dataKey="numberOfConsultations" stroke="#2451B7" fill="url(#color)" />

					<XAxis dataKey="ageSpan" label={{ value: 'Ages', position: 'insideBottom', offset: -2 }} />

					<YAxis
						datakey="numberOfConsultations"
						axisLine={false}
						tickLine={false}
						tickCount={8}
						label={{ value: 'Consultations', angle: -90, position: 'insideLeft' }}
					/>

					<Tooltip content={<CustomTooltip />} position={{ y: 10 }} />

					<CartesianGrid opacity={0.1} vertical={false} />
				</AreaChart>
			</ResponsiveContainer>
		</>
	);
};

export default AreaChartAges;
