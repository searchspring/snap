import { css, keyframes } from '@emotion/react';
import type { LoadMoreProps } from '../../../../components/Molecules/LoadMore';
import Color from 'color';

// CSS in JS style script for the LoadMore component
const loadMoreStyleScript = ({ pagination, progressIndicatorWidth, progressIndicatorSize, color, backgroundColor, theme }: LoadMoreProps) => {
	const variables = theme?.variables;

	const barColour = new Color(color || variables?.colors.accent);
	const backgroundColour = backgroundColor ? new Color(backgroundColor) : barColour.lightness(90);

	return css({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '20px',
		'.ss__load-more__button--hidden': {
			display: 'none',
		},
		'.ss__button': {
			'.ss__button__content': {
				display: 'inline-flex',
				alignItems: 'center',
				gap: '5px',
			},
		},
		'.ss__load-more__icon': {
			animation: `${keyframes({
				'0%': { transform: `rotate(0deg)` },
				'100%': { transform: `rotate(360deg)` },
			})} linear 1s infinite`,
		},
		'.ss__load-more__progress': {
			display: 'flex',
			flexDirection: 'column',
			gap: '5px',
			'.ss__load-more__progress__indicator': {
				width: progressIndicatorWidth,
				background: backgroundColour.hex(),
				borderRadius: progressIndicatorSize,
				'.ss__load-more__progress__indicator__bar': {
					width: pagination ? `${(pagination.end / pagination.totalResults) * 100}%` : '',
					background: barColour.hex(),
					borderRadius: progressIndicatorSize,
					height: progressIndicatorSize,
				},
			},
			'.ss__load-more__progress__text': {
				textAlign: 'center',
			},
		},
	});
};

// LoadMore component props
export const loadMore: Partial<LoadMoreProps> = {
	styleScript: loadMoreStyleScript,
};
