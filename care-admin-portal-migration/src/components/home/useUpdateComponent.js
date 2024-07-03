import { useEffect } from 'react';

export function useUpdateComponent(setItems, ObjectToUpdate) {
	useEffect(() => {
		setItems((prevItems) => {
			const newItems = prevItems.map((item) => {
				let updatedValue;
				if (Array.isArray(item.title)) {
					updatedValue = item.title.map((name) => {
						const object = ObjectToUpdate.find((obj) => obj.key === name);
						return object ? { value: object.value, title: name } : { value: name };
					});
				} else {
					const object = ObjectToUpdate.find((obj) => obj.key === item.title);
					updatedValue = object ? object.value : item.value;
				}
				return { ...item, value: updatedValue };
			});
			return newItems;
		});
	}, [ObjectToUpdate, setItems]);
}
