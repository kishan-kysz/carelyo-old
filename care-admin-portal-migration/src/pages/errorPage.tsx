import { BackgroundImage, Center, Text, Box, Button } from '@mantine/core';
import Link from 'next/link';

function ErrorPage() {
	return (
		<Box  mx="auto" mt="200px">
			<BackgroundImage
				src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
				radius="lg"
			>
				<Center p="md">
					<Text color="#fff" align="center">
						<h1>404</h1>
						<h2>Page Not Found</h2>
						<Link to='/'>
							<Button>Go to Dashboard</Button>
						</Link>
					</Text>
				</Center>
			</BackgroundImage>
		</Box>
	);
}
export default ErrorPage;
