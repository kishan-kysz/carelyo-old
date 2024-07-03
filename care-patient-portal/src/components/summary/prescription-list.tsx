import {
	Avatar,
	Button,
	Card,
	Flex,
	Group,
	Image,
	Input,
	Pagination,
	Text,
	Title
} from '@mantine/core';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import empty from '../../assets/images/empty.svg';
import Container from '../layout/container';
import { IconCalendar, IconListSearch, IconSearch } from '@tabler/icons-react';
import PageTitle from '../core/page-title';
import { useTranslation } from 'react-i18next';
import usePrescriptions from '../../hooks/use-prescriptions';
import { DatePickerInput } from '@mantine/dates';
import { getPath } from '../../pages/navigation';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { BsPrescription } from 'react-icons/bs';
const PrescriptionList = () => {
	const { prescriptions: data, prescriptionsLoading } = usePrescriptions();
	const [searchData, setSearchData] = useState<string>('');
	const [datePickerData, setDatePickerData] = useState<Date | null>(null);
	const [query, setQuery] = useState<string>('');
	const { t } = useTranslation(['default']);

	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString('en-GB', {
			year: 'numeric',
			weekday: 'short',
			day: 'numeric',
			month: 'numeric',
		});
	};

	const [activePage, setPage] = useState(1);
	const [cardPerPage] = useState(3);
	const indexOfLastCard = activePage * cardPerPage;
	const indexOfFirstCard = indexOfLastCard - cardPerPage;

	data
		?.sort(
			(a, b) =>
				new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
		)
		.slice(indexOfFirstCard, indexOfLastCard);

	const filteredData = data?.filter((consultation) =>
		(consultation?.medicationName + formatDate(consultation?.issueDate))
			.toLowerCase()
			.toString()
			.includes(query.toLocaleLowerCase())
	);
	useEffect(() => {
		if (query.length >= 1) {
			setPage(1);
		}
	}, [query]);

	const pageNumbers = [];
	for (
		let i = 0;
		i < Math.ceil(filteredData ? filteredData?.length / cardPerPage : 1);
		i++
	) {
		pageNumbers.push(i);
	}

	const handleSearchQuery = (data: string) => {
		setQuery(data);
		setDatePickerData(null);
		setSearchData(data);
	};
	const handleDateInputQuery = (data: Date) => {
		if (data === null) {
			setDatePickerData(null);
			setQuery('');
		} else {
			setQuery(formatDate(data));
			setDatePickerData(data);
			setSearchData('');
		}
	};

	return (
		<>
			<Container>
				<PageTitle
					heading={`${t('tr.prescriptions-history')}`}
				/>
				{!prescriptionsLoading && data && data?.length > cardPerPage && (
					<Flex
						mih={70}
						gap="xs"
						justify="center"
						align="center"
						direction="row"
						wrap="wrap"
						w="900"
					>
						<Input
							icon={<IconSearch size={18} />}
							placeholder="Search"
							value={searchData}
							onChange={(e) => handleSearchQuery(e.target.value)}
							radius="xl"
							maw={170}
						/>
						<DatePickerInput
							clearable={true}
							allowDeselect={true}
							icon={<IconCalendar size={18} />}
							placeholder="Pick Date"
							value={datePickerData}
							onChange={(e: Date) => handleDateInputQuery(e)}
							valueFormat="DD MMM YYYY"
							mx="auto"
							radius="xl"
						/>
					</Flex>
				)}

				{!prescriptionsLoading && filteredData
					? filteredData
						?.map(
							(
								consultation // Confusing naming here as this is a prescription
							) => (
								<Card
									withBorder={true}
									radius="md"
									padding="xl"
									sx={(theme) => ({
										backgroundColor: '#F8F9FA',
										transition: 'transform 200ms ease, box-shadow 100ms ease',
										'&:hover': {
											backgroundColor: 'rgb(247, 247, 247)',
											boxShadow: theme.shadows.md,
											transform: 'scale(1.005)',
											'&::before': {
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
									maw={980}
									w="100%"
									key={consultation.id}
									mt={20}
									p="md"
									component={Link}
									to={getPath('prescription', [
										consultation.consultationId.toString(),
										consultation.id.toString(),
									])}
								>
									<Flex justify="space-between" align="center">
										<Text
											color={mantineConfig.mantine.title.color}
											size="0.9rem"
											weight={mantineConfig.mantine.title.fontWeight}
										>
											{consultation?.patientName}
										</Text>
										<Text size="sm" align="right">
											{formatDate(consultation?.issueDate)}
										</Text>
									</Flex>
									<Flex justify="space-between" align="center" gap="40px">
									<Text
											color={mantineConfig.mantine.title.color}
											size={mantineConfig.mantine.title.fontSize}
											weight={500}
										>
											<Group spacing="xs">
											<Text color={mantineConfig.mantine.text.label.title.color} style={{
												fontFamily: mantineConfig.mantine.global.fontFamily,
												fontSize: mantineConfig.mantine.text.label.title.fontSize

											}} weight={500}>
												{consultation?.medicationName
													.charAt(0)
													.toUpperCase() +
													consultation?.medicationName.slice(1)}
											</Text>
											<BsPrescription />
										</Group>
										</Text>
									</Flex>
									<Flex justify="space-between" align="center" gap="40px">
										<Text color={mantineConfig.mantine.text.color} weight={mantineConfig.mantine.text.label.fontWeight} style={{
											fontFamily: mantineConfig.mantine.global.fontFamily,
											fontSize: mantineConfig.mantine.text.label.fontSize
										}}>
											{consultation?.medicationType.charAt(0).toUpperCase() +
												consultation?.medicationType.slice(1)}
										</Text>
									</Flex>
								</Card>
							)
						)
						?.slice(indexOfFirstCard, indexOfLastCard)
					: null}

				{data && !prescriptionsLoading && data?.length === 0 && (
					<Flex
						mt="3rem"
						gap="2rem"
						direction="column"
						align="center"
						justify="center"
					>
						<Image
							style={{
								width: 240,
								marginLeft: 'auto',
								marginRight: 'auto',
							}}
							radius="md"
							src={empty}
							alt="Empty"
						/>
						<Title align="center" order={3}>
							{t('tr.there-is-no-prescriptions-found!')}
						</Title>
						<Link to={getPath('booking')}>
							<Button>
								{' '}
								{t('tr.book-consultation-here')}
							</Button>
						</Link>
					</Flex>
				)}

				{filteredData &&
					!prescriptionsLoading &&
					filteredData?.length === 0 &&
					data &&
					data.length > 0 && (
						<Fragment>
							{searchData ? (
								<Flex
									mt="2.5rem"
									direction="column"
									align="center"
									justify="center"
								>
									<Avatar size="xl" color="red" radius={50} my={30}>
										<IconListSearch size="4rem" />
									</Avatar>
									<Text
										align="center"
										mb={30}
										weight={500}
										size={20}
										color="gray.7"
										px={30}
									>
										{t("tr.there-is-no-prescription-results-for-this-day")}
										<Text>
											{t('tr.please-make-sure-you-have-entered-the-correct-information')}
										</Text>
									</Text>
								</Flex>
							) : (
								<Flex
									mt="2.5rem"
									direction="column"
									align="center"
									justify="center"
								>
									<Avatar size="xl" color="red" radius={50} my={30}>
										<IconListSearch size="4rem" />
									</Avatar>
									<Text
										align="center"
										mb={30}
										weight={500}
										size={20}
										color="gray.7"
										px={30}
									>
											{t("tr.there-is-no-prescription-results-for-this-day")}
										<Text>
											{t('tr.please-make-sure-you-have-picked-the-correct-date')}
										</Text>
									</Text>
								</Flex>
							)}
						</Fragment>
					)}
			</Container>

			{!prescriptionsLoading &&
				filteredData &&
				filteredData?.length > cardPerPage ? (
				<Pagination
					mt={40}
					mb={50}
					mx={20}
					position="center"
					noWrap={false}
					value={activePage}
					onChange={setPage}
					total={pageNumbers.length}
				/>
			) : null}
		</>
	);
};

export default PrescriptionList;
