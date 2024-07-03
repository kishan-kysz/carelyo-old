import { Grid, Container, Title, Box, Text, useMantineTheme } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import TicketSideBar from '../../components/tickets/ticketSidebar';
import { useRouter } from 'next/router';
import useTicket from '../../helper/hooks/useTicket';
import { useState, useEffect } from 'react';
import { IGetAllInquiriesContent, IGetInquiryById } from '../../helper/utils/types';
import Interactions from '../../components/tickets/Interactions';
import Comment from '../../components/tickets/Comment';
import StatusBadge from '../../components/inquiry/StatusBadge';
import IssuerInformation from '../../components/inquiry/IssuerInformation';
import Link from 'next/link';
import { ExternalLink } from 'tabler-icons-react';

const HandleTicket = () => {
  const router = useRouter();
  const { id } = router.query;
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { ticket, loading } = useTicket(Number(id));
  const [inquiry, setInquiry] = useState<IGetAllInquiriesContent>();

  useEffect(() => {
    setInquiry(ticket?.inquiry);
  }, [ticket, loading]);

	return (
		<Container h={'fit-content'} mb={20} mt={24} maw={2000}>
			<Grid
		
			>
				<Grid.Col p={0} span={3}>
					{ticket ? <TicketSideBar ticket={ticket} /> : undefined}
				</Grid.Col>
				<Grid.Col p={0} span={6}>
					<Container className={classes.container}>
						<Box className={classes.gridHeader} >
							<Title align="left" size="h3" fw={700}>
								Inquiry Details
							</Title>
							<Link href={`/inquiries/${ticket?.inquiry?.id}`} className={classes.gotoLink}>
								<ExternalLink size={20} />
							</Link>
						</Box>
						<Container
						
						>
							<Text fz={14} fw={600}>
								ID: {ticket?.inquiry?.id}
							</Text>
							<Box
						
							>
								<Text fw={700}>Subject</Text>
								<Text mb={8}>
									{ticket?.inquiry?.subject}
								</Text>
								<Text fw={700}>Message</Text>
								<Text mb={8}>{ticket?.inquiry?.message}</Text>
								<Text fw={400} mb={16} c={'dimmed'} fs={'italic'}>
									{ticket?.inquiry?.images?.length
										? `${
												ticket?.inquiry?.images?.length > 1
													? `${ticket?.inquiry?.images?.length} files attached`
													: '1 attached file'}`
										: 'No attached files...'}
								</Text>
								<Box
							
								>
									{ticket?.status ? <StatusBadge size="lg" status={ticket.status} /> : undefined}
								</Box>
							</Box>
							{ticket ? <Comment ticket={ticket} /> : <Text>Comments not found</Text>}
						</Container>
					</Container>
				</Grid.Col>
				<Grid.Col p={0} span={3}>
					<Container className={classes.container}>
						<Box className={classes.gridHeader}>
							<Title align="left" size="h3" fw={700}>
								Issuer information
							</Title>
						</Box>
						{inquiry ? (
							<Box p={16}>
								<IssuerInformation inquiry={inquiry as IGetInquiryById} />
							</Box>
						) : undefined}
						<Box className={classes.gridHeader} >
							<Title size="h3">Interactions</Title>
						</Box>
						{ticket?.actionsTaken ? (
							<Box p={16}>
								<Interactions actions={ticket.actionsTaken} />
							</Box>
						) : undefined}
					</Container>
				</Grid.Col>
			</Grid>
		</Container>
	);
};

const useStyles = createStyles((theme) => ({
	details: {
		background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
	},
	label: { width: 'auto' },
	gridHeader: {
		borderBottom: '1px solid #E0E0E0',
		display: 'flex',
		alignItems: 'center',
		padding: 16,
		width: '100%'
	},
	container: {
		width: '100%',
		height: '100%',
		borderRight: '1px solid #E0E0E0',
		padding: 0
	},
	iconBox: {
		display: 'flex',
		gap: 8,
		alignItems: 'center'
	},
	link: {
		textDecoration: 'none',
		color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.dark[9]
	},
	gotoLink: {
		position: 'absolute',
		right: 16,
		top: 16
	}
}));
export default HandleTicket;
