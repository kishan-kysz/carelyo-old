export function addComponent(type, items, stats, selected, monthlyGoal, setItems, setMonthlyGoal) {
	return () => {
		localStorage.setItem('Default', 'false');

		let newItem = {
			i: `${type}${items.length + 1}${Math.random()}`,
			x: 0,
			y: 0,
			w: 1,
			h: 2,
			minW: 1,
			minH: 1,
			value: stats,
			type: type
		};

		switch (type) {
			case 'stats card':
				if (selected === 'Consultations Rating Distribution') {
					newItem.i = `${type}${items.length + 1}${Math.random()}:${selected} :`;
					newItem.title = selected;
					newItem.monthlyGoal = monthlyGoal;
					newItem.h = 2;
					newItem.w = 2;
					newItem.minW = 2;
					newItem.minH = 2;
				} else {
					newItem.i = `${type}${items.length + 1}${Math.random()}:${selected} : ${monthlyGoal}`;
					newItem.title = selected;
					newItem.monthlyGoal = monthlyGoal;
					newItem.h = 1;
					newItem.w = 2;
					newItem.minW = 2;
				}

				break;
			case 'piechart':
				if (selected === 'Consultations Gender Distribution' || selected === 'Consultations Age Distribution') {
					newItem.i = `${type}${items.length + 1}${Math.random()}:${selected}`;
					newItem.title = selected;
					newItem.w = 2;
					newItem.minW = 2;
					newItem.minH = 2;
				} else {
					newItem.i = `${type}${items.length + 1}${Math.random()}:${selected},`;
					newItem.title = selected;
					newItem.w = 2;
					newItem.minW = 2;
					newItem.minH = 2;
				}
				break;
			case 'table':
				newItem.i = `${type}${items.length + 1}${Math.random()}:${selected}`;
				newItem.title = selected;
				newItem.w = 3;
				newItem.h = 2;
				newItem.minW = 3;
				newItem.minH = 2;

				break;
			case 'barchart':
				newItem.i = `${type}${items.length + 1}${Math.random()}:${selected}`;
				newItem.title = selected;
				newItem.w = 3;
				newItem.h = 2;
				newItem.minH = 2;
				newItem.minW = 2;
				break;
			case 'linechart':
				newItem.w = 3;
				newItem.h = 2;
				newItem.minH = 2;
				newItem.minW = 2;
				break;
			case 'areachart':
				newItem.i = `${type}${items.length + 1}${Math.random()}:${selected}`;
				newItem.title = selected;
				newItem.w = 3;
				newItem.h = 2;
				newItem.minH = 2;
				newItem.minW = 2;
				break;
		}

		setItems([...items, newItem]);
		setMonthlyGoal('');
	};
}
