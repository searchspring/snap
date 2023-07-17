/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { AutocompleteController } from '@searchspring/snap-controller';
import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { createHoverProps } from '../../../toolbox';
import { AutocompleteTermStore } from '@searchspring/snap-store-mobx/dist/cjs/Autocomplete/Stores';

const CSS = {
	Terms: () => css({}),
};

export const Terms = observer((properties: TermsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: TermsProps = {
		// default props
		suggestionTitle: '',
		trendingTitle: 'Popular Searches',
		historyTitle: 'Previously Searched',
		horizontalTerms: false,
		// global theme
		...globalTheme?.components?.results,
		// props
		...properties,
		...properties.theme?.components?.results,
	};

	const { terms, title, onTermClick, disableStyles, style, controller } = props;
	const currentInput = controller?.store?.state?.input;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.Terms(), style];
	} else if (style) {
		styling.css = [style];
	}

	const emIfy = (term: string, search: string) => {
		if (term && search) {
			const match = term.match(escapeRegExp(search));
			if (search && term && match && typeof match.index == 'number') {
				const beforeMatch = term.slice(0, match.index);
				const afterMatch = term.slice(match.index + search.length, term.length);
				return (
					<>
						{beforeMatch ? <em>{beforeMatch}</em> : ''}
						{search}
						{afterMatch ? <em>{afterMatch}</em> : ''}
					</>
				);
			}
		}

		return (
			<Fragment>
				<em>{term}</em>
			</Fragment>
		);
	};

	const termClickEvent = (e: React.MouseEvent<Element, MouseEvent>) => {
		onTermClick && onTermClick(e);

		// remove focus from input (close the autocomplete)
		controller?.setFocused && controller?.setFocused();
	};

	const escapeRegExp = (string: string): string => {
		return string?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	return terms?.length ? (
		<CacheProvider>
			<div className="ss__autocomplete__terms">
				{title ? (
					<div className="ss__autocomplete__title">
						<h5>{title}</h5>
					</div>
				) : null}
				<div className="ss__autocomplete__terms__options" role={'list'} aria-label={title}>
					{terms?.map((term, idx) => (
						<div
							className={classnames('ss__autocomplete__terms__option', {
								'ss__autocomplete__terms__option--active': term.active,
							})}
						>
							<a
								onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => termClickEvent(e)}
								href={term.url.href}
								{...createHoverProps(term.preview)}
								role="link"
								aria-label={`item ${idx + 1} of ${history.length}, ${term.value}`}
							>
								{emIfy(term.value, currentInput || '')}
							</a>
						</div>
					))}
				</div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface TermsProps extends ComponentProps {
	controller?: AutocompleteController;
	terms?: AutocompleteTermStore;
	title: string;
	onTermClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}
