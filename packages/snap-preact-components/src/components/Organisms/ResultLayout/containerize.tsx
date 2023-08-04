/** @jsx jsx */
import { h, Fragment } from 'preact';
import { Suspense } from 'preact/compat';
import { jsx } from '@emotion/react';
import classnames from 'classnames';

import { Flex } from '../../Atoms/Flex';
import { ResultLayout, ResultLayoutFuncData } from '.';
import { LayoutElement, ResultLayoutTypes } from '.';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';

import type { ResultLayoutComponentMap } from '.';

function generateLayoutClassName(name?: string) {
	const normalizedName = name
		?.trim()
		.split(/\.?(?=[A-Z])/)
		.join('-')
		.toLowerCase();
	return name ? `ss__layout__${normalizedName}` : '';
}

export function containerize(
	data: ResultLayoutFuncData<AutocompleteController | RecommendationController | SearchController>,
	layout: LayoutElement[],
	componentMap: ResultLayoutComponentMap
) {
	return () => {
		return (
			<Fragment>
				{layout.map((element) => {
					// if (element.if) {
					// 	// not rendering due to conditional `if` render prop
					// 	const rendering = checkCondition(controller, element.if);
					// 	if (!rendering) return;
					// }

					if (element.items) {
						// if the element is a Flex
						const containerElement = element;
						const InnerContainer = containerize(data, containerElement.items || [], componentMap);

						return (
							<Flex className={generateLayoutClassName(element.name)} {...element.layout}>
								<InnerContainer />
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
							<Flex
								className={classnames(generateLayoutClassName(element.name), generateLayoutClassName(element.component))}
								item
								{...element.layout}
							>
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
}
