export function dataChangeOnSelect(consultationsMetrics, selectedValue, formatHour, selectedAverages, formatWeek) {
	let arr;
	if (consultationsMetrics !== undefined) {
		arr =
			selectedValue === 'Hour'
				? Object.entries(consultationsMetrics.totalNumberOfConsultationsPerHour).map(([name, data]) => ({
						name: formatHour(name),
						data
				  }))
				: selectedValue === 'Day'
				? Object.entries(consultationsMetrics.totalNumberOfConsultationsPerDay).map(([name, data]) => ({
						name,
						data,
						avgdata:
							selectedAverages === 'Per Hour'
								? consultationsMetrics.avgNumberOfConsultationsPerHourPerDay[name].toFixed(3)
								: null
				  }))
				: selectedValue === 'Week'
				? Object.entries(consultationsMetrics.totalNumberOfConsultationsPerWeek).map(([name, data]) => ({
						name: formatWeek(name),
						data,
						avgdata:
							selectedAverages === 'Per Hour'
? consultationsMetrics.avgNumberOfConsultationsPerHourPerWeek[name].toFixed(3)
: selectedAverages === 'Per Day'
? consultationsMetrics.avgNumberOfConsultationsPerDayPerWeek[name].toFixed(2)
: null
}))
: selectedValue === 'Month'
? Object.entries(consultationsMetrics.totalNumberOfConsultationsPerMonth).map(([name, data]) => ({
name,
						data,
						avgdata:
							selectedAverages === 'Per Hour'
								? consultationsMetrics.avgNumberOfConsultationsPerHourPerMonth[name].toFixed(3)
: selectedAverages === 'Per Day'
? consultationsMetrics.avgNumberOfConsultationsPerDayPerMonth[name].toFixed(2)
: selectedAverages === 'Per Week'
? consultationsMetrics.avgNumberOfConsultationsPerWeekPerMonth[name].toFixed(2)
: null
}))
				: selectedValue === 'Year'
				? Object.entries(consultationsMetrics.totalNumberOfConsultationsPerYear).map(([name, data]) => ({
						name,
						data,
						avgdata:
							selectedAverages === 'Per Hour'
								? consultationsMetrics.avgNumberOfConsultationsPerHourPerYear[name].toFixed(3)
								: selectedAverages === 'Per Day'
								? consultationsMetrics.avgNumberOfConsultationsPerDayPerYear[name].toFixed(2)
								: selectedAverages === 'Per Week'
								? consultationsMetrics.avgNumberOfConsultationsPerWeekPerYear[name].toFixed(2)
								: selectedAverages === 'Per Month'
								? consultationsMetrics.avgNumberOfConsultationsPerMonthPerYear[name].toFixed(2)
								: null
				  }))
				: null;
	} else {
		arr = [];
	}
	return arr;
}
