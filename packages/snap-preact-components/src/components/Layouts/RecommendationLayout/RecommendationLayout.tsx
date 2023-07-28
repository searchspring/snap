/** @jsx jsx */
import { h, Fragment } from 'preact';
import { ThemeProvider } from '../../../providers';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, ControllerProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

import type { RecommendationController } from '@searchspring/snap-controller';
import type { ComponentProps, StylingCSS } from '../../../types';

import { Layout, LayoutFuncWrapper, LayoutTypes } from '../Layout';

// CSS in JS
const CSS = {
	layout: ({}: Partial<RecommendationLayoutProps>) =>
		css({
			position: 'relative',
		}),
};

export const RecommendationLayout = observer((properties: RecommendationLayoutProps) => {
	const globalTheme: Theme = useTheme();

	const props: RecommendationLayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.recommendationLayout,
		// props
		...properties,
		...properties.theme?.components?.recommendationLayout,
	};
	const { controller, breakpoints, disableStyles, className, style, theme } = props;
	let layout = props.layout;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({}), style];
	} else if (style) {
		styling.css = [style];
	}

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
						<div {...styling} className={classnames('ss__recomendation-layout', className)}>
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

export interface RecommendationLayoutProps extends ComponentProps {
	controller: RecommendationController;
	layout?: LayoutTypes;
	width?: string;
	height?: string;
	breakpoints?: {
		[key: number]: LayoutFuncWrapper;
	};
}
