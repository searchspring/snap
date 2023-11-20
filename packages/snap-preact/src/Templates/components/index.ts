// allowed template components for each main type
export const componentMap = {
	Search: async () => {
		return (await import('./search')).Search;
	},
	SearchTest: async () => {
		return (await import('./search')).SearchTest;
	},
	Autocomplete: async () => {
		return (await import('./autocomplete')).Autocomplete;
	},
	Recommendation: async () => {
		return (await import('./recommendation')).Recommendation;
	},
};
