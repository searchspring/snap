import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';

import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import type { SearchResultStore, Product, Banner } from '@searchspring/snap-store-mobx';
import { ContentType } from '@searchspring/snap-store-mobx';
import { InlineBanner, InlineBannerProps } from '../../Atoms/Merchandising/InlineBanner';
import { Result, ResultProps } from '../../Molecules/Result';
import { ComponentProps, ResultsLayout, BreakpointsProps, ResultComponent, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider, useSnap, useTreePath } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { SearchResultTracker } from '../../Trackers/SearchResultTracker';
import { SnapTemplates } from '../../../../../src';
import { useComponent } from '../../../hooks';

const defaultStyles: StyleScript<ResultsProps> = ({ gapSize, columns }) => {
	return css({
		display: 'flex',
		flexFlow: 'row wrap',
		gap: gapSize,
		gridTemplateRows: 'auto',
		gridTemplateColumns: `repeat(${columns}, 1fr)`,

		'& .ss__result, & .ss__result-layout': {
			boxSizing: 'border-box',
			flex: '0 1 auto',
			width: `calc(${100 / columns!}% - (${columns! - 1} * ${gapSize} / ${columns} ) )`,
			marginRight: gapSize,
			marginBottom: gapSize,

			[`&:nth-of-type(${columns}n)`]: {
				marginRight: '0',
			},
			[`&:nth-last-of-type(-n+${columns})`]: {
				marginBottom: '0',
			},
		},
		'@supports (display: grid)': {
			display: 'grid',

			'& .ss__result, & .ss__result-layout': {
				width: 'initial',
				flex: undefined,
				margin: 0,
			},
		},
	});
};

export const Results = observer((properties: ResultsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const defaultBreakpointsProps = {
		0: {
			columns: properties.columns || 1,
		},
		540: {
			columns: properties.columns || 2,
		},
		768: {
			columns: properties.columns || 3,
		},
		991: {
			columns: properties.columns || 4,
		},
	};

	const defaultProps: Partial<ResultsProps> = {
		results: properties.controller?.store?.results,
		columns: 4,
		gapSize: '20px',
		layout: ResultsLayout.grid,
		breakpoints: defaultBreakpointsProps,
		treePath: globalTreePath,
	};

	let props = mergeProps('results', globalTheme, defaultProps, properties);

	if (!properties.theme?.name) {
		// breakpoint settings are calculated in ThemeStore for snap templates
		const displaySettings = useDisplaySettings(props?.breakpoints || {});
		const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });
		props = {
			...props,
			...displaySettings,
			theme,
		};
	}

	const { disableStyles, className, layout, theme, controller, treePath } = props;
	let { resultComponent } = props;

	const subProps: ResultsSubProps = {
		result: {
			// default props
			className: 'ss__results__result',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		inlineBanner: {
			// default props
			className: 'ss__results__inline-banner',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	let results = props.results;
	if (props?.columns && props?.rows && props.columns > 0 && props.rows > 0) {
		results = props.results?.slice(0, props.columns * props.rows);
	}

	const styling = mergeStyles<ResultsProps>({ ...props, columns: layout == ResultsLayout.list ? 1 : props.columns }, defaultStyles);

	if (typeof resultComponent === 'string') {
		const snap = useSnap() as SnapTemplates;
		if (snap?.templates?.library.import.component.result) {
			resultComponent = useComponent(snap?.templates?.library.import.component.result, resultComponent);
			if (!resultComponent) {
				return <Fragment></Fragment>;
			}
		}
	}

	return results?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__results', `ss__results-${props.layout}`, className)}>
				{results.map((result) =>
					(() => {
						switch (result.type) {
							case ContentType.BANNER:
								return <InlineBanner {...subProps.inlineBanner} key={result.id} banner={result as Banner} layout={props.layout} />;
							default:
								// TODO: wrap with SearchResultTracker component (need to create)
								if (resultComponent && controller) {
									const ResultComponent = resultComponent;
									return (
										<SearchResultTracker result={result as Product} controller={controller as SearchController}>
											<ResultComponent
												key={(result as Product).id}
												controller={controller}
												result={result as Product}
												theme={theme}
												treePath={treePath}
											/>
										</SearchResultTracker>
									);
								} else {
									return (
										<SearchResultTracker result={result as Product} controller={controller as SearchController}>
											<Result
												key={(result as Product).id}
												{...subProps.result}
												result={result as Product}
												layout={props.layout}
												controller={controller}
											/>
										</SearchResultTracker>
									);
								}
						}
					})()
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface ResultsProps extends ComponentProps {
	results?: SearchResultStore;
	columns?: number;
	rows?: number;
	gapSize?: string;
	layout?: keyof typeof ResultsLayout | ResultsLayout;
	breakpoints?: BreakpointsProps;
	controller?: SearchController | AutocompleteController | RecommendationController;
	resultComponent?: ResultComponent | string;
}

interface ResultsSubProps {
	result: Partial<ResultProps>;
	inlineBanner: Partial<InlineBannerProps>;
}
