import { ThemeResponsive } from '../../providers/theme';

const mobileOverrides: ThemeResponsive = {
	components: {
		search: {
			theme: {
				components: {
					results: {
						columns: 2,
					},
				},
			},
		},
		facetsHorizontal: {
			limit: 0,
		},
		mobileSidebar: {
			hideSortBy: false,
		},
		searchHorizontal: {
			theme: {
				components: {
					'toolbar.middle': {
						hidePerPage: true,
						hideSortBy: true,
					},
				},
			},
		},
		sortBy: {
			type: 'radio',
		},
		toolbar: {
			hideSortBy: true,
			hidePerPage: true,
		},
		autocomplete: {
			hideFacets: true,
			vertical: true,
			horizontalTerms: true,
			theme: {
				components: {
					results: {
						rows: 1,
						columns: 2,
					},
				},
			},
		},
	},
};

const tabletOverrides: ThemeResponsive = {
	layoutOptions: [],
	components: {
		search: {
			theme: {
				components: {
					results: {
						columns: 3,
					},
				},
			},
		},
		facetsHorizontal: {
			limit: 3,
		},
		autocomplete: {
			hideFacets: true,
			vertical: true,
			horizontalTerms: true,
			theme: {
				components: {
					results: {
						rows: 1,
						columns: 3,
					},
				},
			},
		},
	},
};

const desktopOverrides: ThemeResponsive = {
	layoutOptions: [],
	components: {
		search: {
			theme: {
				components: {
					results: {
						columns: 3,
					},
				},
			},
		},
		facetsHorizontal: {
			limit: 5,
		},
		autocomplete: {
			vertical: true,
			horizontalTerms: true,
			theme: {
				components: {
					results: {
						rows: 1,
						columns: 3,
					},
					facet: {
						limit: 4,
					},
				},
			},
		},
	},
};

const widescreenOverrides: ThemeResponsive = {
	layoutOptions: [],
	components: {
		search: {
			theme: {
				components: {
					results: {
						columns: 4,
					},
				},
			},
		},
		autocomplete: {
			theme: {
				components: {
					results: {
						rows: 2,
						columns: 2,
					},
				},
			},
		},
	},
};

export const responsive: [ThemeResponsive, ThemeResponsive, ThemeResponsive, ThemeResponsive] = [
	mobileOverrides,
	tabletOverrides,
	desktopOverrides,
	widescreenOverrides,
];
