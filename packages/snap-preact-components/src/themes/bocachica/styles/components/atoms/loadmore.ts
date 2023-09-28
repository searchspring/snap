import { keyframes } from '@emotion/react';

import { css, LoadMoreProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the LoadMore component
const loadMoreStyleScript = ({
	pagination,
	hideProgressIndicator,
	hideProgressText,
	progressIndicatorWidth,
	progressIndicatorSize,
	color,
	backgroundColor,
	theme,
}: LoadMoreProps) => {
	const variables = theme?.variables as BocachicaVariables;

	const radialAngle = ((360 / 100) * Math.floor((pagination!.end / pagination!.totalResults) * 100)) / 2;
	const radialAnimation = keyframes({
		'0%': { transform: `rotate(0deg)` },
		'100%': { transform: `rotate(${radialAngle}deg)` },
	});
	const iconRotateAnimation = keyframes({
		'0%': { transform: `rotate(0deg)` },
		'100%': { transform: `rotate(360deg)` },
	});

	return css({
		'& .ss__loadMore__button': {
			'& .ss__icon--spinner': {
				marginLeft: '5px',
				animation: `${iconRotateAnimation} linear 1s infinite`,
			},
		},
		'&.ss__loadMore--bar': {
			display: 'flex',
			flexDirection: 'column',
			width: 'fit-content',
			gap: '20px',

			'& .ss__loadMore__button': {
				margin: '0 auto',
			},
			'& .ss__loadMore__progress': {
				display: 'flex',
				flexDirection: 'column',
				gap: '5px',
				'& .ss__loadMore__progress__indicator': {
					width: '100%',
					maxWidth: `${progressIndicatorWidth}px`,
					background: backgroundColor || variables?.color?.secondary || '#f8f8f8',
					borderRadius: `${progressIndicatorSize}px`,
					'& .ss__loadMore__progress__indicator__bar': {
						width: pagination ? `${(pagination.end / pagination.totalResults) * 100}%` : '',
						background: color || variables?.color?.primary || '#ccc',
						borderRadius: `${progressIndicatorSize}px`,
						height: `${progressIndicatorSize}px`,
					},
				},
				'& .ss__loadMore__progress__text': {},
			},
		},
		'&.ss__loadMore--radial': {
			display: 'flex',
			alignItems: 'center',
			gap: '10px',
			'& .ss__loadMore__button': {
				height: 'fit-content',
			},
			'& .ss__loadMore__progress': {
				// remove height if progress indicator is hidden but hideProgressText is not
				height: !hideProgressText && hideProgressIndicator ? undefined : `${progressIndicatorWidth}px`,

				'& .ss__loadMore__progress__indicator': {
					'& .ss__loadMore__progress__indicator__radial': {
						'& .ss__loadMore__progress__indicator__radial__circle': {
							background: backgroundColor || variables?.color?.secondary || '#f8f8f8',
							height: `${progressIndicatorWidth}px`,
							width: `${progressIndicatorWidth}px`,
							borderRadius: '50%',

							'& .ss__loadMore__progress__indicator__radial__circle__mask, .ss__loadMore__progress__indicator__radial__circle__mask__fill': {
								width: `${progressIndicatorWidth}px`,
								height: `${progressIndicatorWidth}px`,
								position: 'absolute',
								borderRadius: '50%',
							},
							'& .ss__loadMore__progress__indicator__radial__circle__mask': {
								clip: `rect(0px, ${progressIndicatorWidth}px, ${progressIndicatorWidth}px, ${progressIndicatorWidth! / 2}px)`,
							},
							'& .ss__loadMore__progress__indicator__radial__circle__mask__fill': {
								animation: `${radialAnimation} ease-in-out 1s`,
								transform: `rotate(${radialAngle}deg)`,
							},
						},
						'& .ss__loadMore__progress__text': {
							width: `${progressIndicatorWidth! - progressIndicatorSize!}px`,
							height: `${progressIndicatorWidth! - progressIndicatorSize!}px`,
							borderRadius: '50%',
							background: '#fff',
							lineHeight: `${progressIndicatorWidth! - progressIndicatorSize!}px`,
							textAlign: 'center',
							marginTop: `${progressIndicatorSize! / 2}px`,
							marginLeft: `${progressIndicatorSize! / 2}px`,
							position: 'absolute',
							fontSize: `calc(${progressIndicatorWidth}px / ${Math.max(1, `${pagination!.end}`.length + `${pagination!.totalResults}`.length)})`,
						},
						'& .ss__loadMore__progress__indicator__radial__circle__mask': {
							'& .ss__loadMore__progress__indicator__radial__circle__mask__fill': {
								clip: `rect(0px, ${progressIndicatorWidth! / 2 + 0.5}px, ${progressIndicatorWidth}px, 0px)`,
								backgroundColor: color || variables?.color?.primary || '#ccc',
							},
							'&.ss__loadMore__progress__indicator__radial__circle__mask--full': {
								animation: `${radialAnimation} ease-in-out 1s`,
								transform: `rotate(${radialAngle}deg)`,
							},
						},
					},
				},
			},
		},
	});
};

// LoadMore component props
export const loadMore: Partial<LoadMoreProps> = {
	styleScript: loadMoreStyleScript,
	progressIndicator: 'radial',
};
