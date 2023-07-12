import type { ResultLayoutFunc } from '@searchspring/snap-preact-components';

export const resultLayout: ResultLayoutFunc = ({ controller, result }) => {
	const { core } = result.mappings;
	console.log(controller);

	// const Elem = () => <>not a string</>
	// const someFunc = () => "hi mom";

	return [
		{
			name: 'Result-Component',
			layout: {
				justifyContent: 'space-around',
				flexDirection: 'column',
			},
			items: [
				{
					layout: {},
					items: [
						{
							component: 'Image',
							props: {
								src: core?.imageUrl || '', // TODO: make to accept undefined
								alt: core?.name || '',
								// hoverSrc: core?.thumbnailImageUrl
							},
						},
						{
							component: 'Badge',
							props: {
								content: core?.msrp && core.price && core.msrp > core.price ? 'Sale' : '',
							},
						},
					],
				},
				{
					component: 'String',
					props: {
						content: core?.name,
					},
				},
				{
					component: 'Price',
					className: 'strike',
					props: {
						value: core?.msrp || 0, // TODO: make to accept undefined
						lineThrough: true,
					},
				},
				{
					component: 'Price',
					className: 'sale',
					props: {
						value: core?.price || 0, // TODO: make to accept undefined
					},
				},
				{
					component: 'Button',
					props: {
						content: 'add to cart',
						onClick: (e) => {
							// run something on the window?
							console.log('you clicked it!', e, result);
						},
					},
				},
			],
		},
	];
};
