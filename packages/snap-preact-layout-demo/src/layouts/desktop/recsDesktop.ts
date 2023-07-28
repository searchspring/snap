// import { useRef } from 'preact/hooks';
import { resultLayout } from '../containers/resultLayout';

//TODO: try using createRef up here outside of layout for prev/next buttons

export const recsDesktop: LayoutFunc<RecommendationController> = ({ controller }: any) => {
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
					component: 'HTML',
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
								children: {
									component: 'Icon',
									props: {
										icon: 'angle-left',
									},
								},
							},
							layout: {
								width: '5%',
								justifyContent: 'left',
							},
						},
						{
							component: 'Carousel',
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
								children: {
									component: 'Icon',
									props: {
										icon: 'angle-right',
									},
								},
							},
						},
					],
				},
			],
		},
	];
};
