import { h, Fragment } from 'preact';
import { jsx } from '@emotion/react';
import { observer } from 'mobx-react';

import type { AbstractController, RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

import { Result, ResultProps } from '../../Molecules/Result';
import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme } from '../../../providers';
import { ComponentProps, ResultComponent } from '../../../types';

export const RecommendationEmail = observer((properties: RecommendationEmailProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RecommendationEmailProps> = {
		resultWidth: '240px',
	};

	const props = mergeProps('recommendationEmail', globalTheme, defaultProps, properties);

	const { controller, results, resultComponent, resultProps, resultWidth, treePath, disableStyles } = props;

	const subProps: RecommendationEmailSubProps = {
		result: {
			// default props
			className: 'ss__recommendation-email__result',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const resultsToRender = results || controller?.store?.results || [];

	return resultsToRender.length > 0 ? (
		<Fragment>
			{resultsToRender.map((result, idx) => (
				<div key={idx} id={`ss-emailrec${idx}`} className="ss__recommendation-email__result-wrapper" style={{ display: 'block', width: resultWidth }}>
					{(() => {
						if (resultComponent) {
							const ResultComponent = resultComponent;
							return <ResultComponent controller={controller as AbstractController} result={result} {...resultProps} email={true} />;
						} else {
							return (
								<Result
									result={result}
									hideBadge
									theme={{
										components: {
											image: {
												lazy: false,
											},
										},
									}}
									{...subProps.result}
									{...resultProps}
								/>
							);
						}
					})()}
				</div>
			))}
		</Fragment>
	) : (
		<></>
	);
});

export type RecommendationEmailProps = {
	controller?: RecommendationController;
	results?: Product[];
	resultComponent?: ResultComponent<{ email: boolean }>;
	resultProps?: Partial<ResultProps> | Record<string, any>;
	resultWidth?: string;
} & ComponentProps;

interface RecommendationEmailSubProps {
	result: Partial<ResultProps>;
}
