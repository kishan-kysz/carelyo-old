import { Box, Button, Modal} from '@mantine/core';
import CopyInfoItem from './CopyInfoItem';
import { createStyles } from '@mantine/styles';
import Link from 'next/link';
import { Fragment } from 'react';
import { IGetInquiryById } from '../../helper/utils/types';
import { formatDateTime } from '../../helper/utils/formatDateTime';
import { useDisclosure } from '@mantine/hooks';
import MessageModal from './MessageModal';

const IssuerInformation = ({ inquiry }: { inquiry: IGetInquiryById }) => {
	const { classes } = useStyles();
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Fragment>
			<Box >
				<CopyInfoItem size={'sm'} value={inquiry?.issuer?.name} type="name" tooltip="Name" />
				<CopyInfoItem size={'sm'} value={inquiry?.issuer?.email} type="mail" tooltip="E-mail" />
				<CopyInfoItem size={'sm'} value={inquiry?.issuer?.mobile} type="phone" tooltip="Phone" />
				<CopyInfoItem size={'sm'} value={inquiry?.issuer?.role} type="role" tooltip="Role" />
				<CopyInfoItem
					size={'sm'}
					value={formatDateTime(inquiry?.createdAt).dateTimeString}
					type="created"
					tooltip="Created At"
				/>
				<CopyInfoItem
					size={'sm'}
					value={formatDateTime(inquiry?.updatedAt).dateTimeString}
					type="updated"
					tooltip="Updated At"
				/>
				{inquiry?.resolvedAt ? (
					<CopyInfoItem
						size={'sm'}
						value={formatDateTime(inquiry?.resolvedAt).dateTimeString}
						type="resolved"
						tooltip="Resolved At"
					/>
				) : undefined}
			</Box>
			<Box mt={4}>
				<Link className={classes.link} href={`/inquiries/user/${inquiry?.issuer?.id}`}>
					More from {inquiry?.issuer?.name}
				</Link>
			</Box>
			<Box mt={8} mb={4}>
				<Button onClick={open} 	variant='outline'
				color={'#09ac8c'}>
					Send Message
				</Button>
			</Box>
			<Modal opened={opened} onClose={close} title={'Send Message'}>
				<MessageModal userId={inquiry?.issuer?.id} close={close} re={inquiry?.subject} />
			</Modal>
		</Fragment>
	);
};

export default IssuerInformation;

const useStyles = createStyles(({ colors }) => ({
	link: {
		textDecoration: 'none',
		color: colors.blue[6]
	}
}));
