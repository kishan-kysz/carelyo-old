import {
	Text,
	Title,
	Box,
	Image,
	Flex,
	Loader,
	useMantineColorScheme,
	Button,
	Menu,
	useMantineTheme
} from '@mantine/core';
import useInquiry from '../../helper/hooks/useInquiry';
import { Fragment, useState, useEffect, useContext } from 'react';
import { PathsContext } from '../../components/path';
import Link from "next/link";
import { useRouter } from 'next/router';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import StatusBadge from './StatusBadge';
import ImageModal from './ImageModal';
import IssuerInformation from './IssuerInformation';
import CopyInfoItem from './CopyInfoItem';
import { StatusTypes } from '../../helper/utils/types';
import {createStyles} from '@mantine/styles';




const InquiryPreview = ({ id }: { id: number }) => {
	const router = useRouter();
	const paths = useContext(PathsContext);
	const { colorScheme } = useMantineColorScheme();
	const { breakpoints } = useMantineTheme();
	const { classes, cx } = useStyles();
	const { inquiry, updateStatus, loading } = useInquiry(Number(id));
	const isSmall = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
	const [openedStatus, setOpenedStatus] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);
	const [selectedImage, setSelectedImage] = useState<string>('');
	const images = inquiry?.images?.map((image: string) => image) || [];
	const index = images.findIndex((image: string) => image === selectedImage);
	const isPrev = index > 0;
	const isNext = index < images.length - 1;
	const previewImage = (image: string) => {
		setSelectedImage(image);
		open();
	};

	useEffect(() => {
		if (inquiry?.id && inquiry?.status === 'Open') {
			updateStatus({ id: inquiry.id, status: 'Viewed' });
		}
	}, [inquiry, updateStatus]);

	const inquiryStatusList = ['Open', 'Viewed', 'Investigating', 'Resolved', 'Closed', 'Deleted'];

	return (
		<Box>
			<Box className={classes.toolBar}>
				<CopyInfoItem
					value={`${process.env.NEXT_PUBLIC_API_URL}/inquiries/${inquiry?.id}`}
					label={inquiry?.id ? `Inquiry ID: ${inquiry?.id}` : 'Loading...'}
				/>

<Button
				type="button"
				variant='outline'
				color={'#09ac8c'}
				
			
	
			    onClick={() => {
					router.push(`${paths.rootDirectory}${paths.createTicket}?id=${inquiry?.id}`);
				}}
			>
				<Text>Creat Ticket</Text>
			</Button>
			
			</Box>
			{loading ? (
				<Fragment>
					<Title order={2}  mt={50}>
						Searching...
					</Title>
					<Box >
						<Loader />
					</Box>
				</Fragment>
			) : undefined}
			{inquiry ? (
				<Fragment>
					<Box mb="md" className={classes.container}>
						<Box mb="md" className={classes.bar}>
							<Box className={classes.status}>
								<Menu
									opened={openedStatus}
									onChange={setOpenedStatus}
									radius="md"
									closeOnClickOutside={true}
									position="bottom"
								>
									<Menu.Target>
										<Button
											variant="transparent"
											color={colorScheme === 'dark' ? 'dark' : 'gray'}
											size="sm"
											radius="md"
										>
											<StatusBadge size="lg" status={inquiry?.status} />
										</Button>
									</Menu.Target>
									{inquiry?.status !== 'Closed' && inquiry?.status !== 'Resolved' && inquiry?.status !== 'Deleted' && (
										<Menu.Dropdown>
											{inquiryStatusList
												.filter((s) => s !== inquiry?.status)
												.map((status) => (
													<Menu.Item key={status} onClick={() => updateStatus({ id, status })}>
														<StatusBadge status={status as StatusTypes} />
													</Menu.Item>
												))}
										</Menu.Dropdown>
									)}
								</Menu>
							</Box>
						</Box>
						<Box mb="xs">
							<Text size="xs">Subject:</Text>
							<Text className={classes.subject}>{inquiry?.subject}</Text>
						</Box>

						<Box mb="xs">
							<Text size="xs">Message:</Text>
							<Text className={classes.message}>{inquiry?.message}</Text>
						</Box>

						<Flex
							className={cx(classes.imageContainer, {
								[classes.column]: isSmall
							})}
						>
							{inquiry?.images?.length ? (
								<Fragment>
									{inquiry?.images?.map((image) => (
										<Image
										alt="inquiry image"
											key={image}
											src={image}
											onClick={() => previewImage(image)}
											className={classes.image}
											width={120}
											height={100}
										/>
									))}
								</Fragment>
							) : (
								<Image alt="no image"
								
								mt={24} height={120} width={200}  />
							)}
						</Flex>
						<Box
						
							mt={48}
							maw={250}
							mb="md"
						>
							<Text>Issuer information</Text>
							<IssuerInformation inquiry={inquiry} />
						</Box>
					</Box>
					<ImageModal
						selectedImage={selectedImage}
						setSelectedImage={setSelectedImage}
						inquiry={inquiry}
						images={inquiry?.images}
						isPrev={isPrev}
						isNext={isNext}
						index={index}
						opened={opened}
						close={close}
					/>
				</Fragment>
			) : (
				<Box mt={48} >
					<Link href={`${paths.browseInquiry}`}>{!loading ? 'Back to Inquiries' : undefined}</Link>
				</Box>
			)}
		</Box>
	);
};

const useStyles = createStyles((theme) => ({
	details: {
		background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
	},
	label: {
		width: 'auto'
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		borderRadius: theme.spacing.xs,
		padding: '1rem',
		justifyContent: 'space-around'
	},
	bar: {
		display: 'flex',
		justifyContent: 'flex-start',
		position: 'relative'
	},
	id: {
		paddingRight: '.4rem',
		fontWeight: 700
	},
	status: {
		position: 'absolute',
		top: 0,
		right: 0
	},
	message: {
		color: theme.colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.gray[7]
	},
	imageContainer: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'wrap'
	},
	column: {
		flexDirection: 'column'
	},
	image: {
		marginRight: 24,
		marginTop: 24,
		boxShadow: '0px 0px 2px 1px rgba(0,0,0,.1)',
		cursor: 'pointer'
	},
	toolBar: {
		minHeight: 37,
		borderBottom: '2px solid rgba(180,236,228,.3)',
		padding: 4,
		textAlign: 'right',
		display: 'flex',
		justifyContent: 'space-between',
		position: 'relative',
		alignItems: 'center'
	},
	toolbarTitle: {
		fontWeight: 700
	},
	link: {
		color: 'inherit',
		textDecoration: 'none'
	}
}));

export default InquiryPreview;
