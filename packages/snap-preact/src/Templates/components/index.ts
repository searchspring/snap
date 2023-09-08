// allowed template components for each main type
export const componentMap = {
	search: {
		Search: async () => {
			return (await import('./search')).Search;
		},
	},
	autocomplete: {
		Autocomplete: async () => {
			return (await import('./autocomplete')).Autocomplete;
		},
	},
	recommendation: {
		Recommendation: async () => {
			return (await import('./recommendation')).Recommendation;
		},
	},
};
