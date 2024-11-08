import { Fragment, h } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css, keyframes } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { mergeProps, mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<LoadingBarProps> = ({ color, height, backgroundColor, theme }) => {
	const animation = keyframes({
		from: { left: '-200px', width: '30%' },
		'50%': { width: '30%' },
		'70%': { width: '70%' },
		'80%': { left: '50%' },
		'95%': { left: '120%' },
		to: { left: '100%' },
	});

	return css({
		height: height,
		position: 'fixed',
		top: '0',
		left: '0',
		right: '0',
		margin: 'auto',
		transition: 'opacity 0.3s ease',
		opacity: '1',
		visibility: 'visible',
		zIndex: '10000',
		background: backgroundColor || theme?.variables?.colors?.secondary || '#f8f8f8',

		'& .ss__loading-bar__bar': {
			position: 'absolute',
			top: '0',
			left: '-200px',
			height: '100%',
			background: `${color || theme?.variables?.colors?.primary || '#ccc'}`,
			animation: `${animation} 2s linear infinite`,
		},
	});
};

export const LoadingBar = observer((properties: LoadingBarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<LoadingBarProps> = {
		height: '5px',
	};

	const props = mergeProps('loadingBar', globalTheme, defaultProps, properties);

	const { active, className } = props;

	const styling = mergeStyles<LoadingBarProps>(props, defaultStyles);

	return active ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__loading-bar', className)}>
				<div className="ss__loading-bar__bar"></div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface LoadingBarProps extends ComponentProps {
	active: boolean;
	color?: string;
	backgroundColor?: string;
	height?: string;
}
