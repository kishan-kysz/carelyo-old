import { Box, Tooltip, Text, Divider,Image, useMantineColorScheme, ActionIcon } from '@mantine/core';
import {
	IconBrandCashapp,
	IconHome2,
	IconLogout,
	IconMenu2,
	IconReportMedical,
	IconStethoscope,
	IconUsers,
	IconBrandPaypay,
	IconMailOpened,
	IconBuildingHospital,
	IconPrescription,
	IconArrowBarToLeft,
	IconMicroscope,
	IconFriends,
	IconMessageReport,
	IconTicket
} from '@tabler/icons-react';

import { useState, useContext } from 'react';
import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar';
import Link from 'next/link';
import { logout } from '../helper/api/auth';
import { useUser } from '../helper/hooks/useUser';
import { getAuthenticatedUser } from '../helper/api/auth';
import { PathsContext } from './path';
import { useRouter } from 'next/router';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const router = useRouter();

  const handleClick = () => {
    setSelected(title);
    router.replace(to);
  };

  return (
    <Tooltip label={title} position="right" >
      <MenuItem active={selected === title} onClick={handleClick} icon={icon}>
        {title}
      </MenuItem>
    </Tooltip>
  );
};
const SidebarMenu = () => {
  const paths = useContext(PathsContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState('');
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { data } = getAuthenticatedUser();
  const { user, loadingUser } = useUser(data?.userId);

  const handleCollapseToggle = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { title: 'Dashboard', to: paths.dashboard, icon: <IconHome2 /> },
    { title: 'Users', to: paths.rootDirectory + paths.manageUser, icon: <IconFriends /> },
    { title: 'Doctors', to: paths.rootDirectory + paths.manageDoctor, icon: <IconStethoscope /> },
    { title: 'Patients', to: paths.rootDirectory + paths.managePatient, icon: <IconUsers /> },
    { title: 'Consultations', to: paths.rootDirectory + paths.browseConsultation, icon: <IconReportMedical /> },
    { title: 'Inquiries', to: paths.rootDirectory + paths.browseInquiry, icon: <IconMessageReport /> },
    { title: 'Tickets', to:  paths.rootDirectory + paths.manageTicket, icon: <IconTicket /> },
    { title: 'Providers', to: paths.rootDirectory + paths.manageProvider, icon: <IconBuildingHospital /> },
    { title: 'Prescriptions', to:  paths.rootDirectory + paths.managePrescription, icon: <IconPrescription /> },
    { title: 'Labrequests', to: paths.rootDirectory + paths.browseLab, icon: <IconMicroscope /> },
    { title: 'Prices', to: paths.rootDirectory + paths.managePrice, icon: <IconBrandCashapp /> },
    { title: 'Payroll', to: paths.rootDirectory + paths.browsePayroll, icon: <IconBrandPaypay /> },
    { title: 'Templates', to: paths.rootDirectory + paths.manageTemplate, icon: <IconMailOpened /> },
    { title: 'Logout', to: '/', setSelected: logout, icon: <IconLogout /> },
  ];

  return (

      <Sidebar display="flex"  height={100} collapsed={isCollapsed}    rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
        <Menu iconShape="square" style={{borderRight: "1px solid #eef1f3"}}>
          <MenuItem
            style={{ background: "rgba(255, 255, 255, 1)", opacity: "1", height: "80px", borderBottom: "1px solid #e9ecef"}}
            onClick={handleCollapseToggle}
       /*      icon={isCollapsed ? <IconMenu2 /> : <IconArrowBarToLeft />} */
          >
	<Image
						
            alt='profile-user'
        
            style={{ width: '38px', height: 'auto' }}
            src={'../../logo-small.png'}

          />
          </MenuItem>
          {!isCollapsed && (
            <Box style={{ background: "#f8f8f8f", opacity: "1"}}>
              <Text size="xs" ml="xs">Logged in as:</Text>
              <Text align="center" weight={600} mb={10}>{user?.email || 'loading...'}</Text>
              <Divider />
            </Box>
          )}

          {menuItems.map(item => (
            <Item 
              key={item.title}
              title={item.title}
              to={item.to}
              selected={selected}
              setSelected={item.setSelected || setSelected}
              icon={item.icon}
            />
          ))}
		  
        </Menu>
      </Sidebar>
 
  );
};

export default SidebarMenu;