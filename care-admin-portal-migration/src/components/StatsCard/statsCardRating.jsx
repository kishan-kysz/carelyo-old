import React, { useState, useEffect } from 'react';
import { Group, Card, Text, CloseButton, Box, RingProgress, Divider, useMantineColorScheme } from '@mantine/core';
import { icons } from './icons';
import { useStatsCardStyles } from './useStatsCardStyles';
import { IconMoodSmile } from '@tabler/icons-react';

const StatsCardRating = ({ title, onRemove, consultationsRatings }) => {
	const { classes } = useStatsCardStyles();
	const { colorScheme } = useMantineColorScheme();

	const Icon = icons[title];

	const [calculateRating, setCalculateRating] = useState(
		consultationsRatings?.map((item) => {
			return item?.rating === 'null' ? 0 : item?.rating;
		})
	);
	const [averageConsultationRatings, setAverageConsultationRatings] = useState(0);

	useEffect(() => {
		calculateRating > 0
			? setAverageConsultationRatings(calculateRating?.reduce((a, b) => a + b, 0) / consultationsRatings?.length)
			: setAverageConsultationRatings(0);
	}, [averageConsultationRatings, calculateRating, consultationsRatings]);

	useEffect(() => {
		setCalculateRating(
			consultationsRatings?.map((item) => {
				return item?.rating === 'null' ? 0 : item?.rating;
			})
		);
	}, [consultationsRatings]);

	return (
		<Card className={classes.item}>
			<Group position="center" ml={10} mt={-13}>
				<CloseButton aria-label="Close modal" onClick={onRemove} style={{ position: 'absolute', top: 0, left: 0 }} />
				<Text className={classes.title} size="sm" ml={5}>
					Consultations Average Rating
				</Text>
				{Icon && <Icon size={22} stroke={1.5} />}
			</Group>

			<Divider />
			<Group >
				<RingProgress
					size={250}
					thickness={25}
					sections={[
						{
							value: averageConsultationRatings > 0 ? averageConsultationRatings * 10 : 50,
							color:
								averageConsultationRatings > 0
									? '#25cbac'
									: colorScheme === 'light'
									? 'rgba(0,0,0,0.15)'
									: 'rgba(255,255,255,0.15)',
							tooltip: averageConsultationRatings > 0 ? averageConsultationRatings?.toFixed(1) : 'No Ratings',
							strokeOpacity: 0.8
						},
						{
							value: averageConsultationRatings > 0 ? 100 - averageConsultationRatings * 10 : 50,
							color: colorScheme === 'light' ? '#f8f8f8' : '#1e1e1e'
						}
					]}
					
					label={
						<Text
							color="#25cbac"
							weight={100}
							align="center"
							size="xl"
							
						>
							<IconMoodSmile size={60} stroke={2} />
						</Text>
					}
				/>

				<Box
					sx={(theme) => ({
						width: '60%',
						position: 'absolute',
						marginTop: '17%',
						borderRadius: theme.radius.xl,
						height: '25%',
						backgroundColor: '#0541b1',
						border: '2px solid #25cbac'
					})}
				>
					<Group position='apart' ml={39} mr={38} mt={2} mb={-15}>
						<Text size="sm" color="white" opacity={0.7}>
							0
						</Text>
						<Text size="sm" color="white" opacity={0.7}>
							5
						</Text>
					</Group>

					<Group position='center'>
						<Text color="#25cbac" weight={700} size={28}>
							{averageConsultationRatings?.toFixed(2)}
						</Text>
					</Group>
					<Group position='center'>
						<Text size='xs' color='white' opacity={0.8} weight={100}>
							Average Rating
						</Text>
					</Group>
				</Box>
			</Group>
		</Card>
	);
};

export default StatsCardRating;
