import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { sendMessage } from '../api/index';

const useMessage = () => {
	const [loading, setLoading] = useState(false);
	const { mutateAsync: send, isLoading } = useMutation(sendMessage);

	useEffect(() => {
		if (isLoading) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [isLoading]);

	return { send, loading };
};

export default useMessage;
