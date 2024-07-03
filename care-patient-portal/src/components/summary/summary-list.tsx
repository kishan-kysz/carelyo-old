import {
	Avatar,
	Button,
	Card,
	Flex,
	Image,
	Pagination,
	Text,
	TextInput,
	Title
} from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import empty from '../../assets/images/empty.svg';
import Container from '../layout/container';
import { IconListSearch, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import useSummary from '../../hooks/use-summary';
import { getPath } from '../../pages/navigation';
import { useFilter } from '../../hooks/use-filter';
import { useDebouncedValue } from '@mantine/hooks';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import dayjs from 'dayjs';

const CARDS_PER_PAGE = 6;

const SummaryList = () => {
	const { t } = useTranslation(['default']);
	const { summaries } = useSummary();
	const [search, setSearch] = useState<string>('');
	const [query] = useDebouncedValue<string>(search, 500);

	const { data: result } = useFilter({
		data: summaries || [],
		search: {
			query,
			enableHighlighting: true,
			fields: ['doctorName'],
		},
	});

	const [activePage, setPage] = useState(1);
	const indexOfLastCard = activePage * CARDS_PER_PAGE;
	const indexOfFirstCard = indexOfLastCard - CARDS_PER_PAGE;
	const pageNumbers = (result && result?.length / CARDS_PER_PAGE) || 1;

	return (
		<>
			<Container
				sx={{
					width: '100%',
				}}
			>
				{summaries && summaries?.length > CARDS_PER_PAGE && (
					<Flex
						mih={70}
						gap="xs"
						w="100%"
						justify="center"
						align="center"
						direction="row"
						wrap="wrap"
					>
						<TextInput
							icon={<IconSearch size={18} />}
							placeholder="Search by doctors name"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							radius="xl"
						/>
					</Flex>
				)}
				{result
					?.map((consultation) => (
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
							w={'100%'}
							key={consultation.consultationId}
							mt={20}
							p="md"
							component={Link}
							to={getPath('consultation', [
								consultation.consultationId.toString(),
							])}
						>

							<Flex justify="space-between" align="center">
								<Text
									color={mantineConfig.mantine.title.color}
									size="0.9rem"
									weight={mantineConfig.mantine.title.fontWeight}
								>
									{consultation?.name}
								</Text>
								<Text size="sm" align="right">
									{dayjs(consultation?.timeFinished).format('DD MMM YYYY')}
								</Text>
							</Flex>

							<Flex justify="space-between" align="center" gap="40px">
								<Text
									color={mantineConfig.mantine.title.color}
									size={mantineConfig.mantine.title.fontSize}
									weight={mantineConfig.mantine.title.fontWeight}
								>
									Dr.{' '}
									<Text
										span={true}
										color={mantineConfig.mantine.title.color}
										size={mantineConfig.mantine.title.fontSize}
										weight={mantineConfig.mantine.title.fontWeight}
										// rome-ignore lint: dangerouslySetInnerHTML is used to highlight the search result
										dangerouslySetInnerHTML={{
											__html: consultation?.doctorName,
										}}
									/>
								</Text>
								
							</Flex>
						</Card>
					))
					?.slice(indexOfFirstCard, indexOfLastCard)}

				{summaries && summaries?.length === 0 && (
					<Flex
						mt="3rem"
						gap="2rem"
						direction="column"
						align="center"
						justify="center"
					>
						<Image
							style={{ width: 240, marginLeft: 'auto', marginRight: 'auto' }}
							radius="md"
							src={empty}
							alt="No Consultation Found"
						/>
						<Title align="center" order={3}>
							{t('tr.there-is-no-consultation-found!')}
						</Title>
						<Link to={getPath('booking')}>
							<Button> {t('tr.book-consultation-here')}</Button>
						</Link>
					</Flex>
				)}

				{query.length > 0 && result.length < 1 && (
					<Flex mt="2.5rem" direction="column" align="center" justify="center">
						<Avatar size="xl" color="red" radius={50} my={30}>
							<IconListSearch size="4rem" />
						</Avatar>
						<Text
							align="center"
							mb={30}
							color={mantineConfig.mantine.title.color}
							size={mantineConfig.mantine.title.fontSize}
							weight={mantineConfig.mantine.title.fontWeight}
						>
							{t('tr.there-is-no-consulation-results-for-this-day')}
							<Text
								style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
								color={mantineConfig.mantine.text.color}
								size={mantineConfig.mantine.text.fontSize}
								weight={mantineConfig.mantine.text.fontWeight}
							>
								{t('tr.please-make-sure-you-have-entered-the-correct-information')}
							</Text>
						</Text>
					</Flex>
				)}
			</Container>

			{result && result?.length > CARDS_PER_PAGE ? (
				<Pagination
					mt={50}
					m={20}
					position="center"
					noWrap={true}
					value={activePage}
					onChange={setPage}
					total={pageNumbers}
				/>
			) : null}
		</>
	);
};

export default SummaryList;
