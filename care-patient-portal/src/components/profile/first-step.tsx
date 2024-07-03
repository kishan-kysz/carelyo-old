import {
	Button,
	Checkbox,
	FileInput,
	Group,
	Select,
	Space,
	Text,
	TextInput
} from '@mantine/core';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { ChildForm } from './add-children';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconFileUpload } from '@tabler/icons-react';
import useChildren from '../../hooks/use-children';
import { showNotification } from '@mantine/notifications';
import { createNewDate } from '../../utils';
const FirstStep = ({
	next,
	setOpened,
	setUpdateModal,
	form,
}: {
	next: () => void;
	setOpened: (value: boolean) => void;
	setUpdateModal: (value: boolean) => void;
	form: ChildForm;
}) => {
	const { t } = useTranslation(['default']);
	const { children } = useChildren();

	console.log('CHILDREN ', children);

	const handleBack = () => {
		setOpened(false);
		setUpdateModal(false);
		form.reset();
	};

	const handleSingleParent = () => {
		const currentSingleParentValue = form.getInputProps('singleParent').value;
		const newSingleParentValue = currentSingleParentValue ? false : true;
		form.setFieldValue('singleParent', newSingleParentValue);
	};

	const handleNext = () => {
        const childName = form.getInputProps('name').value;
        const childGender = form.getInputProps('gender').value;
        const childDOB = createNewDate(form.getInputProps('dateOfBirth').value);
        let matchFound = false;
    
        const childExists = children.some((child) => {
            if (
                child.name === childName &&
                createNewDate(child.dateOfBirth) === childDOB &&
                child.polygenic.gender === childGender
            ) {
                matchFound = true;
                return true; 
            }
            return false;
        });
    
        if (childExists) {
            showNotification({
                title: `There is already a child with Name: ${childName}, DOB: ${childDOB}, Gender: ${childGender}. You can't onboard another one with the same details.`,
                color: 'red',
                message: '',
            });
        } else {
            next();
        }
    };
    
    
	return (
		<Fragment>
			<div style={{ textAlign: 'center' }}>
				<Text style={{ fontWeight: 'bold' }} mb={5}>
					{t('tr.children-details')}
				</Text>
				<Space h="xs" />
			</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr',
					columnGap: '20px',
				}}
			>
				<div>
					<TextInput
						withAsterisk={true}
						mb={'sm'}
						label={t('tr.name')}
						placeholder={t('tr.name')}
						{...form.getInputProps('name')}
					/>
				</div>
				<div>
					<DatePickerInput
						mb={'sm'}
						label={t('tr.date-of-birth')}
						clearable={true}
						placeholder={'YYYY-MM-DD'}
						required={true}
						icon={<IconCalendar size={16} />}
						{...form.getInputProps('dateOfBirth')}
					/>
				</div>
				<div>
					<Select
						nothingFound="No options"
						withAsterisk={true}
						mb={'sm'}
						label={t('tr.gender')}
						placeholder={t('tr.pick-one')}
						data={[
							{ value: 'Boy', label: t('tr.boy') },
							{ value: 'Girl', label: t('tr.girl') },
							{ value: 'Non-binary', label: t('tr.non-binary') },
						]}
						{...form?.getInputProps('gender')}
					/>
				</div>
				<div>
					<FileInput
						id="dropzone-file"
						icon={<IconFileUpload size={16} />}
						clearable={true}
						withAsterisk={true}
						mb={'sm'}
						label={t('tr.upload-birth-certificate')}
						placeholder={
							<span
								style={{
									backgroundImage: 'url(path/to/your/icon.png)',
									backgroundRepeat: 'no-repeat',
									backgroundPosition: '5px center',
								}}
							>
								{t('tr.upload-birth-certificate')}
							</span>
						}
						{...form.getInputProps('birthCertificate')}
					/>
				</div>
				<div>
					<FileInput
						icon={<IconFileUpload size={16} />}
						id="dropzone-file"
						mb={'sm'}
						label={t('tr.upload-nin-card')}
						placeholder={
							<span
								style={{
									backgroundImage: 'url(path/to/your/icon.png)',
									backgroundRepeat: 'no-repeat',
									backgroundPosition: '5px center',
								}}
							>
								{t('tr.upload-nin-card')}
							</span>
						}
						{...form.getInputProps('NINCard')}
					/>
				</div>
				<Checkbox label={t('tr.single-parent')} onChange={handleSingleParent} />
			</div>
			<Group position="center" mt="xl">
				<Button variant="default" onClick={() => handleBack()}>
					{t('tr.back')}
				</Button>
				<Button type="submit" onClick={handleNext}>
					{t('tr.next-step')}
				</Button>
			</Group>
		</Fragment>
	);
};

export default FirstStep;
