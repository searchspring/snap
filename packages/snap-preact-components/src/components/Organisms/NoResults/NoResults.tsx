/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { SearchController } from '@searchspring/snap-controller';
import classNames from 'classnames';

const CSS = {
	noresults: ({}: Partial<NoResultsProps>) => css(),
};

export const NoResults = observer((properties: NoResultsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<NoResultsProps> = {};

	const props = mergeProps('noResults', globalTheme, defaultProps, properties);

	const { controller, disableStyles, className, style, styleScript } = props;

	const styling: { css?: StylingCSS } = {};

	const stylingProps = { ...props };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.noresults(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const dym = controller.store.search.didYouMean;

	return (
		<CacheProvider>
			<div {...styling} className={classNames('ss__no-results', className)}>
				{dym && (
					<div className="ss__no-results__container">
						<p className="ss__did-you-mean">
							Did you mean <a href={dym.url.href}>{dym.string}</a>?
						</p>
					</div>
				)}

				<div className="ss__no-results__container">
					<h4 className="ss__title">Suggestions</h4>

					<ul className="ss__suggestion-list">
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
