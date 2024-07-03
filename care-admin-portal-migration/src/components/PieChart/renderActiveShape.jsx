import React from 'react';
import { Sector } from 'recharts';
import { ColorArr } from '../styles/ColorArr';

export const COLORS = ColorArr();

const RADIAN = Math.PI / 180;
export const renderActiveShape = (props) => {
	const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';

	return (
		<g>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
				opacity={0.85}
			/>
			<Sector
				cx={cx - 1}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 5}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>

			<text x={cx + 1} y={cy} dy={15} textAnchor="middle" fill="#999">
				{percent > 0 ? `(${(percent * 100).toFixed(2)}%)` : null}
			</text>

			<text x={cx} y={cy} dy={-2} textAnchor="middle" fill={fill}>
				{payload.value || payload.quantity || payload.numberOfConsultations || payload.percentage || payload.count}
			</text>
		</g>
	);
};
