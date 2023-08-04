import { Product } from '@searchspring/snap-store-mobx';

export const resultLayout: LayoutFunc = ({
	result,
}: {
	controller: SearchController | AutocompleteController | RecommendationController;
	result: Product;
}) => {
	const { core } = result.mappings;

	return [
		{
			name: 'Result-Component',
			layout: {
				justifyContent: 'space-around',
				flexDirection: 'column',
				height: '100%',
			},
			items: [
				{
					layout: {
						style: { position: 'relative' },
					},

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
						content: `${core?.name}`,
					},
				},
				// {
				//     component: "swatches",
				//     props: {
				//         data: result.attributes?.swatches
				//     }
				// },
				{
					component: 'Rating',
					props: {
						rating: result.attributes.ratingstar as number,
					},
				},
				{
					name: 'pricingWrapper',
					layout: {
						justifyContent: 'column',
					},
					items: [
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
					],
				},
				{
					component: 'Button',
					props: {
						content: 'add to cart',
						onClick: (e: any) => {
							// run something on the window?
							console.log('you clicked it!', e, result);
						},
					},
				},
			],
		},
	];
};

export const listResultLayout: LayoutFunc = ({ result }: any) => {
	const { core } = result.mappings;

	return [
		{
			name: 'Result-Component',
			layout: {
				justifyContent: 'space-between',
				flexDirection: 'row',
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
					name: 'details',
					layout: {
						flexDirection: 'column',
					},
					items: [
						{
							component: 'String',
							props: {
								content: `${core?.name}`,
							},
						},
						// {
						//     component: "swatches",
						//     props: {
						//         data: result.attributes?.swatches
						//     }
						// },
						// {
						//     component: "ratings",
						//     props: {
						//         rating: result.attributes.ratingstar
						//     }
						// },
						{
							name: 'pricingWrapper',
							layout: {
								justifyContent: 'column',
							},
							items: [
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
							],
						},
						{
							component: 'Button',
							props: {
								content: 'add to cart',
								onClick: (e: any) => {
									// run something on the window?
									console.log('you clicked it!', e, result);
								},
							},
						},
					],
				},
			],
		},
	];
};
