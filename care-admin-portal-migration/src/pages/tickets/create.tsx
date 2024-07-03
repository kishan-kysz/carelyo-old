import { Container, Box, Title, Loader, Text, Button, Select, Group } from '@mantine/core';
import useInquiry from '../../helper/hooks/useInquiry';
import { createStyles } from '@mantine/styles';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { createSupportTicketFromAnIquiry } from '../../helper/api/index';
import { showNotification } from '@mantine/notifications';
import CreatableSelect from 'react-select/creatable';
import { PathsContext } from '../../components/path';

import { MultiSelect } from '@mantine/core';
import { useState, useEffect, useContext } from 'react';
import { ITags } from '../../helper/utils/types';

import useUsers from '../../helper/hooks/useUsers';
import { IGetUsersResponse } from '../../helper/utils/types';

const CreateTicket = () => {
  const paths = useContext(PathsContext);
  
  const router = useRouter();
  const { id } = router.query; 
	const { inquiry, loading } = useInquiry(Number(id));
	const { classes } = useStyles();
	const [tags, setTags] = useState<ITags[]>([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

	const [admins, setAdmins] = useState<IGetUsersResponse[]>([]);
	const { users } = useUsers();

	useEffect(() => {
		if (users) {
			setAdmins(users?.filter((user) => user.role === 'SYSTEMADMIN'));
		}
	}, [users]);

	const systemAdmins = users?.filter((user) => user.role === 'SYSTEMADMIN');

	interface IFormValues {
		inquiryId: string | number;
		category: string;
		type: string;
		priority: string;
		assigneeId: string | number;
		tags: string[];
	}

	const form = useForm({
		initialValues: {
			inquiryId: inquiry?.id,
			category: '',
			type: '',
			priority: '',
			assigneeId: 0,
			tags: []
		}
	});

	const { mutate } = useMutation(
		(values: {
			inquiryId: number | undefined;
			category: string;
			type: string;
			priority: string;
			assigneeId: number;
			tags: string[];
		}) => createSupportTicketFromAnIquiry(values),
		{
			onSuccess: () => {
				router.push(paths.rootDirectory +  paths.manageTicket);
				console.log('Success');
				showNotification({
					title: 'Ticket has been created',
					message: '',
					icon: <IconCheck />
				});
			},
			onError: (err: ErrorOptions) => {
				console.log(err);
			}
		}
	);

	return (
		<>
			{loading ? (
				<Container
					mb={20}
					mt={50}
					maw={850}
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Loader size="xl" />
				</Container>
			) : (
				<Container display="grid" sx={{ gap: 16 }} mb={20} mt={50} maw={850}>
					<Title align="center">Open a ticket</Title>

					{!loading ? (
						<>
							<Title size="sm"> Inquiry Summary</Title>
							<Box className={classes.inqSummaryContainer}>
								<Box>
									<Text fw={700} size="sm">
										Subject:
									</Text>
									<Text>{inquiry?.subject}</Text>
								</Box>
								<Box>
									<Text fw={700} size="sm">
										Message:
									</Text>
									<Text>{inquiry?.message}</Text>
								</Box>
								<Box>
									<Text fw={700} size="sm">
										Created by:
									</Text>
									<Text>{inquiry?.issuer.email}</Text>
								</Box>
								<Text size="sm" fw={700}>
									Inquiry ID:{inquiry?.id}
								</Text>
							</Box>

							<form
								className={classes.formStyle}
								onSubmit={form.onSubmit((values) => {
									form.setFieldValue('assigneeId', Number(values.assigneeId));
									form.setFieldValue('inquiryId', Number(inquiry?.id));
									console.log(values);
									mutate(values);
								})}
							>
								<Select
									required
									label="Category"
									data={['Account', 'Billing', 'General', 'Other']}
									clearable
									placeholder="---Select category---"
									size="sm"
									{...form.getInputProps('category')}
								/>

								<Select
									required
									label="Type"
									size="sm"
									placeholder="---Select Type---"
									data={['Bug', 'Feature', 'Other', 'Question']}
									{...form.getInputProps('type')}
								/>
								<Select
									required
									label="Priority"
									size="sm"
									placeholder="---Select Type---"
									data={['High', 'Low', 'Medium', 'Critical']}
									{...form.getInputProps('priority')}
								/>

								<Select
									required
									label="Assign to"
									placeholder='---Select Assignee---'
									data={admins?.map((admin) => {
										return {
											value: admin.id.toString(),
											label: admin.email
										};
									})}
									{...form.getInputProps('assigneeId')}
								/>
<CreatableSelect
  isMulti
  placeholder='---Add tags---'
  value={selectedOptions}
  onChange={(values) => {
    setSelectedOptions(values);
    form.setFieldValue('tags', values ? values.map((item) => item.value) : []);
  }}
  onCreateOption={(value) => {
    const newOption = { value, label: value };
    setTags((current) => [...current, newOption]);
    setSelectedOptions((current) => [...current, newOption]);
  }}
  options={tags}
/>

								<Group>
									<Button w={175} type="submit">
										Submit
									</Button>
								</Group>
							</form>
						</>
					) : (
						<Loader />
					)}
				</Container>
			)}
		</>
	);
};
const useStyles = createStyles(() => ({
	inqSummaryContainer: {
		boxShadow: '0 0 4px 1px #E0E0E0',
		padding: 16,
		display: 'grid',
		gap: 16
	},
	formStyle: {
		display: 'grid',
		gap: 16
	}
}));
export default CreateTicket;