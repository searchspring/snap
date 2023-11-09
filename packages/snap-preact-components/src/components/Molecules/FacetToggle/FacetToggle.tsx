/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { mergeProps, defined } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import type { FacetValue } from '@searchspring/snap-store-mobx';
import { Toggle, ToggleProps } from '../../Atoms/Toggle';

const CSS = {
	toggle: ({}: Partial<FacetToggleProps>) => css({}),
};

export const FacetToggle = observer((properties: FacetToggleProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<FacetToggleProps> = {
		label: properties.value.label,
	};

	const props = mergeProps('facetToggle', globalTheme, defaultProps, properties);

	const { value, label, onClick, disableStyles, className, style, styleScript } = props;

	const subProps: FacetToggleSubProps = {
		Toggle: {
			// default props
			// global theme
			...globalTheme?.components?.toggle,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.toggle(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const clickFunc = (e: React.MouseEvent<Element, MouseEvent>, toggled: boolean) => {
		value.url?.link?.onClick(e);
		onClick && onClick(e, toggled);
	};

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-toggle', className)}>
				<Toggle
					{...subProps.Toggle}
					label={label}
					onClick={(e, toggled) => {
						clickFunc(e, toggled);
					}}
				/>
			</div>
		</CacheProvider>
	);
});

export interface FacetToggleProps extends ComponentProps {
	value: FacetValue;
	label?: string;
	onClick?: (e: React.MouseEvent, toggled: boolean) => void;
}

interface FacetToggleSubProps {
	Toggle: Partial<ToggleProps>;
}
