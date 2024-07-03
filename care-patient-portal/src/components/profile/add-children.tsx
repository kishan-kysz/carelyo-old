import {
	Accordion,
	ActionIcon,
	Badge,
	Button,
	Divider,
	Flex,
	Group,
	Pagination,
	Space,
	Stepper,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { Fragment, useEffect, useState } from 'react';
import styles from '../../assets/styles/components/step.module.css';
import ConfirmAddChild from './confirm-add-child';
import FirstStep from './first-step';
import SecondStep from './second-step';
import UpdateChildData from './update-children-data';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { useForm, UseFormReturnType } from '@mantine/form';
import { IChildrenResponse, IUpdateChildStatusRequest } from '../../api/types';
import useProfile from '../../hooks/use-profile';
import useChildren from '../../hooks/use-children';
import { Paper, SimpleGrid } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { formatDateByDOB, getAge } from '../../utils';
import Cookies from 'js-cookie';

export type ChildFormProperties = {
	name: string;
	dateOfBirth: string;
	gender: string;
	partnerFirstName: string;
	partnerLastName: string;
	partnerNationalIdNumber: string;
	partnerPhoneNumber: string;
	partnerEmailId: string;
	birthCertificate: File | FileList | null;
	NINCard: File | FileList | null;
	singleParent: Boolean;
};
export type ChildForm = UseFormReturnType<ChildFormProperties>;

const AddChildren = () => {
	const { user } = useProfile();
	const { children, updateChildStatus } = useChildren();
	const { t } = useTranslation(['default']);
	const [opened, setOpened] = useState(false);
	const [updateModal, setUpdateModal] = useState(false);
	const [child, setChild] = useState<IChildrenResponse>();
	const [active, setActive] = useState(0);
	
	const [activePage, setPage] = useState(1);
	const [cardPerPage] = useState(3);
	const [reason, setReason] = useState('');
	const [showPopup, setShowPopup] = useState(false);
	const logedInPatient = Cookies.get('PATIENT_id');
	const indexOfLastCard = activePage * cardPerPage;
	const indexOfFirstCard = indexOfLastCard - cardPerPage;
	const [query, setQuery] = useState('');
	const maskPhoneNumber = (phoneNumber: string) => {
		let phoneNumberArray = phoneNumber.split('');
		for (let i = 5; i <= 9; i++) {
			phoneNumberArray[i] = 'X';
		}
		const maskedPhoneNumber = phoneNumberArray.join('');
		return maskedPhoneNumber;
	};
	const filteredChildren = children
	? [...children]?.sort((a, b) => a.name.localeCompare(b.name)): [];
	
const maskDigit = (phoneNumber: string) => {
	if(phoneNumber != null){
		let phoneNumberArray = phoneNumber.split('');
		for (let i = 3; i <= 6; i++) {
			phoneNumberArray[i] = 'X';
		}
		const maskedPhoneNumber = phoneNumberArray.join('');
		return maskedPhoneNumber;
	}
	};

	useEffect(() => {
		if (query.length >= 1) {
			setPage(1);
		}
	}, [query]);

	const handleDeclineClick = () => {
		setShowPopup(true);
	};

	const handleClosePopup = () => {
		setShowPopup(false);
	};

	const updateChildStatusAccepted = (
		childId: Number,
		status: Number,
		notes: string
	) => {
		if (user?.ninCard && user?.nationalIdNumber) {
			const payload: IUpdateChildStatusRequest = {
				childId: childId,
				status: status,
				notes: notes,
			};

			updateChildStatus(payload);
		} else {
			return showNotification({
				title: `${t('Please upload the NIN Card and Number')}`,
				color: 'yellow',
				message: '',
			});
		}
	};

	const Acknowledge = (childId: Number, status: Number, notes: string) => {
		const payload: IUpdateChildStatusRequest = {
			childId: childId,
			status: status,
			notes: notes,
		};

		updateChildStatus(payload);
	};

	const updateChildStatusDeclined = (
		childId: Number,
		status: Number,
		notes: string
	) => {
		if (user?.ninCard && user?.nationalIdNumber) {
			const payload: IUpdateChildStatusRequest = {
				childId: childId,
				status: status,
				notes: notes,
			};

			updateChildStatus(payload);
		} else {
			return showNotification({
				title: `${t('Please upload the NIN Card and Number')}`,
				color: 'yellow',
				message: '',
			});
		}
	};

	const handleUpdate = (id: Number) => {
		setChild(filteredChildren.find((child) => child.childId === id));
		setUpdateModal(true);
		setOpened(true);
	};

	const pageNumbers = [];
	for (let i = 0; i < Math.ceil(filteredChildren?.length / cardPerPage); i++) {
		pageNumbers.push(i);
	}

	const mappedChildren = filteredChildren
		.map(
			//@ts-ignore
			({
				childId,
				name,
				dateOfBirth,
				polygenic,
				partner,
				notes,
				patientId,
				status,
			}) => (
				<Accordion
					key={childId}
					variant="contained"
					radius="md"
					mt={20}
					sx={(theme) => ({
						backgroundColor:
							theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
						transition: 'transform 200ms ease, box-shadow 100ms ease',
						borderRadius: '10px',
						'&:hover': {
							boxShadow: theme.shadows.md,
							transform: 'scale(1.0001)',
							borderRadius: '10px',
							'&::before': {
								borderRadius: '25px 0 0 25px',
								content: '""',
								position: 'absolute',
								top: 0,
								bottom: 0,
								left: 0,
								width: 6,
								backgroundImage: theme.fn.linearGradient(
									2,
									theme.colors.teal[9],
									theme.colors.teal[5]
								),
							},
						},
					})}
				>
					<Accordion.Item value="vitals" mb={15}>
						<Accordion.Control px={10}>
							<Flex
								justify="space-between"
								align="center"
								mb={10}
								direction="row"
								wrap="wrap"
							>
								<Flex justify="center" align="center">
									<ActionIcon variant="transparent" color="teal.8" mr={5}>
										<IconUser size={20} />
									</ActionIcon>
									<Text fw={500} mr={5}>
										{name}
										<Text color="dimmed" size="xs">
											{polygenic.gender}
										</Text>
									</Text>
									{status === 'APPROVED' && (
										<Badge
											color="teal.7"
											variant="outline"
											size="xs"
											ml={5}
											mb={17}
										>
											{t('tr.active')}
										</Badge>
									)}
									{
										notes != null  && 
										<Badge
											color="red"
											variant="outline"
											size="xs"
											ml={5}
											mb={17}
										>
												{t('tr.decline')}
										</Badge>
									}
								</Flex>

								<Text ta={'center'} fz={12}>
									{t('tr.date-of-birth')}
									<br />
									<Badge color="teal.7" variant="outline" size="md">
										{formatDateByDOB(dateOfBirth)}
									</Badge>
								</Text>
							</Flex>
						</Accordion.Control>

						<Accordion.Panel>
							<Paper shadow="xs" radius="md" p="xs" mb={15} withBorder={true}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									{partner != null && (
										<div style={{ textAlign: 'center', flex: 1 }}>
											<p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
												{t('tr.partner-details')}
											</p>
										</div>
									)}
									<div>
										{partner === null && (
											<div
												style={{
													display: 'grid',
													gridTemplateColumns: '2fr 1fr',
													columnGap: '380px',
												}}
											>
												<div>
													<div>
														<Badge
															color="teal.7"
															variant="outline"
															size="lg"
															ml={7}
															mt={3.5}
														>
															{name} {t('tr.omboarded-with-single-parent')}
														</Badge>
													</div>
												</div>

												<div>
													<Button onClick={() => handleUpdate(childId)}>
														{t('tr.edit')}
													</Button>
												</div>
											</div>
										)}
										{logedInPatient == patientId && status !== 'APPROVED' && (
											<Button onClick={() => handleUpdate(childId)}>
												Edit
											</Button>
										)}
									</div>
								</div>

								{partner != null && (
									<SimpleGrid
										cols={2}
										spacing="md"
										breakpoints={[{ maxWidth: 800, cols: 1, spacing: 'sm' }]}
									>
										<div>
											<TextInput
												readOnly={true}
												label={
													<>
														<Text mb={5}>{t('tr.first-name')}</Text>
													</>
												}
												value={partner.firstName}
											/>
											<Space h="xs" />
										</div>
										<div>
											<TextInput
												readOnly={true}
												label={
													<>
														<Text mb={5}>{t('tr.last-name')}</Text>
													</>
												}
												value={partner.lastName}
											/>
											<Space h="xs" />
										</div>
										<div>
											<TextInput
												readOnly={true}
												label={
													<>
														<Text mb={5}>{t('tr.email')}</Text>
													</>
												}
												value={partner.email}
											/>
											<Space h="xs" />
										</div>
										<div>
											<TextInput
												readOnly={true}
												label={
													<>
														<Text mb={5}>{t('tr.phone')}</Text>
													</>
												}
												value={logedInPatient == patientId && status !== 'APPROVED'  ? maskPhoneNumber(partner.mobile) : partner.mobile}
											/>
											<Space h="xs" />
										</div>
										<div>
											<TextInput
												readOnly={true}
												label={
													<>
														<Text mb={5}>
															{t('tr.national-identification-number')}
														</Text>
													</>
												}
												value={logedInPatient == patientId && status !== 'APPROVED'  ? maskDigit(partner.nationalIdNumber) : partner.nationalIdNumber}
											/>
											<Space h="xs" />
										</div>
										<div>
											{notes === null ? (
												showPopup === false ? (
													logedInPatient != patientId && (
														<div
															style={{ marginTop: '25px', textAlign: 'right' }}
														>
															{status !== 'APPROVED' && ( // Only render buttons if status is not APPROVED
																<>
																	<Button
																		onClick={() => {
																			updateChildStatusAccepted(
																				childId,
																				2,
																				null
																			);
																		}}
																	>
																		{t('tr.accept')}
																	</Button>
																	<Button
																		className="button declined"
																		style={{
																			backgroundColor: 'red',
																			color: 'white',
																			margin: '0 10px',
																		}}
																		onClick={handleDeclineClick}
																	>
																		{t('tr.decline')}
																	</Button>
																</>
															)}
														</div>
													)
												) : (
													showPopup && (
														<div className="popup">
															<div
																className="popup-inner"
																style={{ textAlign: 'center' }}
															>
																<textarea
																	placeholder="Please enter the reason for declining"
																	value={reason}
																	onChange={(e) => setReason(e.target.value)}
																	style={{
																		marginTop: '15px',
																		marginBottom: '10px',
																		width: '100%',
																		minHeight: '50px',
																		resize: 'vertical',
																		borderRadius: '8px',
																		border: '1px solid #ccc',
																		backgroundColor: '#f2f2f2',
																		padding: '8px',
																	}}
																></textarea>
																<div>
																	<Button
																		onClick={() => {
																			updateChildStatusDeclined(
																				childId,
																				1,
																				reason
																			);
																		}}
																		style={{
																			marginRight: '5px',
																			borderRadius: '8px',
																			backgroundColor: '#28a745',
																			color: 'white',
																			border: 'none',
																			padding: '8px 16px',
																		}}
																	>
																		{t('tr.submit')}
																	</Button>

																	<Button
																		onClick={handleClosePopup}
																		style={{
																			borderRadius: '8px',
																			backgroundColor: '#dc3545',
																			color: 'white',
																			border: 'none',
																			padding: '8px 16px',
																		}}
																	>
																		{t('tr.cancel')}
																	</Button>
																</div>
															</div>
														</div>
													)
												)
											) : (
												<div>
													<Title className="mantine-InputWrapper-label mantine-TextInput-label mantine-1fzet7j">
														{t('tr.notes')}
													</Title>
													<div style={{ position: 'relative' }}>
														<textarea
															id="notes"
															value={notes}
															readOnly
															style={{
																marginTop: '2px',
																marginBottom: '0px',
																width: '100%',
																minHeight: '50px',
																resize: 'vertical',
																borderRadius: '8px',
																border: '1px solid #ccc',
																backgroundColor: '#f2f2f2',
																padding: '8px',
															}}
														/>

														{logedInPatient == patientId && (
															<Button
																style={{
																	position: 'absolute',
																	top: '10px',
																	right: '10px',
																	padding: '8px',
																	borderRadius: '8px',
																	backgroundColor: 'red',
																	color: 'white',
																	border: 'none',
																	cursor: 'pointer',
																}}
																onClick={() => {
																	Acknowledge(childId, 0, null);
																}}
															>
																{t('tr.acknowledge')}
															</Button>
														)}
													</div>
												</div>
											)}
										</div>
									</SimpleGrid>
								)}
							</Paper>
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			)
		)
		?.slice(indexOfFirstCard, indexOfLastCard);

	const notification = () => {
		showNotification({
			color: 'yellow',
			message: `${t('tr.hello')} ${user?.firstName}, ${t(
				'tr.needs-to-be-under-18'
			)}`,
		});

		return t('tr.be-under-18');
	};

	const form = useForm<ChildFormProperties>({
		initialValues: {
			name: '',
			dateOfBirth: '',
			gender: '',
			partnerFirstName: '',
			partnerLastName: '',
			partnerNationalIdNumber: '',
			partnerPhoneNumber: '',
			partnerEmailId: '',
			birthCertificate: null,
			NINCard: null,
			singleParent: false,
		},
		validate: (values) => {
			if (active === 0) {
				return {
					name:
						values.name.length < 2
							? t('tr.firstname-must-have-at-least-2-letters')
							: null,
					dateOfBirth:
						getAge(values.dateOfBirth) >= 18
							? `${notification()}`
							: values?.dateOfBirth
								? null
								: t('tr.please-select-a-date'),
					gender:
						values.gender.length < 2
							? t('tr.please-select-child-gender')
							: null,
					birthCertificate:
						values.birthCertificate === null
							? t('tr.please-select-birth-certificate')
							: null,
				};
			}

			if (form.getInputProps('singleParent').value === false) {
				if (active === 1) {
					return {
						partnerNationalIdNumber:
							values.partnerNationalIdNumber.toString().length !== 11
								? t('tr.NIN-number-must-be-of-11-digit')
								: null,
						partnerFirstName:
							values.partnerFirstName.length < 2
								? t('tr.firstname-must-have-at-least-2-letters')
								: null,
						partnerLastName:
							values.partnerLastName.length < 2
								? t('tr.lastname-must-have-at-least-2-letters')
								: null,
						partnerEmailId:
							values.partnerEmailId.length < 2
								? t('tr.invalid-email')
								: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
											values.partnerEmailId
									  )
									? t('tr.invalid-email')
									: null,
						// partnerPhoneNumber:
						// 	values.partnerPhoneNumber.length < 4
						// 		? t('tr.please-select-phone-number')
						// 		: null,
					};
				}
			}
			return {};
		},
	});
	const nextStep = () => {
		console.log('FORM : ', form);

		setActive((current) => {
			if (form.validate().hasErrors) {
				return current;
			}
			return current < 2 ? current + 1 : current;
		});
	};

	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current));

	return (
		<Fragment>
			{opened && !updateModal ? (
				<Fragment>
					{opened && !updateModal ? (
						<Fragment>
							<div style={{ margin: '0 auto' }}>
								<h1 style={{ margin: '1rem' }} className={styles.title}>
									{t('tr.register-your-child')}
								</h1>
								{active < 2 ? (
									<p className={styles.subtitle}>
										{t('tr.complete-child-profile')}
									</p>
								) : (
									''
								)}

								{active === 2 ? (
									<p className={styles.subtitle} id="submit">
										{t('tr.review-information')}
									</p>
								) : (
									''
								)}
							</div>

							<Stepper
								active={active}
								onStepClick={setActive}
								px={'xl'}
								allowNextStepsSelect={false}
							>
								<Stepper.Step allowStepSelect={false}>
									<FirstStep
										next={nextStep}
										setOpened={setOpened}
										setUpdateModal={setUpdateModal}
										form={form}
									/>
								</Stepper.Step>

								{form.getInputProps('singleParent').value === false && (
									<Stepper.Step allowStepSelect={false}>
										<SecondStep next={nextStep} prev={prevStep} form={form} />
									</Stepper.Step>
								)}

								<Stepper.Step allowStepSelect={false}>
									<ConfirmAddChild
										setOpened={setOpened}
										prev={prevStep}
										setActive={setActive}
										form={form}
									/>
								</Stepper.Step>
							</Stepper>
						</Fragment>
					) : (
						''
					)}
				</Fragment>
			) : (
				!updateModal && (
					<Fragment>
						<Group
							style={{ marginTop: '20px', marginBottom: '20px' }}
							grow={false}
							position="center"
						>
							<Button onClick={() => setOpened(true)}>
								{t('tr.add-child')}
							</Button>
						</Group>
						<Divider
							my="xs"
							size="sm"
							label={
								<>
									<Text fz={14} fw={500}>
										{t('tr.your-children')}
									</Text>
								</>
							}
							labelPosition="center"
						/>
					</Fragment>
				)
			)}
			{updateModal && mappedChildren && child && (
				<UpdateChildData
					child={child}
					setUpdateModal={setUpdateModal}
					setOpened={setOpened}
				/>
			)}
			{mappedChildren && !opened && mappedChildren}
			{!opened && filteredChildren?.length > 3 ? (
				<Pagination
					mt={50}
					mb={30}
					m={20}
					position="center"
					noWrap={false}
					withEdges={true}
					value={activePage}
					onChange={setPage}
					total={pageNumbers.length}
				/>
			) : null}
		</Fragment>
	);
};

export default AddChildren;
