// import { useRef } from 'preact/hooks';
import type { RecommendationLayoutFunc } from '@searchspring/snap-preact-components';
import { resultLayout } from '../../containers/resultLayout';

//TODO: try using createRef up here outside of layout for prev/next buttons

export const recsMobile: RecommendationLayoutFunc = ({ controller }: any) => {
	const prevButtonClass = 'ss__carousel__prev';
	const nextButtonClass = 'ss__carousel__next';

	return [
		{
			name: 'recommendations',
			layout: {
				flexDirection: 'column',
			},
			items: [
				{
					name: 'topToolbar',
					layout: {
						justifyContent: 'space-between',
					},
					items: [
						{
							component: 'String',
							props: {
								content: 'Recommended For You',
							},
						},
						{
							layout: {
								flexDirection: 'row',
							},
							items: [
								{
									component: 'Button',
									props: {
										className: prevButtonClass,
									},
									layout: {},
									items: [
										{
											component: 'Icon',
											props: {
												icon: 'angle-left',
											},
										},
									],
								},
								{
									layout: {},
									component: 'Button',
									props: {
										className: nextButtonClass,
									},
									items: [
										{
											component: 'Icon',
											props: {
												icon: 'angle-right',
											},
										},
									],
								},
							],
						},
					],
				},
				{
					component: 'CarouselLayout',
					props: {
						slidesPerView: 2,
						slidesPerGroup: 2,
						spaceBetween: 10,
						prevButtonSelector: `.${prevButtonClass}`,
						nextButtonSelector: `.${nextButtonClass}`,
						slides: controller.store.results,
						slideLayout: resultLayout,
					},
				},
			],
		},
	];
};
