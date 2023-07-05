import { h } from 'preact';
import { observer } from 'mobx-react';

import { Layout as LayoutLib } from '@searchspring/snap-preact-components';

type LayoutProps = {
	controller?: SearchController;
};

export const Layout = observer((properties: LayoutProps): JSX.Element => {
	const controller = properties.controller;

	const layout = [
		{
			name: 'header',
			layout: {
				justifyContent: 'flex-end',
			},
			items: [
				{
					component: 'Pagination',
					props: {
						hideLast: true,
					},
				},
			],
		},
		{
			name: 'main-container',
			layout: {
				// gap: '40px',
			},
			items: [
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
				{
					component: 'Results',
					layout: {
						width: '75%',
					},
				},
			],
		},
		{
			name: 'footer',
			items: [
				{
					component: 'Banner',
					props: { type: 'footer' },
				},
				{
					component: 'Pagination',
				},
			],
		},
	];

	return <LayoutLib controller={controller} layout={layout} />;
});
