/** @jsx jsx */
import { h, Fragment } from 'preact';
import { ThemeProvider } from '../../../providers';
import deepmerge from 'deepmerge';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, ControllerProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { createHoverProps } from '../../../toolbox';
import type { AutocompleteController } from '@searchspring/snap-controller';
import type { ComponentProps, StylingCSS } from '../../../types';
import { FacetDisplay } from '../../../types';

import { Layout, LayoutFuncWrapper, LayoutTypes } from '../Layout';

// CSS in JS
const CSS = {
	layout: ({ width, height }: Partial<AutocompleteLayoutProps>) =>
		css({
			width,
			height,
		}),
};

export const AutocompleteLayout = observer((properties: AutocompleteLayoutProps) => {
	const globalTheme: Theme = useTheme();

	let props: AutocompleteLayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.autocompleteLayout,
		// props
		...properties,
		...properties.theme?.components?.autocompleteLayout,
	};

	const valueProps = createHoverProps();

	const themeDefaults: Theme = {
		components: {
			facets: {
				limit: 3,
				facets: props?.controller.store?.facets.length ? props?.controller.store.facets.filter((facet) => facet.display !== FacetDisplay.SLIDER) : [],
			},
			facet: {
				limit: 6,
				disableOverflow: true,
				disableCollapse: true,
				previewOnFocus: true,
				valueProps,
			},
			facetGridOptions: {
				columns: 3,
			},
			facetHierarchyOptions: {
				hideCount: true,
			},
			facetListOptions: {
				hideCheckbox: true,
				hideCount: true,
			},
			facetPaletteOptions: {
				hideLabel: true,
				columns: 3,
			},
			result: {
				hideBadge: true,
			},
		},
	};

	// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)
	const theme = deepmerge(themeDefaults, props?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	props = {
		...props,
		theme,
	};

	const { controller, input, breakpoints, width, height, disableStyles, className, style } = props;
	let layout = props.layout;

	const visible = Boolean(input === controller.store.state.focusedInput);

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({ width, height }), style];
	} else if (style) {
		styling.css = [style];
	}

	// TODO: make useDisplaySettings generic?
	if (breakpoints) {
		const displaySettings = useDisplaySettings(breakpoints);
		if (displaySettings) {
			if (typeof displaySettings == 'function') {
				layout = displaySettings;
			} else if (Array.isArray(displaySettings)) {
				layout = displaySettings;
			}
		}
	}

	if (layout && visible) {
		return (
			<ControllerProvider controller={controller}>
				<ThemeProvider theme={theme || {}}>
					<CacheProvider>
						<div {...styling} className={classnames('ss__AClayout', className)}>
							{/* loop through layout component tree built above and render comonents with props within Flex and FlexItem components */}
							{/* <LayoutElements /> */}
							<Layout controller={controller} data={{ input }} layout={layout} />
						</div>
					</CacheProvider>
				</ThemeProvider>
			</ControllerProvider>
		);
	} else {
		return <Fragment></Fragment>;
	}
});

export interface AutocompleteLayoutProps extends ComponentProps {
	controller: AutocompleteController;
	layout?: LayoutTypes;
	width?: string;
	height?: string;
	breakpoints?: {
		[key: number]: LayoutFuncWrapper;
	};
	input: Element;
}
