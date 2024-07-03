import { useState, useEffect, Fragment } from 'react';
import MessagePreview from './message-preview';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@mantine/core';
import LoadingIndicator from '../loading-indicator';
import { IMessageResponse } from '../../api/types';
import { useMediaQuery } from '@mantine/hooks';

const MessagesList = ({
  messages,
  isLoading,
  onSelect,
  
}: {
  messages: IMessageResponse[];
  isLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  onSelect: (id: number) => void;
}) => {
  useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  
  const getCardsPerPage = () => {
    if (isMobile) return 5;
    if (isTablet) return 5;
    return 6;
  };
  
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());

  useEffect(() => {
    setCardsPerPage(getCardsPerPage());
  }, [isMobile, isTablet, isDesktop]);


  const [activePage, setPage] = useState(1);
  const indexOfLastCard = activePage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentMessages = messages.slice(indexOfFirstCard, indexOfLastCard);
  const pageNumbers = Math.ceil(messages.length / cardsPerPage);

  
  const paginationStyle = {
    marginTop: '20px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <Fragment>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          {currentMessages.map((message) => (
            <MessagePreview onSelect={onSelect} key={message.id} messageItem={message} isMobile={false} />
          ))}
          {messages.length > cardsPerPage && (
            <Pagination
              style={paginationStyle}
              noWrap={true}
              value={activePage}
              onChange={(page) => setPage(page)}
              total={pageNumbers}
            />
          )}
        </div>
      )}
    </Fragment>
  );
};

export default MessagesList;