import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Pagination } from '@mantine/core';
import LoadingIndicator from '../loading-indicator';
import MessageContent from './message-content';
import { IMessageResponse } from '../../api/types';
import MessagePreview from './message-preview';

const CARDS_PER_PAGE = 5;
// eslint-disable-next-line no-unused-vars
const AccordionMessages = ({
	messages,
	isLoading,
	onSelect,
	isMobileOrTablet,
}: {
	messages: IMessageResponse[];
	isLoading: boolean;
	onSelect: (id: number) => void;
	isMobileOrTablet: boolean;
}) => {
	const { t } = useTranslation(['default']);

	const [activePage, setPage] = useState(1);
	const indexOfLastCard = activePage * CARDS_PER_PAGE;
	const indexOfFirstCard = indexOfLastCard - CARDS_PER_PAGE;
	const pageNumbers = Math.ceil((messages?.length || 0) / CARDS_PER_PAGE);

	return (
		<Accordion transitionDuration={1000}>
			{messages &&
				messages?.length > 0 &&
				messages?.slice(indexOfFirstCard, indexOfLastCard).map((message) => (
					<Accordion.Item key={message.id} value={message.id.toString()}>
						<Accordion.Control>
							<MessagePreview
								onSelect={onSelect}
								key={message.id}
								messageItem={message}
								isMobile={true}
							/>
						</Accordion.Control>
						<Accordion.Panel>
							<MessageContent message={message} />
						</Accordion.Panel>
					</Accordion.Item>
				))}

			{messages && messages?.length === 0 && (
				<p>{t('tr.no-messages-available')}</p>
			)}

			{isLoading ? (
				<LoadingIndicator />
			) : messages && messages?.length > CARDS_PER_PAGE ? (
				<Pagination
					mt={20}
					m={20}
					position="center"
					noWrap={true}
					value={activePage}
					onChange={setPage}
					total={pageNumbers}
					style={{ paddingTop: '1.2rem' }}
				/>
			) : null}
		</Accordion>
	);
};

export default AccordionMessages;
