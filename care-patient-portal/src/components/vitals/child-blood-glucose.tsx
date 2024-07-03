import {
	Accordion,
	ActionIcon,
	Avatar,
	Badge,
	Button,
	Divider,
	Flex,
	Group,
	Image,
	NumberInput,
	Pagination,
	Paper,
	SimpleGrid,
	Slider,
	Space,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { Fragment, useEffect, useState } from 'react';
import styles from '../../assets/styles/components/step.module.css';
import {
	IconCalendar,
	IconHeartbeat,
	IconListSearch,
	IconSearch,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { PATIENT_GLUCOSE } from '../../constants';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { createUTCdateForISO } from '../../utils';
import useVitals from '../../hooks/use-vitals';
import empty from '../../assets/images/empty.svg';
import { showNotification } from '@mantine/notifications';
import { IBloodGlucose, IChildrenResponse } from '../../api/types';
import useChildVitals from '../../hooks/use-child-vitals';

const ChildBloodGlucose = ({ child, data }: { child: IChildrenResponse, data: IBloodGlucose[] }) => {
	const { t } = useTranslation(['default']);
	const { addChildVitals, isLoading } = useChildVitals(child);
	const [opened, setOpened] = useState(false);

	const handleSubmit = async (data: any) => {
		await addChildVitals({
			...data,
			date: createUTCdateForISO(data.bloodGlucose.date),
			childId: child.childId
		});
		showNotification({
			color: 'green',
			title: t('tr.success'),
			message: t('tr.blood-glucose'),
		});
		setOpened(false);
		setQuery(' ');
		form.reset();
	};

	const fixedDate = (date: string) => {
		const myDate =
			Date.parse(date) - new Date().getTimezoneOffset() * 60 * 1000;
		return new Date(myDate).toString().slice(0, 21);
	};

	const [activePage, setPage] = useState(1);
	const [cardPerPage] = useState(3);
	const indexOfLastCard = activePage * cardPerPage;
	const indexOfFirstCard = indexOfLastCard - cardPerPage;
	const [query, setQuery] = useState('');

	const handleBack = () => {
		setOpened(false);
		setQuery(' ');
		form.reset();
	};

	const filteredData = data?.filter((bloodInfo) =>
		fixedDate(bloodInfo.date)
			.slice(4, 16)
			.toLowerCase()
			.toString()
			.includes(query !== 'lid Date' ? query.toLowerCase() : '')
	);

	useEffect(() => {
		if (query.length >= 1) {
			setPage(1);
		}
	}, [query]);

	const pageNumbers = [];
	for (let i = 0; i < Math.ceil(filteredData?.length / cardPerPage); i++) {
		pageNumbers.push(i);
	}

	data
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(indexOfFirstCard, indexOfLastCard);

	const form = useForm({
		initialValues: {
			bloodGlucoseMmolPerL: 0,
			mealTime: '',
			date: '',
		},
		validate: {
			bloodGlucoseMmolPerL: (value) =>
				value < 1 ? t('tr.enter-bglucose') : null,
			date: (value) => (value.length < 1 ? t('tr.select') : null),
			mealTime: (value) => (value.length < 1 ? t('tr.selectmeal') : null),
		},
	});

	return (
		<Fragment>
			<Divider
				my="xs"
				size="sm"
				label={
					<>
						<Text fz={14} fw={500}>
							{t('tr.your-vitals')}
						</Text>
					</>
				}
				labelPosition="center"
			/>
			{!opened && data && data.length > 0 && data.length < 4 && (
				<Group grow={false} position="center">
					<Button radius={5} onClick={() => setOpened(true)}>
						{t('tr.add-vital')}
					</Button>
				</Group>
			)}
			{!opened && data?.length > 3 && (
				<Flex
					mih={50}
					gap="md"
					justify="center"
					align="center"
					direction="row"
					wrap="wrap"
				>
					<Group grow={false} position="center">
						<DatePickerInput
							clearable={true}
							allowDeselect={true}
							label=""
							valueFormat="DD MMM YYYY"
							icon={<IconSearch size="1.4rem" />}
							radius="xl"
							placeholder={`${t('tr.search-by-date')}`}
							onChange={(e) =>
								e
									? setQuery(fixedDate(e.toLocaleDateString()).slice(4, 16))
									: null
							}
							mx="auto"
							w={150}
						/>
						<Button radius={5} size="sm" onClick={() => setOpened(true)}>
							{t('tr.add-vital')}
						</Button>
					</Group>
				</Flex>
			)}

			{!(isLoading || opened) &&
				filteredData
					.map((bloodGlucose) => (
						<Accordion
							key={bloodGlucose.id}
							variant="contained"
							radius="md"
							mt={20}
							sx={(theme) => ({
								backgroundColor:
									theme.colorScheme === 'dark'
										? theme.colors.dark[7]
										: theme.white,
								transition: 'transform 200ms ease, box-shadow 100ms ease',
								borderRadius: '10px',
								'&:hover': {
									boxShadow: theme.shadows.md,
									transform: 'scale(1.0001)',
									borderRadius: '10px',
									'&::before': {
										borderRadius: '25px 0 0 25px',
										content: '""',
										position: 'absolute',
										top: 0,
										bottom: 0,
										left: 0,
										width: 6,
										backgroundImage: theme.fn.linearGradient(
											2,
											theme.colors.teal[9],
											theme.colors.teal[5]
										),
									},
								},
							})}
						>
							<Accordion.Item value="vitals" mb={15}>
								<Accordion.Control px={10}>
									<Flex
										justify="space-between"
										align="center"
										mb={10}
										direction="row"
										wrap="wrap"
									>
										<Flex justify="center" align="center">
											<ActionIcon variant="transparent" color="teal.8" mr={5}>
												<IconHeartbeat size={30} />
											</ActionIcon>
											<Text fw={500} mr={5}>
												{t('tr.vitals')}
												<Text color="dimmed" size="xs">
													{t('tr.bglucose')}
												</Text>
											</Text>
										</Flex>
										<Text ta={'center'} fz={12}>
											{t('tr.added-date')}
											<br />
											<Badge color="teal.7" variant="outline" size="md">
												{fixedDate(bloodGlucose.date).slice(4, 16)}
											</Badge>
										</Text>
									</Flex>
								</Accordion.Control>
								<Accordion.Panel>
									<Paper
										shadow="xs"
										radius="md"
										p="xs"
										mb={15}
										withBorder={true}
									>
										<SimpleGrid
											cols={2}
											spacing="md"
											breakpoints={[{ maxWidth: 800, cols: 1, spacing: 'sm' }]}
										>
											<div>
												<TextInput
													readOnly={true}
													mb={'sm'}
													label={
														<>
															<Text mb={5}>
																{t('tr.glucose-level')}{' '}
																<Badge color="cyan.9" size="sm" radius="lg">
																	100 - 125 mg/dL
																</Badge>
															</Text>
														</>
													}
													value={`${bloodGlucose.bloodGlucoseMmolPerL} mg/dL`}
												/>
											</div>
											<div>
												<TextInput
													readOnly={true}
													label={
														<>
															<Text mb={5}>{t('tr.meal-time')}</Text>
														</>
													}
													icon={<IconCalendar size={16} />}
													value={fixedDate(bloodGlucose.mealTime)}
												/>
											</div>
											<div>
												<TextInput
													readOnly={true}
													label={
														<>
															<Text mb={5}>{t('tr.added-dateandtime')}</Text>
														</>
													}
													icon={<IconCalendar size={16} />}
													value={fixedDate(bloodGlucose.date)}
												/>
											</div>
										</SimpleGrid>
									</Paper>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					))
					?.slice(indexOfFirstCard, indexOfLastCard)}

			{!(isLoading || opened) && data?.length === 0 && (
				<Flex mt="3rem" direction="column" align="center" justify="center">
					<Image src={empty} style={{ width: 200, marginBottom: 20 }} />
					<Text align="center" mb={30} weight={700} size={20} color="gray.7">
						{t('tr.no-gg')}
						<Text>{t('tr.addyour-data')}</Text>
					</Text>
					<Group grow={false} position="center">
						<Button onClick={() => setOpened(true)} mt={30}>
							{t('tr.addblood-glucose')}
						</Button>
					</Group>
				</Flex>
			)}

			{!(isLoading || opened || data.length === 0) &&
				filteredData?.length === 0 && (
					<Flex mt="2.5rem" direction="column" align="center" justify="center">
						<Avatar size="xl" color="red" radius={50} my={30}>
							<IconListSearch size="4rem" />
						</Avatar>
						<Text align="center" mb={30} weight={500} size={20} color="gray.7">
							{t('tr.no-gg')}
							<Text>{t('tr.pick')}</Text>
						</Text>
					</Flex>
				)}

			{!opened && filteredData?.length > 3 ? (
				<Pagination
					mt={50}
					mb={30}
					m={20}
					position="center"
					noWrap={false}
					withEdges={true}
					value={activePage}
					onChange={setPage}
					total={pageNumbers.length}
				/>
			) : null}

			{opened && (
				<Fragment>
					<form
						onSubmit={form.onSubmit((values) =>
							handleSubmit({ bloodGlucose: values })
						)}
					>
						<div style={{ margin: '0 auto' }}>
							<h1 style={{ margin: '1rem' }} className={styles.title}>
								{t('tr.addblood-glucose')}
							</h1>
						</div>
						<Paper shadow="xs" radius="md" p="xs" mb={15} withBorder={true}>
							<Flex
								justify="space-between"
								align="center"
								mb={10}
								direction="row"
								wrap="wrap"
							>
								<Flex justify="center" align="center">
									<ActionIcon variant="light" color="teal.8" mr={5}>
										<IconHeartbeat size={30} />
									</ActionIcon>
									<Title order={5} mr={5}>
										{t('tr.bglucose')}
									</Title>
								</Flex>
							</Flex>

							<Paper shadow="xs" radius="md" p="xs" mb={15} withBorder={true}>
								<SimpleGrid
									cols={2}
									spacing="xl"
									breakpoints={[{ maxWidth: 800, cols: 1, spacing: 'sm' }]}
								>
									<div>
										<NumberInput
											label={
												<>
													<Text mb={5}>
														{t('tr.glucose-level')}{' '}
														<Badge color="cyan.9" size="sm" radius="lg">
															100 - 125 mg/dL{' '}
														</Badge>
													</Text>
												</>
											}
											min={0}
											max={250}
											placeholder="Enter your glucose level"
											{...form.getInputProps('bloodGlucoseMmolPerL')}
										/>
										<Space h="xs" />
										<Slider
											px={5}
											label={(value) => `${value} mg`}
											min={0}
											mb={'xl'}
											max={250}
											marks={PATIENT_GLUCOSE}
											{...form.getInputProps('bloodGlucoseMmolPerL')}
										/>
									</div>
									<div>
										<DateTimePicker
											clearable={true}
											valueFormat="DD MMM YYYY hh:mm A"
											placeholder={`${t('tr.pickmealdateandtime')}`}
											maxDate={new Date()}
											mx="auto"
											label={
												<>
													<Text mb={5}>{t('tr.meal-time')}</Text>
												</>
											}
											icon={<IconCalendar size={16} />}
											{...form.getInputProps('mealTime')}
										/>
									</div>
									<div>
										<DateTimePicker
											clearable={true}
											valueFormat="DD MMM YYYY hh:mm A"
											placeholder={`${t('tr.pickdateandtime')}`}
											maxDate={new Date()}
											mx="auto"
											label={
												<>
													<Text mb={5}>{t('tr.added-dateandtime')}</Text>
												</>
											}
											icon={<IconCalendar size={16} />}
											{...form.getInputProps('date')}
										/>
									</div>
								</SimpleGrid>
							</Paper>
							<Group position="center" my="xl">
								<Button variant="default" onClick={handleBack}>
									{t('tr.back')}
								</Button>
								<Button loading={isLoading} type="submit">
									{t('tr.save')}
								</Button>
							</Group>
						</Paper>
					</form>
				</Fragment>
			)}
		</Fragment>
	);
};

export default ChildBloodGlucose;
