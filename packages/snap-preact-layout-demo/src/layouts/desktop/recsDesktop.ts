// import { useRef } from 'preact/hooks';
import type { RecommendationLayoutFunc } from '@searchspring/snap-preact-components';
import { resultLayout } from '../containers/resultLayout';

//TODO: try using createRef up here outside of layout for prev/next buttons

export const recsDesktop: RecommendationLayoutFunc = ({ controller }: any) => {
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
					component: 'String',
					props: {
						content: 'Recommended For You',
					},
				},
				{
					layout: {
						flexDirection: 'row',
						justifyContent: 'space-between',
					},
					items: [
						{
							component: 'Button',
							props: {
								className: prevButtonClass,
							},
							layout: {
								width: '5%',
								justifyContent: 'left',
							},
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
							component: 'CarouselLayout',
							layout: {
								width: '90%',
							},
							props: {
								slidesPerView: 5,
								slidesPerGroup: 5,
								spaceBetween: 10,
								prevButtonSelector: `.${prevButtonClass}`,
								nextButtonSelector: `.${nextButtonClass}`,
								slides: controller.store.results,
								slideLayout: resultLayout,
							},
						},

						{
							layout: {
								width: '5%',
								justifyContent: 'right',
							},
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
	];
};
