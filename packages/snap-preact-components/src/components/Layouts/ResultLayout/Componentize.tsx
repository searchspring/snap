/** @jsx jsx */
import { h, Fragment } from 'preact';
import { lazy } from 'preact/compat';
import { Suspense } from 'preact/compat';
import { jsx } from '@emotion/react';
import classnames from 'classnames';

import { Flex } from '../../Atoms/Flex';
import { ResultLayout, ResultLayoutFuncData } from '.';
import { LayoutElement, ResultLayoutTypes } from '.';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';

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
export const componentMap: ResultLayoutComponentMap = {
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
	},
};

export const Componentize = (props: {
	data: ResultLayoutFuncData<AutocompleteController | RecommendationController | SearchController>;
	layout: LayoutElement[];
}) => {
	const { data, layout } = props;
	return (
		<Fragment>
			{layout.map((element) => {
				if (element.items) {
					// if the element is a Flex
					const containerElement = element;
					// const InnerContainer = containerize(data, containerElement.items || [], componentMap);

					return (
						<Flex className={generateLayoutClassName(element.name)} {...element.layout}>
							<Componentize data={data} layout={containerElement.items || []} />
						</Flex>
					);
				} else if (element.component) {
					// if the element is a component
					const componentMapping = componentMap[element.component as keyof typeof componentMap];
					const Component = componentMapping.component;

					// create Layout from props supporting layout
					const mappedProps = element.props || {};
					if (mappedProps) {
						Object.keys(mappedProps).map((propName) => {
							const propValue = mappedProps[propName as keyof typeof mappedProps];
							if ((componentMapping.layoutProps || []).includes(propName)) {
								const layoutProp = propValue as ResultLayoutTypes;
								if (typeof propValue == 'function' || Array.isArray(propValue) || typeof propValue == 'object') {
									// it is a LayoutFunc or LayoutElement Array

									// @ts-ignore - typing is hard
									mappedProps[propName as keyof typeof mappedProps] = <ResultLayout {...data} layout={layoutProp} />;
								}
							}
						});
					}

					return (
						<Flex className={classnames(generateLayoutClassName(element.name), generateLayoutClassName(element.component))} item {...element.layout}>
							<Suspense fallback={<Fragment />}>
								<Component {...data} {...(element.props as any)} breakpoints={{}} />
							</Suspense>
						</Flex>
					);
				}
			})}
		</Fragment>
	);
};
