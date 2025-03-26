import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { AutocompleteController } from '@searchspring/snap-controller';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { Terms, TermsProps } from '../../Molecules/Terms/Terms';

const CSS = {
	TermsList: ({ vertical }: Partial<TermsListProps>) =>
		css({
			display: 'flex',
			flexDirection: vertical ? 'column' : 'row',
			background: '#f8f8f8',
			// width: !vertical ? 'auto' : '150px'
			width: 'auto',
		}),
};

export const TermsList = observer((properties: TermsListProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<TermsListProps> = {
		modules: ['Trending', 'Suggestions', 'History'],
		historyTitle: 'History',
		trendingTitle: 'Trending',
		suggestionTitle: 'Suggestions',
		vertical: true,
	};

	const props = mergeProps('termsList', globalTheme, defaultProps, properties);
	const {
		modules,
		historyTitle,
		trendingTitle,
		suggestionTitle,
		retainHistory,
		retainTrending,
		treePath,
		disableStyles,
		style,
		className,
		controller,
		styleScript,
	} = props;

	const subProps: TermsListSubProps = {
		autocompleteTerms: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.TermsList(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const history = controller?.store.history || [];
	const suggestions = controller?.store.terms || [];
	const trending = controller?.store.trending || [];

	const trendingActive = trending?.filter((term) => term.active).pop();
	const historyActive = history?.filter((term) => term.active).pop();

	const { loaded, results, state } = controller?.store;

	let showTrending = false;
	if (trending?.length && ((retainTrending && loaded) || (!results.length && !state.input))) {
		showTrending = true;
	}

	let showHistory = false;
	if (history?.length && ((retainHistory && loaded) || (!results.length && !state.input))) {
		showHistory = true;
	}

	if (!controller.store.state.input && (historyActive || trendingActive)) {
		if (history?.length) showHistory = true;
		if (trending?.length) showTrending = true;
	}

	return modules?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__terms-list', className)}>
				{modules?.map((module) => {
					if (module == 'History' && showHistory) {
						return <Terms {...subProps.autocompleteTerms} name={'history'} title={historyTitle} terms={history} controller={controller} />;
					}

					if (module == 'Trending' && showTrending) {
						return <Terms {...subProps.autocompleteTerms} name={'trending'} title={trendingTitle} terms={suggestions} controller={controller} />;
					}

					if (module == 'Suggestions') {
						return <Terms {...subProps.autocompleteTerms} name={'suggestions'} title={suggestionTitle} terms={trending} controller={controller} />;
					}
				})}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface TermsListSubProps {
	autocompleteTerms: Partial<TermsProps>;
}

export type ModuleNames = 'Trending' | 'Suggestions' | 'History';

export interface TermsListProps extends ComponentProps {
	controller: AutocompleteController;
	modules?: ModuleNames[];
	historyTitle?: string;
	suggestionTitle?: string;
	trendingTitle?: string;
	vertical?: boolean;

	retainHistory?: boolean;
	retainTrending?: boolean;
}
