export const sidebar: LayoutFunc<SearchController> = () => {
	return [
		{
			name: 'sidebar',
			layout: {
				flexDirection: 'column',
			},
			items: [
				{
					component: 'FilterSummary',
				},
				{
					component: 'Facets',
				},
			],
		},
	];
};
