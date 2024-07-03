import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMetricsStartDateEndDate, useMetricsStartDateEndDatePeriod } from '../../helper/hooks/useMetrics';
import { Group, Card, Text, CloseButton, Loader, Progress } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

import useStatsCard from '../../helper/hooks/useStatsCard';
import { icons } from './icons';
import { useStatsCardStyles } from './useStatsCardStyles';

const StatsCard = ({ stats, title, onRemove, monthlyGoal }) => {
	const { classes } = useStatsCardStyles();
	const [cardStats, setCardStats] = useState(stats);
	const [revenuePaid, setRevenuePaid] = useState(0);
	const Icon = icons[title];

  const dateToday = useMemo(() => {
    return new Date();
  }, []); // Using empty dependency array to prevent recalculation

  const paddedMonth = useMemo(() => {
    return dateToday.getMonth() + 1 < 10 ? `0${dateToday.getMonth()}` : `${dateToday.getMonth()}`;
  }, [dateToday]);
const handleRemove = useCallback(() => {
  onRemove();
}, [onRemove]);
  const endMonth = useMemo(() => {
    return dateToday.getMonth() + 1 < 10 ? `0${dateToday.getMonth() + 1}` : `${dateToday.getMonth() + 2}`;
  }, [dateToday]);

  const startDate = useMemo(() => {
    return new Date(`${dateToday.getFullYear()}-01-01T00:00:00.000+00:00`);
  }, [dateToday]);

  const endDate = useMemo(() => {
    return new Date(`${dateToday.getFullYear()}-12-31T00:00:00.000+00:00`);
  }, [dateToday]);
	const { consultationsMetrics } = useMetricsStartDateEndDate(startDate, endDate);
	const { amountPaidForConsultationsOverTimeMetrics } = useMetricsStartDateEndDatePeriod(startDate, endDate, 'Month');
	const {
		consultationdifference,
		revenueDifference,
		arrow,
		revenueArrow,
		consultationValueLastMonth,
		revenueValueLastMonth
	} = useStatsCard({
		consultationsMetrics,
		amountPaidForConsultationsOverTimeMetrics,
		startDate,
		endDate,
		paddedMonth,
		endMonth,
		stats
	});
	const DiffIcon = arrow ? IconArrowUpRight : IconArrowDownRight;
	const RevenueDiffIcon = revenueArrow ? IconArrowUpRight : IconArrowDownRight;
	useEffect(() => {
    setCardStats(stats);
    setRevenuePaid(
        amountPaidForConsultationsOverTimeMetrics?.reduce((total, item) => {
            if (item.period.substring(5, 7) === endMonth) {
                return total + item.amountPaid;
            } else {
                return total;
            }
        }, 0)
    );
}, [consultationsMetrics, amountPaidForConsultationsOverTimeMetrics, stats, endMonth, startDate, endDate, paddedMonth, dateToday]);
	return (
		<Card className={classes.item} bg="#f2f5f8" style={{ border: "1px solid #eee"}} >
			<Group position="apart" ml={10} mt={-13} >
<CloseButton aria-label="Close modal" onClick={handleRemove} style={{ position: 'absolute', top: 0, right: 0 }} />
				<Text className={classes.title} size="xl" ml={-10}>
					{title}
				</Text>
				{Icon && <Icon size={22} stroke={1.5} />}
			</Group>

			{title !== 'Monthly Revenue' ? (
				<Group spacing="xs" className={classes.group} >
					<Text className={classes.value}>{cardStats || 0}</Text>
					{title === 'Total Consultations' && consultationdifference ? (
						<Group>
							<Text size="md" weight={600} color={consultationdifference > 0 ? 'green' : 'red'}>
								<span>{consultationdifference?.toFixed(1) > 0 ? consultationdifference?.toFixed(1) : 0}%</span>
								<DiffIcon size={16} stroke={1.5} />
							</Text>
							<Text size="sm" color="dimmed">
								Compared to previous month: {consultationValueLastMonth > 0 ? consultationValueLastMonth : 0}
							</Text>
						</Group>
					) : null}
					{monthlyGoal > 0 ? (
						<Group align="center" mt={4}>
							<Text size="md" transform="uppercase" weight={700} color="dimmed" mt={-4}>
								Monthly goal
							</Text>

							<Text size="md" weight={600} mt={-4}>
								{!Number.isNaN(parseFloat(cardStats)) && cardStats >= 10000
									? `${cardStats}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
									: `${cardStats}`}
								/
								{!Number.isNaN(parseFloat(monthlyGoal)) && monthlyGoal >= 10000
									? `${monthlyGoal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
									: `${monthlyGoal}`}
							</Text>
						</Group>
					) : null}
				</Group>
			) : title === 'Monthly Revenue' ? (
				<Group spacing="xs" className={classes.group} >
					<Text className={classes.value}>{revenuePaid}</Text>
					{revenueDifference ? (
						<Group>
							<Text size="md" weight={600} color={revenueDifference > 0 ? 'green' : 'red'}>
								<span >{revenueDifference?.toFixed(1)}%</span>
								<RevenueDiffIcon size={16} stroke={1.5} />
							</Text>
							<Text size="md" >
								Compared to previous month: {revenueValueLastMonth}
							</Text>
						</Group>
					) : null}

					{monthlyGoal > 0 ? (
						<Group align="center" mt={4}>
							<Text size="md" transform="uppercase" weight={700} color="dimmed" mt={-4}>
								Monthly goal
							</Text>

							<Text size="lg" weight={600} mt={-4}>
								{!Number.isNaN(parseFloat(revenuePaid)) && revenuePaid >= 10000
									? `${revenuePaid}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
									: !Number.isNaN(parseFloat(revenuePaid))
									? `${revenuePaid}`
									: 0}
								/
								{!Number.isNaN(parseFloat(monthlyGoal)) && monthlyGoal >= 10000
									? `${monthlyGoal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
									: `${monthlyGoal}`}
							</Text>
						</Group>
					) : null}
				</Group>
			) : (
				<>
					<Loader size="md" align="center" pt={10} />
					<Text size="xs" align="center" color="dimmed" pt={2}>
						Loading...
					</Text>
				</>
			)}
			{monthlyGoal > 0 && title === 'Monthly Revenue' ? (
				<>
					<Progress
						value={(100 * revenuePaid) / monthlyGoal}
						size="lg"
						radius="xl"
					
					/>
					{revenuePaid >= monthlyGoal ? (
						<Text size="xs" align="center" color="green" pt={2}>
							{' '}
							Goal Achieved{' '}
						</Text>
					) : null}
				</>
			) : monthlyGoal > 0 ? (
				<>
					<Progress
						value={(100 * cardStats) / monthlyGoal}
						size="lg"
						radius="xl"
					
					/>
					{cardStats >= monthlyGoal ? (
						<Text size="xs" align="center" color="green" pt={2}>
							{' '}
							Goal Achieved{' '}
						</Text>
					) : null}
				</>
			) : null}
		</Card>
	);
};

export default StatsCard;
