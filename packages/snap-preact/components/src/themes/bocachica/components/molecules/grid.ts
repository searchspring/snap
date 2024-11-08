import { css } from '@emotion/react';
import type { GridProps } from '../../../../components/Molecules/Grid';

// CSS in JS style script for the Grid component
const gridStyleScript = ({ theme, columns, gapSize, disableOverflowAction }: Partial<GridProps>) => {
	return css({
		'.ss__grid__options': {
			display: 'flex',
			flexFlow: 'row wrap',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,
			gap: gapSize,
			gridAutoRows: `1fr`,

			'.ss__grid__option': {
				display: 'flex',
				flexDirection: 'column',
				boxSizing: 'content-box',
				backgroundRepeat: 'no-repeat',
				backgroundSize: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px)`,
				backgroundPosition: 'center !important',
				justifyContent: 'center',
				alignItems: 'center',
				flex: '0 1 auto',
				border: `1px solid ${theme?.variables?.colors?.primary}`,
				borderRadius: '3px',
				textAlign: 'center',
				wordBreak: 'break-all',
				padding: '1em 0',
				width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px)`,
				margin: `0 ${gapSize} ${gapSize} 0`,

				'.ss__grid__option__label': {
					cursor: 'pointer',
				},

				[`:nth-of-type(${columns}n)`]: {
					marginRight: '0',
				},
				'&.ss__grid__option--selected': {
					border: `3px solid ${theme?.variables?.colors?.primary || '#333'}`,
					fontWeight: 'bold',
				},

				'&.ss__grid__option--disabled': {
					position: 'relative',
					opacity: '.5',
					cursor: 'none',
					pointerEvents: 'none',
				},

				'&.ss__grid__option--unavailable': {
					position: 'relative',
					opacity: '.5',
				},

				'&.ss__grid__option--disabled:before, &.ss__grid__option--unavailable:before': {
					content: '""',
					display: 'block',
					position: 'absolute',
					top: '50%',
					width: '90%',
					height: '1px',
					borderTop: '3px solid #eee',
					outline: '1px solid #ffff',
					transform: 'rotate(-45deg)',
				},

				'&:hover:not(.ss__grid__option--selected)': {
					cursor: 'pointer',
				},
			},

			'@supports (display: grid)': {
				display: 'grid',

				'.ss__grid__option': {
					padding: '0',
					margin: '0',
					width: 'initial',
				},
				'&::before': {
					content: '""',
					width: 0,
					paddingBottom: '100%',
					gridRow: '1 / 1',
					gridColumn: '1 / 1',
				},
				'&> *:first-of-type': {
					gridRow: '1 / 1',
					gridColumn: '1 / 1',
				},
			},
		},

		'.ss__grid__show-more-wrapper': {
			'&:not(.ss__grid__option)': {
				margin: '8px',
			},
			'&:hover': {
				cursor: disableOverflowAction ? 'initial !important' : 'pointer !important',
			},
		},
	});
};

// Grid component props
export const grid: Partial<GridProps> = {
	themeStyleScript: gridStyleScript,
	hideShowLess: true,
	overflowButtonInGrid: true,
};
