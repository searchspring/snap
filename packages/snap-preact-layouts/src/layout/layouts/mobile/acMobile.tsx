import { results as resultsLayout } from '../../containers/acResults';
import type { AutocompleteLayoutFunc } from '@searchspring/snap-preact-components';

export const acMobile: AutocompleteLayoutFunc = ({ controller }) => {
	const { pagination, hasQuery } = controller.store;

	return hasQuery
		? [
				{
					name: 'autocomplete-container',
					layout: {
						justifyContent: 'space-between',
					},
					items: [
						{
							name: 'content',
							layout: {
								gap: '10px',
								flexDirection: 'column',
							},
							items: [
								{
									component: 'GroupedTerms',
									props: {
										controller: controller,
										retainHistory: Boolean(pagination.totalPages),
										horizontal: true,
									},
								},
								{
									name: 'resultsContainer',
									layout: {
										flexDirection: 'column',
									},
									items: [
										resultsLayout(controller, 'mobile'),
										{
											component: 'SeeMore',
											layout: {
												textAlign: 'right',
											},
										},
									],
								},
							],
						},
					],
				},
		  ]
		: [
				{
					name: 'autocomplete-container',
					layout: {
						justifyContent: 'space-between',
					},
					items: [
						{
							name: 'content',
							items: [
								{
									component: 'GroupedTerms',
								},
							],
						},
					],
				},
		  ];
};
