import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { StateMachineProvider } from 'little-state-machine';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/layout';
import Routes from './pages/routes';
import './assets/styles/base/base.css';
import { ErrorBoundary } from 'react-error-boundary';
import { BookingProvider } from './hooks/use-booking';
import { NotFound } from './pages/not-found';

function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 0,
				retry: 3,
			},
		},
	});

	return (
		<MantineProvider
			withGlobalStyles={true}
			withNormalizeCSS={true}
			theme={{
				colors: {
					brand: [
						'#80BFAB',
						'#64BEA2',
						'#45C39C',
						'#2BC495',
						'#16C48E',
						'#00C689',
						'#12A074',
						'#1D8464',
						'#236D56',
						'#265C4B',
					],
				},
				primaryColor: 'brand',
			}}
		>
			<ErrorBoundary fallback={<NotFound err={true} />}>
				<Notifications position="top-center" limit={3} />
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<StateMachineProvider>
							<BookingProvider>
								<Layout>
									<Routes />
								</Layout>
							</BookingProvider>
						</StateMachineProvider>
					</BrowserRouter>
				</QueryClientProvider>
			</ErrorBoundary>
		</MantineProvider>
	);
}

export default App;
