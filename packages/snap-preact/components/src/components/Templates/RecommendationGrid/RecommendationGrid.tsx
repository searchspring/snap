import { Fragment, h } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import { Result, ResultProps } from '../../Molecules/Result';
import { ComponentProps, BreakpointsProps, ResultComponent, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';
import { useState } from 'react';
import { useRef } from 'preact/hooks';
import { useIntersection } from '../../../hooks';

const defaultStyles: StyleScript<RecommendationGridProps> = ({ gapSize, columns }) => {
	return css({
		overflow: 'auto',
		maxWidth: '100%',
		maxHeight: '100%',
		'.ss__recommendation-grid__results': {
			display: 'flex',
			flexFlow: 'row wrap',
			gap: gapSize,
			gridTemplateRows: 'auto',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,

			'@supports (display: grid)': {
				display: 'grid',
			},
		},
	});
};

export const RecommendationGrid = observer((properties: RecommendationGridProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<RecommendationGridProps> = {
		results: properties.controller?.store?.results,
		gapSize: '20px',
	};

	//mergeprops only uses names that are passed via properties, so this cannot be put in the defaultProps
	const _properties = {
		name: properties.controller?.store?.profile?.display?.template?.component
			? properties.controller?.store?.profile?.display?.template?.component.toLowerCase()
			: undefined,
		...properties,
	};

	let props = mergeProps('recommendationGrid', globalTheme, defaultProps, _properties);

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

	const { disableStyles, title, resultComponent, trim, lazyRender, className, treePath, theme, controller } = props;

	const mergedlazyRender = {
		enabled: true,
		offset: '10%',
		...lazyRender,
	};

	const subProps: RecommendationGridSubProps = {
		result: {
			// default props
			className: 'ss__recommendation-grid__result',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	let results = props.results || controller.store.results;
	if (!props.columns && !props.rows) {
		props.rows = 1;
		props.columns = results.length;
	} else if (props.columns && !props.rows) {
		props.rows = Math.floor(results.length / props.columns);

		if (trim) {
			const remainder = results.length % props.columns;
			results = results.slice(0, results.length - remainder);
		}
	} else if (props.rows && !props.columns) {
		if (trim) {
			const remainder = results.length % props.rows;
			results = results.slice(0, results.length - remainder);
		}

		props.columns = Math.ceil(results.length / props.rows);
	} else if (props?.columns && props?.rows && props.columns > 0 && props.rows > 0) {
		results = results?.slice(0, props.columns * props.rows);
	}

	const styling = mergeStyles<RecommendationGridProps>(props, defaultStyles);

	const [isVisible, setIsVisible] = useState(false);
	const recsRef = useRef(null);
	const inView = mergedlazyRender?.enabled ? useIntersection(recsRef, `${mergedlazyRender.offset} 0px ${mergedlazyRender.offset} 0px`, true) : true;
	if (inView) {
		setIsVisible(true);
	}

	return results?.length ? (
		<CacheProvider>
			<div {...styling} ref={recsRef} className={classnames('ss__recommendation-grid', className)}>
				{isVisible ? (
					<RecommendationProfileTracker controller={controller}>
						{title && <h3 className="ss__recommendation-grid__title">{title}</h3>}

						<div className="ss__recommendation-grid__results">
							{results.map((result) =>
								(() => {
									if (resultComponent && controller) {
										const ResultComponent = resultComponent;
										return <ResultComponent controller={controller} result={result as Product} theme={theme} treePath={treePath} />;
									} else {
										return (
											<RecommendationResultTracker result={result as Product} controller={controller}>
												<Result key={(result as Product).id} {...subProps.result} result={result as Product} controller={controller} />
											</RecommendationResultTracker>
										);
									}
								})()
							)}
						</div>
					</RecommendationProfileTracker>
				) : (
					<RecommendationProfileTracker controller={controller}>
						{results.map((result) => (
							<RecommendationResultTracker controller={controller} result={result}>
								<></>
							</RecommendationResultTracker>
						))}
					</RecommendationProfileTracker>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface RecommendationGridProps extends ComponentProps {
	controller: RecommendationController;
	title?: string;
	results?: Product[];
	columns?: number;
	rows?: number;
	gapSize?: string;
	trim?: boolean;
	breakpoints?: BreakpointsProps;
	resultComponent?: ResultComponent;
	lazyRender?: {
		enabled: boolean;
		offset?: string;
	};
}

interface RecommendationGridSubProps {
	result: Partial<ResultProps>;
}
