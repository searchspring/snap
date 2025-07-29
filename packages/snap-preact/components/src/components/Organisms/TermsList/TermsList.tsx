import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { AutocompleteController } from '@searchspring/snap-controller';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { Terms, TermsProps } from '../../Molecules/Terms/Terms';
import { useCleanUpEmptyDivs } from '../../../hooks/useCleanUpEmptyDivs';

const CSS = {
	TermsList: ({}: Partial<TermsListProps>) =>
		css({
			display: 'flex',
			flexDirection: 'row',
			background: '#f8f8f8',
			width: 'auto',
			flexWrap: 'wrap',

			'.ss__terms-list__row': {
				display: 'flex',
				flexDirection: 'row',
				flexBasis: '100%',
			},

			'.ss__terms-list__row:empty': {
				display: 'none',
			},

			'.ss__terms-list__separator': {
				flexGrow: 1,
				flexShrink: 1,
			},
		}),
};

export const TermsList = observer((properties: TermsListProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<TermsListProps> = {
		layout: [['Suggestions'], ['Trending'], ['History']],
		historyTitle: 'History',
		trendingTitle: 'Trending',
		suggestionTitle: 'Suggestions',
	};

	const props = mergeProps('termsList', globalTheme, defaultProps, properties);
	const {
		layout,
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
		terms: {
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

	useCleanUpEmptyDivs(['.ss__terms-list', '.ss__terms-list__row'], '.ss__terms-list__separator');

	const findModule = (module: TermsListModuleNames[] | TermsListModuleNames) => {
		if (typeof module !== 'string') {
			return <div className="ss__terms-list__row">{module?.map((subModule) => findModule(subModule))}</div>;
		}

		if (module == '_') {
			return <div className="ss__terms-list__separator"></div>;
		}

		if (module == 'History' && showHistory) {
			return (
				<Terms
					className={'ss__terms-list__terms--history'}
					title={historyTitle}
					terms={history}
					controller={controller}
					name={'history'}
					{...subProps.terms}
				/>
			);
		}

		if (module == 'Trending' && showTrending) {
			return (
				<Terms
					className={'ss__terms-list__terms--trending'}
					title={trendingTitle}
					terms={trending}
					controller={controller}
					name={'trending'}
					{...subProps.terms}
				/>
			);
		}

		if (module == 'Suggestions') {
			return (
				<Terms
					className={'ss__terms-list__terms--suggestions'}
					title={suggestionTitle}
					terms={suggestions}
					controller={controller}
					name={'suggestions'}
					{...subProps.terms}
				/>
			);
		}
	};

	return layout?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__terms-list', className)}>
				{layout?.map((module) => {
					return findModule(module as TermsListModuleNames);
				})}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface TermsListSubProps {
	terms: Partial<TermsProps>;
}

export type TermsListModuleNames = 'Trending' | 'Suggestions' | 'History' | '_';

export interface TermsListProps extends ComponentProps {
	controller: AutocompleteController;
	layout?: TermsListModuleNames[] | TermsListModuleNames[][];
	historyTitle?: string;
	suggestionTitle?: string;
	trendingTitle?: string;
	retainHistory?: boolean;
	retainTrending?: boolean;
}
