/** @jsx jsx */
import { h, Fragment } from 'preact';
import { lazy } from 'preact/compat';
import { Suspense } from 'preact/compat';
import { jsx } from '@emotion/react';
import classnames from 'classnames';

import { Flex } from '../../Atoms/Flex';
import { ResultLayoutFunc } from '.';
import { LayoutElement, ResultLayoutTypes } from '.';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import { Product } from '@searchspring/snap-store-mobx';

export type ResultLayoutComponentMap = {
	[componentName: string]: {
		component: any;
		layoutProps?: string[];
	};
};

function generateLayoutClassName(name?: string) {
	const normalizedName = name
		?.trim()
		.split(/\.?(?=[A-Z])/)
		.join('-')
		.toLowerCase();
	return name ? `ss__layout__${normalizedName}` : '';
}

/* ATOMS */
const Badge = lazy(async () => {
	return (await import('../../Atoms/Badge')).Badge;
});

const Button = lazy(async () => {
	return (await import('../../Atoms/Button')).Button;
});

const FormattedNumber = lazy(async () => {
	return (await import('../../Atoms/FormattedNumber')).FormattedNumber;
});

const Icon = lazy(async () => {
	return (await import('../../Atoms/Icon')).Icon;
});

const Image = lazy(async () => {
	return (await import('../../Atoms/Image')).Image;
});

const Price = lazy(async () => {
	return (await import('../../Atoms/Price')).Price;
});

const Rating = lazy(async () => {
	return (await import('../../Molecules/Rating')).Rating;
});

const Skeleton = lazy(async () => {
	return (await import('../../Atoms/Skeleton')).Skeleton;
});

const String = lazy(async () => {
	return (await import('../../Atoms/String')).String;
});

/* MOLECULES */
const Carousel = lazy(async () => {
	return (await import('../../Molecules/Carousel')).Carousel;
});

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
	String: {
		component: String,
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

export const Componentize = (props: {
	result: Product;
	controller: AutocompleteController | RecommendationController | SearchController;
	layout: LayoutElement | LayoutElement[] | ResultLayoutFunc;
}) => {
	const { controller, result, layout } = props;
	return (
		<Fragment>
			{makeLayoutArray(controller, result, layout).map((element) => {
				if (element.items) {
					// if the element is a Flex
					const containerElement = element;
					// const InnerContainer = containerize(data, containerElement.items || [], componentMap);

					return (
						<Flex className={generateLayoutClassName(element.name)} {...element.layout}>
							<Componentize controller={controller} result={result} layout={containerElement.items || []} />
						</Flex>
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
										<Componentize controller={controller} result={result} layout={layout} />
									));
								}
							}
						});
					}

					return (
						<Flex className={classnames(generateLayoutClassName(element.name))} item {...element.layout}>
							<Suspense fallback={<Fragment />}>
								<Component controller={controller} result={result} {...(elementProps as any)} breakpoints={{}} />
							</Suspense>
						</Flex>
					);
				}
			})}
		</Fragment>
	);
};
