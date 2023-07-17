/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { AutocompleteController } from '@searchspring/snap-controller';
import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { createHoverProps } from '../../../toolbox';

const CSS = {
	groupedterms: ({ horizontal }: Partial<GroupedTermsProps>) =>
		css({
			display: 'flex',
			flexDirection: 'column',
			flex: `1 1 auto`,
			maxWidth: `${horizontal ? 'auto' : '150px'}`,
			minWidth: '150px',
			order: 1,
			background: '#f8f8f8',

			'& .ss__autocomplete__terms__options': {
				display: horizontal ? 'flex' : undefined,
				justifyContent: 'space-evenly',
				flexWrap: 'wrap',

				'& .ss__autocomplete__terms__option': {
					flexGrow: horizontal ? '1' : undefined,
					textAlign: horizontal ? 'center' : undefined,
					wordBreak: 'break-all',

					'& a': {
						display: 'block',
						padding: horizontal ? '10px 30px' : '10px',

						'& em': {
							fontStyle: 'normal',
						},
					},

					'&.ss__autocomplete__terms__option--active': {
						background: '#fff',

						'& a': {
							fontWeight: 'bold',
							// color: theme?.colors?.primary,
						},
					},
				},
			},
		}),
};

export const GroupedTerms = observer((properties: GroupedTermsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: GroupedTermsProps = {
		// default props
		suggestionTitle: '',
		trendingTitle: 'Popular Searches',
		historyTitle: 'Previously Searched',
		horizontal: false,
		// global theme
		...globalTheme?.components?.results,
		// props
		...properties,
		...properties.theme?.components?.results,
	};

	const {
		hideTrending,
		hideHistory,
		horizontal,
		hideSuggestions,
		retainTrending,
		retainHistory,
		suggestionTitle,
		historyTitle,
		trendingTitle,
		onTermClick,
		disableStyles,
		style,
		controller,
	} = props;

	const { terms, trending, results, state } = controller.store;

	const history = controller.store.history || [];

	const trendingActive = trending?.filter((term) => term.active).pop();
	const historyActive = history?.filter((term) => term.active).pop();

	let showTrending = false;
	if (trending?.length && ((retainTrending && controller.store.loaded) || (!results.length && !state.input))) {
		showTrending = true;
	}

	let showHistory = false;
	if (history?.length && ((retainHistory && controller.store.loaded) || (!results.length && !state.input))) {
		showHistory = true;
	}

	if (!state.input && (historyActive || trendingActive)) {
		if (history?.length) showHistory = true;
		if (trending?.length) showTrending = true;
	}

	const show = !hideSuggestions && (showTrending || terms.length > 0 || (!hideHistory && history.length > 0));

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.groupedterms({ horizontal }), style];
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
			<>
				<em>{term}</em>
			</>
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

	console.log('test', showHistory, !hideHistory);
	return show ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__autocomplete__terms', { 'ss__autocomplete__terms-trending': showTrending })}>
				{terms.length > 0 ? (
					<div className="ss__autocomplete__terms__suggestions">
						{suggestionTitle ? (
							<div className="ss__autocomplete__title ss__autocomplete__title--terms ss__autocomplete__title--suggestions">
								<h5>{suggestionTitle}</h5>
							</div>
						) : null}
						<div className="ss__autocomplete__terms__options" role={'list'} aria-label={suggestionTitle}>
							{terms.map((term, idx) => (
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
										aria-label={`item ${idx + 1} of ${terms.length}, ${term.value}`}
									>
										{emIfy(term.value, state.input || '')}
									</a>
								</div>
							))}
						</div>
					</div>
				) : null}

				{showTrending && !hideTrending ? (
					<div className="ss__autocomplete__terms__trending">
						{trendingTitle ? (
							<div className="ss__autocomplete__title ss__autocomplete__title--trending">
								<h5>{trendingTitle}</h5>
							</div>
						) : null}
						<div className="ss__autocomplete__terms__options" role={'list'} aria-label={trendingTitle}>
							{trending.map((term, idx) => (
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
										aria-label={`item ${idx + 1} of ${trending.length}, ${term.value}`}
									>
										{emIfy(term.value, state.input || '')}
									</a>
								</div>
							))}
						</div>
					</div>
				) : null}

				{showHistory && !hideHistory ? (
					<div className="ss__autocomplete__terms__history">
						{historyTitle ? (
							<div className="ss__autocomplete__title ss__autocomplete__title--history">
								<h5>{historyTitle}</h5>
							</div>
						) : null}
						<div className="ss__autocomplete__terms__options" role={'list'} aria-label={historyTitle}>
							{history.map((term, idx) => (
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
										{emIfy(term.value, state.input || '')}
									</a>
								</div>
							))}
						</div>
					</div>
				) : null}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface GroupedTermsProps extends ComponentProps {
	controller: AutocompleteController;
	hideHistory?: boolean;
	hideTrending?: boolean;
	hideSuggestions?: boolean;
	historyTitle?: string;
	trendingTitle?: string;
	suggestionTitle?: string;
	retainTrending?: boolean;
	retainHistory?: boolean;
	horizontal?: boolean;
	onTermClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}
