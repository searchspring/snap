/** @jsx jsx */
import { h, Fragment, ComponentChildren } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

import { Result, ResultProps } from '../../Molecules/Result';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';

const CSS = {
	recommendation: ({ vertical }: Partial<RecommendationListProps>) =>
		css({
			height: vertical ? '100%' : undefined,
			'.ss__result__image-wrapper': {
				height: vertical ? '85%' : undefined,
			},
			'.ss__recommendation-list__result-wrapper': {
				display: 'flex',
				flexDirection: vertical ? 'column' : 'row',
			},
		}),
};

export const RecommendationList = observer((properties: RecommendationListProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: RecommendationListProps = {
		// default props
		// global theme
		...globalTheme?.components?.recommendationList,
		...properties,
		// props
		...properties.theme?.components?.recommendationList,
	};

	const { title, controller, children, results, vertical, resultComponent, limit, disableStyles, style, className } = props;

	if (!controller || controller.type !== 'recommendation') {
		throw new Error(`<RecommendationList> Component requires 'controller' prop with an instance of RecommendationController`);
	}

	const resultsToRender: Product[] = results || controller.store?.results;

	if (Array.isArray(children) && children.length !== resultsToRender.length) {
		controller.log.error(
			`<RecommendationList> Component received invalid number of children. Must match length of 'results' prop or 'controller.store.results'`
		);
		return <Fragment></Fragment>;
	}

	const subProps: RecommendationListSubProps = {
		result: {
			// default props
			className: 'ss__recommendationList__result',
			// global theme
			...globalTheme?.components?.result,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.recommendation({ vertical }), style];
	} else if (style) {
		styling.css = [style];
	}

	return children || resultsToRender?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__recommendation-list', className)}>
				<RecommendationProfileTracker controller={controller}>
					{title && <h3 className="ss__recommendation-list__title">{title}</h3>}

					<div className="ss__recommendation-list__result-wrapper">
						{Array.isArray(children) && children.length
							? children.map((child: any, idx: number) => {
									if (!limit || idx + 1 < limit) {
										return (
											<RecommendationResultTracker controller={controller} result={resultsToRender[idx]}>
												{child}
											</RecommendationResultTracker>
										);
									}
							  })
							: resultsToRender.map((result, idx) => {
									if (!limit || idx + 1 < limit) {
										return (
											<RecommendationResultTracker controller={controller} result={result}>
												{(() => {
													if (resultComponent && controller) {
														const ResultComponent = resultComponent;
														return <ResultComponent controller={controller} result={result} />;
													} else {
														return <Result {...subProps.result} controller={controller} result={result} />;
													}
												})()}
											</RecommendationResultTracker>
										);
									}
							  })}
					</div>
				</RecommendationProfileTracker>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface RecommendationListProps extends ComponentProps {
	title?: JSX.Element | string;
	results?: Product[];
	controller: RecommendationController;
	children?: ComponentChildren;
	vertical?: boolean;
	resultComponent?: React.FunctionComponent<{
		controller: RecommendationController;
		result: Product;
	}>;
	limit?: number;
}

interface RecommendationListSubProps {
	result: ResultProps;
}
