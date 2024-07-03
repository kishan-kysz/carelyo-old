import { Group, Title } from '@mantine/core';
import BackButton from './back-button';
import { ReactNode } from 'react';
import mantineConfig from '../../assets/styles/config/mantine.config.json';


const PageTitle = ({ heading, rightSection }: { heading?: string, rightSection?: ReactNode }) => {
	return (
		<Group p="sm" w="100%">
			<Group position="left">

			<BackButton />
			<Title order={3}  color={mantineConfig.mantine.title.heading.color} style={{
  fontFamily: mantineConfig.mantine.global.fontFamily,
 fontSize: mantineConfig.mantine.title.heading.fontSize
    
  }}>
				{heading}
			</Title>

				</Group>
			{rightSection}
		</Group>
	);
};

export default PageTitle;
