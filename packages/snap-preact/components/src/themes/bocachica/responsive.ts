import { ThemeResponsive } from '../../providers/theme';

const mobileOverrides: ThemeResponsive = {
	components: {
		results: {
			columns: 2,
		},
		// toolbar: {
		// 	named: {
		// 		topToolBar: {
		// 			hidePagination: true,
		// 			hideSortBy: true,
		// 			hidePerPage: true,
		// 		},
		// 	},
		// },
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
	components: {
		results: {
			columns: 2,
		},
		// toolbar: {
		// 	named: {
		// 		topToolBar: {
		// 			hidePagination: true,
		// 		},
		// 	},
		// },
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
		results: {
			columns: 3,
		},
		// toolbar: {
		// 	named: {
		// 		topToolBar: {
		// 			hidePagination: true,
		// 		},
		// 	},
		// },
		autocomplete: {
			vertical: true,
			horizontalTerms: true,
			theme: {
				components: {
					results: {
						rows: 1,
						columns: 4,
					},
					facets: {
						style: {
							// horizontal facets
							width: '100%',
							display: 'flex',
						},
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
		results: {
			columns: 4,
		},
		// toolbar: {
		// 	named: {
		// 		topToolBar: {
		// 			hidePagination: true,
		// 		},
		// 	},
		// },
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
