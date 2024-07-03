import {
	Accordion,
	Badge,
	Button,
	Container,
	Flex,
	Image,
	Input,
	Pagination,
	Text,
	Title,
} from '@mantine/core';
import empty from '../../assets/images/empty.svg';
import { useTranslation } from 'react-i18next';
import styles from '../../assets/styles/pages/followUp.module.css';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import useSummary from '../../hooks/use-summary';
import mantineConfig from '../../assets/styles/config/mantine.config.json';

const CARDS_PER_PAGE = 3;

const FollowUpItem = () => {
	const { summaries, loading } = useSummary();
	const [query, setQuery] = useState('');
	const followUp = (summaries ?? [])
		?.map((sum) => sum.followUp)
		.filter((sum) => sum !== null);
	const formatedDate = (dateString: string | Date) => {
		return new Date(dateString).toDateString().replace(' ', ', ');
	};
	const [activePage, setPage] = useState(1);
	const [cardPerPage] = useState(3);
	const indexOfLastCard = activePage * cardPerPage;
	const indexOfFirstCard = indexOfLastCard - cardPerPage;
	const pageNumbers = [];
	for (let i = 0; i < Math.ceil(followUp?.length / cardPerPage); i++) {
		pageNumbers.push(i);
	}

	useEffect(() => {
		if (query.length >= 1) {
			setPage(1);
		}
	}, [query]);

	followUp.slice(indexOfFirstCard, indexOfLastCard);

	const { t } = useTranslation(['default']);

	return (
		<>
			<Container className={styles['wrapper']}>
				{!loading && followUp && followUp?.length >= 3 && (
					<Flex gap="sm" justify="center" align="center">
						<Input
							mt={20}
							mb={10}
							icon={<IconSearch size={18} />}
							placeholder="Search"
							onChange={(e) => setQuery(e.target.value)}
							radius="xl"
						/>
					</Flex>
				)}
				{followUp
					?.map((followUp, index) => (
						<Accordion
							variant="separated"
							radius="md"
							mt={20}
							key={index}
							sx={(theme) => ({
								backgroundColor:
									theme.colorScheme === 'dark'
										? theme.colors.dark[7]
										: theme.white,
								transition: 'transform 200ms ease, box-shadow 100ms ease',

								border: '1px solid #e0e0e0',
								overflow: 'hidden',
								borderRadius: 10,
								'&:hover': {
									boxShadow: theme.shadows.md,
									transform: 'scale(1.0001)',

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
							<Accordion.Item value="follow-up">
								<Accordion.Control>
									<Flex justify="space-between" align="center">
										<Text
											color={mantineConfig.mantine.title.color}
											size="0.9rem"
											weight={mantineConfig.mantine.title.fontWeight}
										>
											{followUp.patientName}
										</Text>
									</Flex>
									<Flex justify="space-between" align="center">
										<Text
											color={mantineConfig.mantine.title.color}
											size={mantineConfig.mantine.title.fontSize}
											weight={mantineConfig.mantine.title.fontWeight}
										>
											{followUp.purpose}
										</Text>
										{followUp.status === 'disabled' ? (
											<Badge
												variant="gradient"
												size="sm"
												gradient={{ from: 'orange.5', to: 'red.8', deg: 10 }}
											>
												{t('tr.expired')}
											</Badge>
										) : (
											<Badge
												variant="gradient"
												size="sm"
												gradient={{ from: 'teal.5', to: 'green.8', deg: 10 }}
											>
												{t('tr.valid')}
											</Badge>
										)}
									</Flex>
									<Flex justify="space-between" align="center">
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
													__html: followUp?.doctorName,
												}}
											/>
										</Text>
										<Text
											color={mantineConfig.mantine.text.label.date.color}
											size={mantineConfig.mantine.text.label.date.fontSize}
											weight={mantineConfig.mantine.text.label.date.fontWeight}
										>
											{followUp.followUpDate.slice(0, 10)}
										</Text>
									</Flex>
								</Accordion.Control>

								<Accordion.Panel>
									<Text
										color={mantineConfig.mantine.text.color}
										size={mantineConfig.mantine.text.fontSize}
										weight={mantineConfig.mantine.text.fontWeight}
									>
										Dr.{' '}
										<Text span={true} fw={500}>
											{followUp?.doctorName}
										</Text>{' '}
										{t('tr.scheduled-a-follow-up-for-you')}
									</Text>
								</Accordion.Panel>

								<Flex justify="center" align="center">
									<Accordion.Panel>
										<Text
											sx={{ border: '2px solid #099268', borderRadius: 50 }}
											ta={'center'}
											fz={14}
											fw={500}
											px={15}
											py={2}
											mt={10}
											color="teal.8"
										>
											{t('tr.date')}: {formatedDate(followUp.followUpDate)}
										</Text>
										<Text
											sx={{ border: '2px solid #d6336c', borderRadius: 50 }}
											ta={'center'}
											fz={14}
											fw={500}
											px={15}
											py={2}
											mt={10}
											color="pink.7"
										>
											{t('tr.time')}: {followUp.followUpDate.slice(11, 16)}
										</Text>
										<Text
											sx={{ border: '2px solid #364FC7', borderRadius: 50 }}
											ta={'center'}
											fz={14}
											fw={500}
											px={15}
											py={2}
											mt={10}
											color="indigo.9"
										>
											{t('tr.location')}: {followUp.location}
										</Text>
										<Text
											sx={{ border: '2px solid #E8590C', borderRadius: 50 }}
											ta={'center'}
											fz={14}
											fw={500}
											px={15}
											py={2}
											mt={10}
											color="orange.9"
										>
											{t('tr.booking-cost')}: {followUp.price}{' '}
											<Text span={true} fs="italic">
												{t('tr.naira')}
											</Text>
										</Text>
									</Accordion.Panel>
								</Flex>
								<Flex justify="flex-end" align="center">
									<Accordion.Panel>
										<Button
											disabled={followUp.status !== 'active'}
											size="sm"
											ta="center"
											px={10}
										>
											{t('tr.start-follow-up')}
										</Button>
									</Accordion.Panel>
								</Flex>
							</Accordion.Item>
						</Accordion>
					))
					?.slice(indexOfFirstCard, indexOfLastCard)}

				{!loading && followUp?.length === 0 && (
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
							alt="Random unsplash image"
						/>
						<Title align="center" order={3}>
							{t('tr.there-is-no-follow-up-found!')}
						</Title>
					</Flex>
				)}
			</Container>
			{followUp && followUp?.length > 3 ? (
				<Pagination
					mt={50}
					m={20}
					position="center"
					noWrap={true}
					value={activePage}
					onChange={setPage}
					total={pageNumbers.length}
				/>
			) : null}
		</>
	);
};

export default FollowUpItem;
