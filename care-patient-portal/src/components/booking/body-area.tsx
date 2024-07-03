import {
	Checkbox,
	createStyles,
	Image,
	ScrollArea,
	SimpleGrid,
	Stack,
	Text,
	Title,
	UnstyledButton,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Fragment, useEffect, useState } from 'react';
import BookingControls from './booking-controls';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../../hooks/use-booking';
import mantineConfig from '../../assets/styles/config/mantine.config.json';
import { BiFontSize } from 'react-icons/bi';

const BodyArea = ({
	nextStep,
	previousStep,
}: {
	nextStep: () => void;
	previousStep: () => void;
}) => {
	const { actions } = useBooking();
	const [selectedBodyArea, setSelectedBodyArea] = useState<string[]>([]);
	const { t } = useTranslation(['default']);

	useEffect(() => {
		setSelectedBodyArea([]);
	}, [t]);

	const handleBodyArea = (part: string) => {
		if (!selectedBodyArea?.includes(part) && selectedBodyArea?.length === 2) {
			return showNotification({
				title: `${t('tr.you-can-select-only-two-body-parts')}`,
				color: 'yellow',
				message: '',
			});
		}
		if (selectedBodyArea?.includes(part)) {
			return setSelectedBodyArea((prev) =>
				prev.filter((item) => item !== part)
			);
		} else {
			setSelectedBodyArea((prev) => [...prev, part]);
		}
	};
	const handleNext = () => {
		actions.handleAddPainPoints(selectedBodyArea);
		nextStep();
	};

	const bodyAreaData = [
		{
			title: t('tr.head').toUpperCase(),
			id: 1,
			image: '/assets/body/head.png',
			description: t('tr.parts'),
		},
		{
			title: t('tr.neck').toUpperCase(),
			id: 1,
			image: '/assets/body/neck.png',
			description: t('tr.neck-des'),
		},
		{
			title: t('tr.chest').toUpperCase(),
			id: 2,
			image: '/assets/body/chest.png',
			description: t('tr.chest-des'),
		},
		{
			title: t('tr.arms').toUpperCase(),
			id: 2,
			image: '/assets/body/arms.png',
			description: t('tr.arms-des'),
		},
		{
			title: t('tr.liver').toUpperCase(),
			id: 5,
			image: '/assets/body/liver.png',
			description: t('tr.liver-des'),
		},
		{
			title: t('tr.stomach').toUpperCase(),
			id: 6,
			image: '/assets/body/stomach.png',
			description: t('tr.stomach-des'),
		},
		{
			title: t('tr.pelvis').toUpperCase(),
			id: 7,
			image: '/assets/body/pelvis.png',
			description: t('tr.pelvis-des'),
		},		
		{
			title: t('tr.knees').toUpperCase(),
			id: 3,
			image: '/assets/body/knees.png',
			description: t('tr.knee-des'),
		},
		{
			title: t('tr.thighs').toUpperCase(),
			id: 8,
			image: '/assets/body/thighs.png',
			description: t('tr.thighs-des'),
		},
		{
			title: t('tr.legs').toUpperCase(),
			id: 4,
			image: '/assets/body/legs.png',
			description: t('tr.legs-des'),
		},		
		{
			title: t('tr.foot').toUpperCase(),
			id: 8,
			image: '/assets/body/foot.png',
			description: t('tr.foot-des'),
		},
		{
			title: t('tr.others').toUpperCase(),
			id: 8,
			image: '/assets/body/others.png',
			description: t('tr.others-des'),
		},
	];

	const items = bodyAreaData.map((item) => (
		<ImageCheckbox
			{...item}
			key={item.id}
			onChange={handleBodyArea}
			checked={selectedBodyArea?.includes(item.title)}
		/>
	));
	return (
		<Fragment>
			<Stack p="md" spacing={0} h="80%">
				<Text
					align="center"
					size={mantineConfig.mantine.title.heading.subheading.fontSize}
					weight={mantineConfig.mantine.title.fontWeight}
					style={{
						color: mantineConfig.mantine.title.color,
						fontFamily: mantineConfig.mantine.global.fontFamily,
					}}
				>
					{t('tr.select-body-parts').toUpperCase()}
				</Text>
				<Text
					color={mantineConfig.mantine.text.color}
					fz={mantineConfig.mantine.text.fontSize}
					weight={mantineConfig.mantine.text.fontWeight}
					style={{
						fontFamily: mantineConfig.mantine.global.fontFamily,
						textAlign: 'center',
					}}
				>
					(
					{selectedBodyArea?.length < 1
						? t('tr.you-can-select-only-two-body-parts')
						: `${selectedBodyArea?.length}`}{' '}
					{t('tr.of-2-selected')})
				</Text>
			</Stack>
			<ScrollArea offsetScrollbars={true} pl={20}>
				<SimpleGrid
					cols={2}
					breakpoints={[
						{ maxWidth: 'md', cols: 2 },
						{ maxWidth: 'sm', cols: 1 },
					]}
				>
					{items}
				</SimpleGrid>
			</ScrollArea>

			<BookingControls
				next={handleNext}
				previous={previousStep}
				showNext={selectedBodyArea?.length >= 1}
				showPrevious={true}
			/>
		</Fragment>
	);
};

export default BodyArea;

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
	button: {
		display: 'flex',
		alignItems: 'center',
		width: '100%',

		transition: 'background-color 150ms ease, border-color 150ms ease',
		border: `1.5px solid ${
			checked
				? theme.fn.variant({ variant: 'outline', color: theme.primaryColor })
						.border
				: theme.colors.gray[3]
		}`,
		borderRadius: theme.radius.xs,
		padding: theme.spacing.sm,

		'&:hover': {
			boxShadow: theme.shadows.xl,
			// transform: 'scale(1.001)',
			background: theme.colors.green[1],
		},
	},

	body: {
		flex: 1,
		marginLeft: theme.spacing.md,
	},
}));
type ImageCheckboxProps = {
	checked: boolean;
	onChange: (title: string) => void;
	title: string;
	description: string;
	className?: string;
	image: string;
};
const ImageCheckbox = ({
	checked,
	onChange,
	title,
	description,
	className,
	image,
	...others
}: ImageCheckboxProps) => {
	const { classes, cx } = useStyles({ checked: checked });

	return (
		<UnstyledButton
			{...others}
			onClick={() => {
				onChange(title);
			}}
			className={cx(classes.button, className)}
		>
			<Image src={image} alt={title} width={67} />

			<div className={classes.body}>
				<Title
					color={mantineConfig.mantine.text.label.title.color}
					style={{
						fontFamily: mantineConfig.mantine.global.fontFamily,
						fontSize: mantineConfig.mantine.text.label.title.fontSize,
					}}
					weight={mantineConfig.mantine.text.label.title.fontWeight}
				>
					{title}
				</Title>
				<Text
					color={mantineConfig.mantine.text.color}
					weight={mantineConfig.mantine.text.label.fontWeight}
					style={{
						fontFamily: mantineConfig.mantine.global.fontFamily,
						fontSize: mantineConfig.mantine.text.label.fontSize,
					}}
					sx={{ lineHeight: 1 }}
					mb={5}
				>
					{description}
				</Text>
			</div>

			<Checkbox
				checked={checked}
				onChange={() => {}}
				tabIndex={-1}
				styles={{ input: { cursor: 'pointer' } }}
			/>
		</UnstyledButton>
	);
};
