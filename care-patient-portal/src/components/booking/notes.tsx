import { Text, Textarea, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../../hooks/use-booking';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
const MAX_CHARS = 500;

const Notes = () => {
	const { booking, actions } = useBooking();
	const [err, setErr] = useState<boolean>();
	const [notes, setNotes] = useState(booking?.textDetailedDescription || '');
	const [debounced] = useDebouncedValue(notes, 1000);
	const trim = (str: string) => str.replace(/^\s+|\s+$/g, '');
	const submitNotes = () => {
		if (debounced.length <= MAX_CHARS) {
			actions.handleAddNotes(trim(debounced));
			setErr(false);
		} else {
			setErr(true);
		}
	};
	const { t } = useTranslation(['default']);

	const label = `${t('tr.describe-symptoms')} (${
		notes.length
	} /${MAX_CHARS}) ${t('tr.characters')}`;

	useEffect(() => {
		submitNotes();
	}, [debounced]);

	return (
		<Fragment>
			<div>
				<Title
					align="center"
					order={3}
					style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
					color={mantineConfig.mantine.title.color}
					weight={mantineConfig.mantine.title.fontWeight}
					size={mantineConfig.mantine.title.heading.fontSize}
				>
					{t('tr.add-notes')}
				</Title><br/>
				<Text
					align="center"
					style={{ fontFamily: mantineConfig.mantine.global.fontFamily }}
					color={mantineConfig.mantine.text.color}
					size={mantineConfig.mantine.text.fontSize}
					weight={mantineConfig.mantine.text.fontWeight}
				>
					{t('tr.description-note')}
				</Text>
			</div>
			<Textarea
				label={label}
				p="sm"
				error={err ? t('additionalNotes.exceeded-characters') : ''}
				placeholder={`${t('tr.enter-notes')}`}
				style={{
					fontWeight: mantineConfig.mantine.text.fontWeight,
					fontFamily: mantineConfig.mantine.global.fontFamily,
				}}
				color={mantineConfig.mantine.text.color}
				size={mantineConfig.mantine.text.fontSize}
				value={notes}
				onChange={(event) => setNotes(event.currentTarget.value)}
				autosize={true}
				minRows={4}
				maxRows={4}
			/>
		</Fragment>
	);
};

export default Notes;
