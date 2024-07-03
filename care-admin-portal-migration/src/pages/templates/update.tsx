import { Box, Button, Container, Loader, Textarea, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { updateTemplate } from '../../helper/api';
import { useGetTemplate } from '../../helper/hooks/useTemplate';
import { useRouter } from 'next/router';
import { PathsContext } from '../../components/path';
const UpdateTemplate = () => {

  const paths = useContext(PathsContext);
	const router = useRouter();
    const { id } = router.query;
	const nameId = String(id);
	const { template } = useGetTemplate(nameId);
	const [isLoading, setIsLoading] = useState(false);
	const queryClient = useQueryClient();

	type TemplateSubmitForm = {
		type: string;
		html: string;
	};

	const { mutate } = useMutation(updateTemplate, {
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['getTemplate'] });
			queryClient.invalidateQueries({ queryKey: ['getTemplates'] });
			console.log(data);
			showNotification({
				title: 'Template Updated',
				message: `Template updated at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
				icon: <IconCash />
			});
			setIsLoading(false);
			reset();
			router.push(paths.rootDirectory + paths.manageTemplate);
		},
		onError: (err) => {
			console.log(err);
			setIsLoading(false);
		}
	});
	const { register, handleSubmit, reset } = useForm<TemplateSubmitForm>({});

	const onSubmit = (data: TemplateSubmitForm) => {
		mutate(data, {
		  onSuccess: () => {
			setIsLoading(false); // Set loading to false on success
		  },
		  onError: (err) => {
			console.log(err);
			setIsLoading(false); // Set loading to false on error
		  },
		});
		setIsLoading(true); // Avoid setting loading state immediately after calling mutate
	  };
	return (
		<>
			{isLoading ? (
				<Container
					mb={20}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						overflow: 'hidden',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Loader size="xl" color="teal" />
				</Container>
			) : (
				<Container mb={20}>
					<Title mt={50}>
						Update template: {template?.templateType}
					</Title>
					<Box mb="md" mt={40}>
						<form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
							{template ? (
								<div className="form-group">
									<TextInput defaultValue={template?.templateType} {...register('type')} type='hidden' />
									<Textarea
									  rows={15} 
										label="Message"
										minRows={50}
										placeholder="input template..."
										defaultValue={template?.html}
										{...register('html')}
									/>
									<Button type="submit" className="btn btn-primary" size='md' variant='outline'
								color='#09ac8c'  			mt='md' >
										Update
									</Button>
									<Button
									mt="md"
										type="button"
										onClick={() => {
											router.push(paths.rootDirectory + paths.manageTemplate);
										}}
										className="btn btn-warning float-right"
										size='md' variant='outline'
										color='#f39c12'
										ml='20'
									>
										Cancel
									</Button>
								</div>
							) : (
								<Loader size="xl" color="teal" />
							)}
						</form>
					</Box>
				</Container>
			)}
		</>
	);
};

export default UpdateTemplate;
