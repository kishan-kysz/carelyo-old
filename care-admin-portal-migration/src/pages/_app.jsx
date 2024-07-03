import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import Sidebar from '../components/Sidebar';  
import InquiriesBar from '../components/inquiry/InquiriesBar';
import '../components/phoneInput/phone-input.css';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import NoSSR from 'react-no-ssr';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
        <NoSSR>
    <MantineProvider>
      <Notifications position="top-right" zIndex={1000} />
      <QueryClientProvider client={queryClient}>
    <Sidebar isSidebar={isSidebar}  />  
          <main className='content' style={{ position: "absolute", top: "0", right:"0", width: '100%', backgroundColor: "#fff" }}>
            <InquiriesBar  />  
            <div style={{ marginLeft: '80px' }}>
  <Component {...pageProps} />
</div>
  </main>
      
      </QueryClientProvider>
    </MantineProvider>
      </NoSSR>
  );
}

export default MyApp;
