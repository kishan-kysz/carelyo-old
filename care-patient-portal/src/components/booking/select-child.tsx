import { Select } from '@mantine/core';
import { useStateMachine } from 'little-state-machine';
import { useState } from 'react';
import Styles from '../../assets/styles/pages/home.module.css';
import { setChildId} from '../../consultation-state';
import BookingControls from './booking-controls';
import { useTranslation } from 'react-i18next';
import { IChildrenResponse } from '../../api/types';
import ConsultationType from '../../pages/booking/select-type';

const SelectConsultation = ({
	nextStep,
	previousStep,
	data,
}: {
	nextStep: () => void;
	previousStep: () => void;
	data: IChildrenResponse[];
}) => {
	const { t } = useTranslation(['default']);

	const {
		state: { consultation },
		actions
	} = useStateMachine({ setChildId });
	const [showNext, setShowNext] = useState(false);

	return (
		<div className={Styles['width-bookchild']}>
			<Select
				label={t('tr.select-a-child')}
				placeholder={`${t('tr.select-a-child')}`}
				data={[
					...data.map((e) => ({
						key: e.childId,
						id: e.childId,
						value: e.childId.toLocaleString(),
						label: `${e.name}`,
					})),
				]}
				onChange={(e) => {
					if (!e) {
						return;
					}
					actions.setChildId({ childId: parseInt(e) });
					setShowNext(true);
				}}
				defaultValue={consultation.childId.toLocaleString()}
			/>
			<BookingControls
				next={nextStep}
				previous={previousStep}
				showNext={false}
				showPrevious={true}
			/>
			<ConsultationType
				nextStep={nextStep}
				previousStep={previousStep}
				showNext={showNext || !!consultation.childId}
			/>
		</div>
	);
};

export default SelectConsultation;
