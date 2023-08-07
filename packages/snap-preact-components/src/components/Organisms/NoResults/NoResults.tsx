/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { SearchController } from '@searchspring/snap-controller';

const CSS = {
	noresults: () => css(),
};

export const NoResults = observer((properties: NoResultsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<NoResultsProps> = {};

	const props = mergeProps('noResults', globalTheme, defaultProps, properties);

	const { controller, disableStyles, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.noresults(), style];
	} else if (style) {
		styling.css = [style];
	}

	const dym = controller.store.search.didYouMean;

	return (
		<CacheProvider>
			<div className="ss-no-results">
				<div className="ss-no-results-container">
					{dym && (
						<p className="ss-did-you-mean">
							Did you mean <a href={dym.url.href}>{dym.string}</a>?
						</p>
					)}
				</div>

				<div className="ss-no-results-container">
					<h4 className="ss-title">Suggestions</h4>

					<ul className="ss-suggestion-list">
						<li>Check for misspellings.</li>
						<li>Remove possible redundant keywords (ie. "products").</li>
						<li>Use other words to describe what you are searching for.</li>
					</ul>
				</div>
			</div>
		</CacheProvider>
	);
});

export interface NoResultsProps extends ComponentProps {
	//this needs customizable things and stuff
	controller: SearchController;
}
