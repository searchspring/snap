/** @jsx jsx */
import { h, Fragment } from 'preact';
import { memo } from 'preact/compat';
import { jsx } from '@emotion/react';
import classnames from 'classnames';

import { Container } from './Container';
import { ResultLayoutFunc, LayoutElement, ResultLayoutTypes } from '../ResultLayout';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import { Product } from '@searchspring/snap-store-mobx';
import { Theme } from '../../../providers';
import { Badge, Button, FormattedNumber, Icon, Image, Price, Rating, Skeleton, Element, Carousel } from '../../../index';

export type ResultLayoutComponentMap = {
	[componentName: string]: {
		component: any;
		layoutProps?: string[];
	};
};

type ComponentizeProps = {
	result: Product;
	controller: AutocompleteController | RecommendationController | SearchController;
	layout: LayoutElement | LayoutElement[] | ResultLayoutFunc;
	theme?: Theme;
};

function generateLayoutClassName(name?: string) {
	const normalizedName = name
		?.trim()
		.split(/\.?(?=[A-Z])/)
		.join('-')
		.toLowerCase();
	return name ? `ss__layout__${normalizedName}` : '';
}

// componentMap must be type ResultLayoutComponentMap but isn't to allow for keyof typeof componentMap
const componentMap: ResultLayoutComponentMap = {
	/* ATOMS */
	Badge: {
		component: Badge,
	},
	Button: {
		component: Button,
		layoutProps: ['content', 'children'],
	},
	FormattedNumber: {
		component: FormattedNumber,
	},
	Icon: {
		component: Icon,
	},
	Image: {
		component: Image,
	},
	Price: {
		component: Price,
	},
	Rating: {
		component: Rating,
	},
	Skeleton: {
		component: Skeleton,
	},
	Element: {
		component: Element,
	},
	/* MOLECULES */
	Carousel: {
		component: Carousel,
		layoutProps: ['prevButton', 'nextButton', 'children'],
	},
};

export type ComponentMap = typeof componentMap;

function makeLayoutArray(
	controller: AutocompleteController | RecommendationController | SearchController,
	result: Product,
	layout: LayoutElement | LayoutElement[] | ResultLayoutFunc
): LayoutElement[] {
	if (typeof layout == 'function') {
		return layout({ controller, result });
	} else if (Array.isArray(layout)) {
		return layout;
	}

	return [layout];
}

// Componentize component without memoization
const Componentization = (props: ComponentizeProps) => {
	const { controller, result, layout, theme } = props;
	return (
		<Fragment>
			{makeLayoutArray(controller, result, layout).map((element) => {
				if (element.items) {
					// if the element is a Container
					const containerElement = element;
					// const InnerContainer = containerize(data, containerElement.items || [], componentMap);

					return (
						<Container className={generateLayoutClassName(element.name)} {...element.layout}>
							<Componentize controller={controller} result={result} layout={containerElement.items || []} theme={theme} />
						</Container>
					);
				} else if (element.component) {
					// if the element is a component
					const componentMapping = componentMap[element.component as keyof typeof componentMap];
					const Component = componentMapping.component;

					// create Layout from props supporting layout
					const elementProps = element.props || {};
					if (elementProps) {
						Object.keys(elementProps).map((propName) => {
							const layoutProp = elementProps[propName as keyof typeof elementProps] as ResultLayoutTypes;

							// if the component has a prop that is of layout type
							if ((componentMapping.layoutProps || []).includes(propName)) {
								// if the layoutProp value is a LayoutElementType
								if (typeof layoutProp == 'function' || Array.isArray(layoutProp) || typeof layoutProp == 'object') {
									// @ts-ignore - typing is hard
									elementProps[propName as keyof typeof elementProps] = makeLayoutArray(controller, result, layoutProp).map((layout) => (
										<Componentize controller={controller} result={result} layout={layout} theme={theme} />
									));
								}
							}
						});
					}

					return (
						<Container className={classnames(generateLayoutClassName(element.name))} item {...element.layout}>
							<Component controller={controller} result={result} {...(elementProps as any)} breakpoints={{}} theme={theme} />
						</Container>
					);
				}
			})}
		</Fragment>
	);
};

// memoized Componentization component - ensuring component is cached when result.id and other props are unchanged
export const Componentize = memo(Componentization, (prevProps: ComponentizeProps, nextProps: ComponentizeProps) => {
	return (
		prevProps.result.id === nextProps.result.id &&
		prevProps.layout === nextProps.layout &&
		prevProps.controller === nextProps.controller &&
		prevProps.theme === nextProps.theme
	);
});
