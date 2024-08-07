// import type { NoResultsLang, SearchHeaderLang } from '../components/src';
// import type { LangComponents } from '../components/src/providers/langComponents';

export const fr_translation = {
	searchHeader: {
		titleText: {
			text: 'es french',
			a11y: {
				'aria-label': 'string',
			},
		},
		subtitleText: {
			text: () => {
				return '';
			},
		},
	},
	noResults: {
		suggestionsTitleText: {
			text: (data) => {
				return `${data.controller.config.id}`;
			},
		},
	},
};
