/** @jsx jsx */
import { h, Fragment } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Flex, FlexProps } from '../../Atoms/Flex/Flex';
import { Theme, useTheme, CacheProvider, ControllerProvider } from '../../../providers';

import { ComponentProps, StylingCSS } from '../../../types';

import type { SearchController } from '@searchspring/snap-controller';

// dynamically imported lazy loaded components

const Facets = lazy(async () => {
	return (await import('../../Organisms/Facets/')).Facets;
});

const FilterSummary = lazy(async () => {
	return (await import('../../Organisms/FilterSummary/')).FilterSummary;
});

const Results = lazy(async () => {
	return (await import('../../Organisms/Results/')).Results;
});

const Pagination = lazy(async () => {
	return (await import('../../Molecules/Pagination/')).Pagination;
});

const Banner = lazy(async () => {
	return (await import('../../Atoms/Merchandising/Banner/')).Banner;
});

const componentMap = {
	Banner,
	Facets,
	FilterSummary,
	Results,
	Pagination,
};

// CSS in JS
const CSS = {
	layout: ({ width, height }: FlexProps) =>
		css({
			width,
			height,
		}),
};

export const Layout = observer((properties: LayoutProps) => {
	const globalTheme: Theme = useTheme();

	const props: LayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.flex,
		// props
		...properties,
		...properties.theme?.components?.flex,
	};
	const { controller, layout, width, height, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({ width, height }), style];
	} else if (style) {
		styling.css = [style];
	}

	const LayoutElements = containerize(controller, layout);

	return (
		<ControllerProvider controller={controller}>
			<CacheProvider>
				<div {...styling} className={classnames('ss__layout', className)}>
					{/* loop through layout component tree built above and render comonents with props within Flex and FlexItem components */}
					<LayoutElements />
				</div>
			</CacheProvider>
		</ControllerProvider>
	);
});

function generateLayoutClassName(name?: string) {
	const normalizedName = name
		?.trim()
		.split(/\.?(?=[A-Z])/)
		.join('-')
		.toLowerCase();
	return name ? `ss__layout__${normalizedName}` : '';
}

function containerize(controller: SearchController, layout: LayoutElements[]) {
	return () => {
		return (
			<Fragment>
				{layout.map((element) => {
					if ((element as LayoutContainerElement).items) {
						const containerElement = element as LayoutContainerElement;
						const InnerContainer = containerize(controller, containerElement.items);

						return (
							<Flex className={generateLayoutClassName(element.name)} {...element.layout}>
								<InnerContainer />
							</Flex>
						);
					} else {
						const itemElement = element as LayoutComponentElement;
						const Component = componentMap[itemElement.component as keyof typeof componentMap];

						return (
							<Flex
								className={classnames(generateLayoutClassName(itemElement.name), generateLayoutClassName(itemElement.component))}
								item
								{...itemElement.layout}
							>
								<Suspense fallback={<Fragment />}>
									<Component controller={controller} {...itemElement.props} />
								</Suspense>
							</Flex>
						);
					}
				})}
			</Fragment>
		);
	};
}

export type LayoutElements = LayoutContainerElement | LayoutComponentElement;

export type LayoutContainerElement = {
	name?: string;
	type?: 'Flex'; // supported layout container elements
	width?: string;
	height?: string;
	layout?: FlexProps;
	items: LayoutElements[];
};

export type LayoutComponentElement = {
	name?: string;
	component: 'Banner' | 'Results' | 'Pagination' | 'Facets' | 'FilterSummary'; // supported components
	layout?: FlexProps;
	props?: any;
};

export interface LayoutProps extends ComponentProps {
	controller: SearchController;
	layout: LayoutElements[];
}
