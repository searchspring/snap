// import { useRef } from 'preact/hooks';
import { resultLayout } from '../containers/resultLayout';

//TODO: try using createRef up here outside of layout for prev/next buttons

export const recsMobile: LayoutFunc = ({ controller }: any) => {
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
							component: 'HTML',
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
										children: {
											component: 'Icon',
											props: {
												icon: 'angle-left',
											},
										},
									},
								},
								{
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
				{
					component: 'Carousel',
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
