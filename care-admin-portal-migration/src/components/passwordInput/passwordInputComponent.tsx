import { Box, Progress, PasswordInput, Group, Text, Center } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconCheck, IconPassword, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
	return (
		<Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
			<Center inline>
				{meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
				<Box ml={7}>{label}</Box>
			</Center>
		</Text>
	);
}

const requirements = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' }
];

function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	requirements.forEach((requirement) => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export const PasswordStrength = ({
	passwordValue,
	setPasswordInputValue
}: { passwordValue: string; setPasswordInputValue: (pass: string) => void }) => {
	const [value, setValue] = useInputState(passwordValue);
	useEffect(() => {
		setPasswordInputValue(value);
	}, [value, setPasswordInputValue]);
	const strength = getStrength(value);
	const checks = requirements.map((requirement) => (
		<PasswordRequirement key={requirement.label} label={requirement.label} meets={requirement.re.test(value)} />
	));

	const bars = Array(4)
		.fill(0)
		.map((_, index) => (
			<Progress
				value={value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
				color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
				// rome-ignore lint/suspicious/noArrayIndexKey: index will always be the same.
				key={index}
				size={4}
			/>
		));

	return (
		<div>
			<PasswordInput
				value={value}
				onChange={setValue}
				placeholder="Your password..."
				required
			
			/>

			<Group grow mt="xs" mb="md">
				{bars}
			</Group>
			<Group>
				<PasswordRequirement label="Has at least 6 characters" meets={value.length > 5} />

				{checks}
			</Group>
		</div>
	);
};
