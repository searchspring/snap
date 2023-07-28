/** @jsx jsx */
import { h, Fragment } from 'preact';
import { ThemeProvider } from '../../../providers';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider, ControllerProvider } from '../../../providers';
import { Layout } from '../Layout';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import type { SearchController } from '@searchspring/snap-controller';
import type { ComponentProps, StylingCSS } from '../../../types';
import type { LayoutFuncWrapper, LayoutTypes } from '../Layout';

// CSS in JS
const CSS = {
	layout: ({ width, height }: Partial<SearchLayoutProps>) =>
		css({
			width,
			height,
		}),
};

export const SearchLayout = observer((properties: SearchLayoutProps) => {
	const globalTheme: Theme = useTheme();

	const props: SearchLayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.searchLayout,
		// props
		...properties,
		...properties.theme?.components?.searchLayout,
	};
	const { controller, breakpoints, width, height, disableStyles, className, style, theme } = props;
	let layout = props.layout;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({ width, height }), style];
	} else if (style) {
		styling.css = [style];
	}

	// TODO: make useDisplaySettings generic
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

	if (layout) {
		return (
			<ControllerProvider controller={controller}>
				<ThemeProvider theme={theme || {}}>
					<CacheProvider>
						<div {...styling} className={classnames('ss__search-layout', className)}>
							{/* loop through layout component tree built above and render comonents with props within Flex and FlexItem components */}
							<Layout controller={controller} layout={layout} />
						</div>
					</CacheProvider>
				</ThemeProvider>
			</ControllerProvider>
		);
	} else {
		return <Fragment></Fragment>;
	}
});

export interface SearchLayoutProps extends ComponentProps {
	controller: SearchController;
	layout?: LayoutTypes;
	width?: string;
	height?: string;
	breakpoints?: {
		[key: number]: LayoutFuncWrapper;
	};
}
