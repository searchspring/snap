import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { mergeProps, defined } from '../../../utilities';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import type { FacetValue, ValueFacet } from '@searchspring/snap-store-mobx';
import { Toggle, ToggleProps } from '../../Atoms/Toggle';

const CSS = {
	toggle: ({}: Partial<FacetToggleProps>) => css({}),
};

export const FacetToggle = observer((properties: FacetToggleProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	let value: FacetValue | undefined = undefined;
	if (properties.values && properties.values.length == 1) {
		value = properties.values[0];
	} else if (properties.facet && properties.facet.values.length == 1) {
		value = properties.facet.values[0] as FacetValue;
	}

	const defaultProps: Partial<FacetToggleProps> = {
		label: value?.label,
	};

	const props = mergeProps('facetToggle', globalTheme, defaultProps, properties);

	const { label, onClick, disableStyles, className, style, styleScript, treePath } = props;

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
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.toggle(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const clickFunc = (e: React.MouseEvent<Element, MouseEvent>, toggled: boolean) => {
		value?.url?.link?.onClick(e);
		onClick && onClick(e, toggled);
	};

	return value ? (
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
	) : (
		<Fragment></Fragment>
	);
});

export interface FacetToggleProps extends ComponentProps {
	values?: FacetValue[];
	facet?: ValueFacet;
	label?: string;
	onClick?: (e: React.MouseEvent, toggled: boolean) => void;
}

interface FacetToggleSubProps {
	Toggle: Partial<ToggleProps>;
}
