export const TemplateSelect = async () => {
	return (await import('./templateselect')).TemplateSelect;
};

// allowed template components for each main type
export const componentMap = {
	search: {
		Search: async () => {
			return (await import('./search')).Search;
		},
		SearchTest: async () => {
			return (await import('./search')).SearchTest;
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
