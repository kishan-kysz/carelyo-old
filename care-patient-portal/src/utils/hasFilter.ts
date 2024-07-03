import { Filter, Search } from './types';

export function hasFilters(
	search: Search = {
		query: '',
		fields: [],
	},
	filters: Filter = {}
): boolean {
	if (search?.query?.trim()) {
		return true;
	}

	return Object.keys(filters).some((item) => filters[item]?.length);
}
