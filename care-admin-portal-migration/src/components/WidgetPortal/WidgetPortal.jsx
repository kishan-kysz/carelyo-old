import { Button, Drawer, Text, Title } from '@mantine/core';
import { IconPlaylistAdd } from '@tabler/icons-react';


import { useEffect, useState } from 'react';
import WidgetPortalSelectType from './SelectType';
import WidgetPortalStatsCard from './StatscardSelect/SelectStatsCard';
import PortalSelectPiechart from './PiechartSelect/SelectPiechart';
import PortalSelectTable from './TableSelect/SelectTable';
import PortalSelectBarchart from './BarchartSelect/SelectBarchart';
import PortalSelectLinechart from './LinechartSelect/SelectLinechart';
import SelectPieChartTotalValues from './PiechartSelect/SelectPieChartTotalValues';
import SelectMonthtlyGoal from './StatscardSelect/SelectMonthtlyGoal';
import PortalSelectAreaChart from './areachartselect/SelectAreachart';

function WidgetPortal({ handleAddItem, onChange, handleType, handleMonthlyGoal }) {
	
	const [opened, setOpened] = useState(false);
	const [selectedType, setSelectedType] = useState(null);
	const [selectedChildType, setSelectedChildType] = useState(null);
	const [selectedData, setSelectedData] = useState(null);

	const createWidgetButtonDisabled = !(selectedType && selectedData);

	useEffect(() => {
		selectedChildType === 'Consultations Gender Distribution'
			? onChange('Consultations Gender Distribution')
			: selectedChildType === 'Consultations Age Distribution'
			? onChange('Consultations Age Distribution')
			: selectedChildType === 'Illness And Gender'
			? onChange('Illness And Gender')
			: selectedChildType === 'Illness And Age'
			? onChange('Illness And Age')
			: selectedChildType === 'Illness And Time'
			? onChange('Illness And Time')
			: null;
	}, [selectedType, selectedData, selectedChildType, onChange]);

	const handleChange = (value) => {
		onChange(value);

		setSelectedData(value);
	};
	const handleSelect = (value) => {
		value ? handleType(value.toLowerCase()) : null;
		value ? setSelectedType(value) : null;
		setSelectedData(null);
		setSelectedChildType(null);
	};
	const handleSelectMonthlyGoal = (value) => {
		handleMonthlyGoal(value);
	};
	const handleSelectedChildType = (value) => {
		value ? setSelectedChildType(value) : null;
		setSelectedData(value);
	};
	const clearStates = () => {
		setOpened(false);
		setSelectedType(null);
		setSelectedData(null);
		setSelectedChildType(null);
	};

	return (
		<>
			<Drawer
				opened={opened}
				onClose={clearStates}
				padding="xl"
				size="xl"
				position="right"

			>
				<Title>Select Widget</Title>

				<WidgetPortalSelectType handleSelect={handleSelect}  />

				{selectedType === 'Stats card' ? (
					<WidgetPortalStatsCard handleChange={handleChange}  />
				) : selectedType === 'Piechart' ? (
					<PortalSelectPiechart handleSelectedChildType={handleSelectedChildType} />
				) : selectedType === 'Table' ? (
					<PortalSelectTable handleChange={handleChange}  />
				) : selectedType === 'Barchart' ? (
					<PortalSelectBarchart handleChange={handleChange} />
				) : selectedType === 'Linechart' ? (
					<PortalSelectLinechart handleChange={handleChange}  />
				) : selectedType === 'Areachart' ? (
					<PortalSelectAreaChart handleChange={handleChange}  />
				) : null}

				{selectedType === 'Piechart' && selectedChildType === 'Total values' ? (
					<SelectPieChartTotalValues handleChange={handleChange} />
				) : null}

				{selectedType &&
				selectedType === 'Stats card' &&
				selectedData &&
				selectedData !== 'Consultations Rating Distribution' ? (
					<SelectMonthtlyGoal
						handleSelectMonthlyGoal={handleSelectMonthlyGoal}
					
						selectedData={selectedData}
					/>
				) : null}

				<Button
	
		size="md"
		
				mt="md"
					leftSection={<IconPlaylistAdd />}
					disabled={createWidgetButtonDisabled}
					onClick={() => {
						handleAddItem();
						clearStates();
					}}
				>
					Create Widget
				</Button>
			</Drawer>

			<Button
			mt="md"
			ml="md"
			
			variant='outline' color="#05a98b"	
			s
				onClick={() => setOpened(true)}
				
				leftSection={<IconPlaylistAdd />}
				radius='sm'
			>
				Add Widget
			</Button>
		</>
	);
}
export { WidgetPortal };
