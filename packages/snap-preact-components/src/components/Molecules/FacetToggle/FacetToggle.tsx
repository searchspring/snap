/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import type { FacetValue } from '@searchspring/snap-store-mobx';

const CSS = {
	toggle: ({ activeColor, inactiveColor: deActiveColor, buttonColor }: Partial<FacetToggleProps>) =>
		css({
			display: 'flex',
			alignItems: 'center',

			/* The switch - the box around the slider */
			'& .ss__facet-toggle__switch': {
				position: 'relative',
				display: 'inline-block',
				width: '60px',
				height: '34px',
				margin: '10px',
			},

			/* Hide default HTML checkbox */
			'& .ss__facet-toggle__switch input': {
				opacity: '0',
				width: '0',
				height: '0',
			},

			/* The slider */
			'& .ss__facet-toggle__slider': {
				position: 'absolute',
				cursor: 'pointer',
				top: '0',
				left: '0',
				right: '0',
				bottom: '0',
				backgroundColor: `${deActiveColor}`,
				transition: '.4s',
			},

			'& .ss__facet-toggle__slider:before': {
				position: 'absolute',
				content: "''",
				height: '26px',
				width: '26px',
				left: '4px',
				bottom: '4px',
				backgroundColor: `${buttonColor}`,
				transition: '.4s',
			},

			'& input:checked + .ss__facet-toggle__slider': {
				backgroundColor: `${activeColor}`,
			},

			'& input:focus + .ss__facet-toggle__slider': {
				boxShadow: '0 0 1px #2196F3',
			},

			'& input:checked + .ss__facet-toggle__slider:before': {
				transform: 'translateX(26px)',
			},

			/* Rounded sliders */
			'& .ss__facet-toggle__slider.ss__facet-toggle__slider--round': {
				borderRadius: '34px',
			},

			'& .ss__facet-toggle__slider.ss__facet-toggle__slider--round:before': {
				borderRadius: '50%',
			},
		}),
};

export const FacetToggle = observer((properties: FacetToggleProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<FacetToggleProps> = {
		round: true,
		activeColor: '#2196F3',
		inactiveColor: '#ccc',
		buttonColor: 'white',
	};

	const props = mergeProps('facetToggle', globalTheme, defaultProps, properties);

	const { value, round, label, onClick, disableStyles, className, style, styleScript } = props;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.toggle(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const clickFunc = (e: React.MouseEvent<Element, MouseEvent>) => {
		value.url?.link?.onClick(e);
		onClick && onClick(e);
	};

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-toggle', className)}>
				{label && <label className="ss__facet-toggle__label">{label}</label>}

				<label className={`ss__facet-toggle__switch ${value.filtered ? 'ss__facet-toggle__switch--filtered' : ''}`} onClick={(e) => clickFunc(e)}>
					<input checked={value.filtered} type="checkbox" />

					<span className={`ss__facet-toggle__slider ${round ? 'ss__facet-toggle__slider--round' : ''}`}></span>
				</label>
			</div>
		</CacheProvider>
	);
});

export interface FacetToggleProps extends ComponentProps {
	value: FacetValue;
	label?: string;
	round?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	activeColor?: string;
	inactiveColor?: string;
	buttonColor?: string;
}
