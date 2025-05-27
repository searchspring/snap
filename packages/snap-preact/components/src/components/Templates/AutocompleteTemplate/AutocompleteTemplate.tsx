import { h, Fragment, FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';

import type { AutocompleteController, RecommendationController, RecommendationControllerConfig } from '@searchspring/snap-controller';
import { ContentType } from '@searchspring/snap-store-mobx';
import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Results, ResultsProps } from '../../Organisms/Results';
import { Banner, BannerProps } from '../../Atoms/Merchandising/Banner';
import { Facets, FacetsProps } from '../../Organisms/Facets';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { createHoverProps } from '../../../toolbox';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import {
	ComponentProps,
	FacetDisplay,
	RecommendationComponentNames,
	RecommendationComponentProps,
	ResultComponent,
	StyleScript,
} from '../../../types';
import { Lang, useA11y, useLang } from '../../../hooks';
import { TermsList, TermsListProps } from '../../Organisms/TermsList';
import { Terms, TermsProps } from '../../Molecules/Terms';
import { useState } from 'react';
import { FacetsHorizontal } from '../../Organisms/FacetsHorizontal';
import { Button, ButtonProps } from '../../Atoms/Button';
import { useCleanUpEmptyDivs } from '../../../hooks/useCleanUpEmptyDivs';
import { createRecommendationTemplate } from '../../../hooks/createRecommendationTemplate';

const defaultStyles: StyleScript<AutocompleteTemplateProps> = ({
	controller,
	input,
	viewportMaxHeight,
	width,
	theme,
	column1,
	column2,
	column3,
	column4,
}) => {
	let inputViewportOffsetBottom = 0;
	if (input) {
		let elem: Element | null;
		if (typeof input === 'string') {
			elem = document.querySelector(input);
		} else {
			elem = input;
		}
		const rect = elem?.getBoundingClientRect();
		inputViewportOffsetBottom = rect?.bottom || 0;
	}
	const noResults = Boolean(controller.store.search?.query?.string && controller.store.results.length === 0);
	return css({
		'.ss__autocomplete__column.ss__autocomplete__column--c1': {
			flex: column1?.width == 'auto' ? '1 1 auto' : `1 0 ${column1?.width}`,
			maxWidth: column1?.width == 'auto' ? 'auto' : column1?.width,
			alignContent: column1?.alignContent,
		},
		'.ss__autocomplete__column.ss__autocomplete__column--c2': {
			flex: column2?.width == 'auto' ? '1 1 auto' : `1 0 ${column2?.width}`,
			maxWidth: column2?.width == 'auto' ? 'auto' : column2?.width,
			alignContent: column2?.alignContent,
		},
		'.ss__autocomplete__column.ss__autocomplete__column--c3': {
			flex: column3?.width == 'auto' ? '1 1 auto' : `1 0 ${column3?.width}`,
			maxWidth: column3?.width == 'auto' ? 'auto' : column3?.width,
			alignContent: column3?.alignContent,
		},
		'.ss__autocomplete__column.ss__autocomplete__column--c4': {
			flex: column4?.width == 'auto' ? '1 1 auto' : `1 0 ${column4?.width}`,
			maxWidth: column4?.width == 'auto' ? 'auto' : column4?.width,
			alignContent: column4?.alignContent,
		},

		'.ss__autocomplete__column, .ss__autocomplete__row': {
			minWidth: 0,
		},

		'&, & *, & *:before, & *:after': {
			boxSizing: 'border-box',
		},

		flexWrap: 'wrap',

		display: 'flex',
		flexDirection: 'row',
		position: 'absolute',
		zIndex: '10002',
		border: '1px solid #ebebeb',
		background: '#ffffff',
		// width: width,
		maxWidth: width,
		maxHeight: viewportMaxHeight && inputViewportOffsetBottom ? `calc(100vh - ${inputViewportOffsetBottom + 10}px)` : undefined,

		'.ss__autocomplete__row': {
			display: 'flex',
			flexDirection: 'row',
			flexBasis: '100%',
		},

		'.ss__autocomplete__column': {
			display: 'flex',
			flexDirection: 'column',
			flexFlow: 'wrap',
		},

		'.ss__autocomplete__column:empty, .ss__autocomplete__row:empty': {
			display: 'none',
		},

		'.ss__autocomplete__separator': {
			flexGrow: 1,
			flexShrink: 1,
		},

		'.ss__autocomplete__close-button': {
			color: '#c5c5c5',
			fontSize: '.8em',
		},
		'.ss__autocomplete__close-button:focus': {
			top: '0px !important',
			left: '0px !important',
			zIndex: '1',
		},

		'.ss__autocomplete__terms-wrapper': {
			background: '#f8f8f8',
			width: '100%',
		},
		'.ss__autocomplete__facets': {
			display: 'flex',
			width: 'auto',
			flexDirection: 'column',
			columnGap: '20px',
			padding: '10px',
			overflowY: 'auto',
			'.ss__facets': {
				display: 'flex',
				flexDirection: 'column',
				columnGap: '20px',
			},
			'.ss__facet-hierarchy-options__option.ss__facet-hierarchy-options__option--filtered~.ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)':
				{
					paddingLeft: 0,
				},
			'.ss__facet-hierarchy-options__option.ss__facet-hierarchy-options__option--filtered:hover': {
				cursor: 'pointer',
			},
			'.ss__facet-palette-options__icon': {
				display: 'none',
			},
		},
		'.ss__autocomplete__facets-wrapper': {
			width: '100%',
		},
		'.ss__autocomplete__content': {
			display: 'flex',
			flex: `1 1 0%`,
			flexDirection: 'column',
			justifyContent: 'space-between',
			overflowY: 'auto',
			margin: noResults ? '0 auto' : undefined,

			'.ss__autocomplete__content-inner': {
				padding: '10px',
			},

			'.ss__autocomplete__content__results, .ss__autocomplete__content__no-results': {
				minHeight: '0%',
			},
		},
		'.ss__banner.ss__banner--header, .ss__banner.ss__banner--banner': {
			marginBottom: '10px',
		},
		'.ss__banner.ss__banner--footer': {
			margin: '10px 0',
		},
		'.ss__autocomplete__button--see-more': {
			padding: '10px',
			height: 'min-content',
			textAlign: noResults ? 'center' : 'right',

			a: {
				fontWeight: 'bold',
				color: theme?.variables?.colors?.primary,

				'.ss__icon': {
					marginLeft: '5px',
				},
			},
		},
	});
};

export const AutocompleteTemplate = observer((properties: AutocompleteTemplateProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<AutocompleteTemplateProps> = {
		facetsTitle: '',
		contentTitle: '',
		layout: [['c1', 'c2', 'c3']],
		column1: {
			layout: ['termsList'],
			width: '150px',
		},
		column2: {
			layout: ['facets'],
			width: '150px',
		},
		column3: {
			layout: [['content'], ['_', 'button.see-more']],
			width: 'auto',
			alignContent: 'space-between',
		},
		width: '100%',
		templates: {
			recommendation: {
				enabled: true,
			},
		},
	};

	let props = mergeProps('autocompleteTemplate', globalTheme, defaultProps, properties);

	const valueProps = createHoverProps();

	const facetClickEvent = () => {
		// remove focus from input (close the autocomplete)
		controller?.setFocused && controller?.setFocused();
	};

	const themeFunctionalityProps: Theme = {
		components: {
			facet: {
				valueProps,
			},
			facetGridOptions: {
				onClick: facetClickEvent,
			},
			facetHierarchyOptions: {
				onClick: facetClickEvent,
			},
			facetListOptions: {
				onClick: facetClickEvent,
			},
			facetPaletteOptions: {
				onClick: facetClickEvent,
			},
		},
	};

	if (!globalTheme?.name) {
		const themeDefaults: Theme = {
			components: {
				facet: {
					limit: 6,
					disableOverflow: true,
					disableCollapse: true,
				},
				facetGridOptions: {
					columns: 3,
				},
				facetHierarchyOptions: {
					hideCount: true,
				},
				facetListOptions: {
					hideCheckbox: true,
					hideCount: true,
				},
				facetPaletteOptions: {
					hideLabel: true,
					columns: 3,
				},
				result: {
					hideBadge: true,
				},
			},
		};

		// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)
		const theme = deepmerge.all([themeDefaults, themeFunctionalityProps, props?.theme || {}], {
			arrayMerge: (destinationArray, sourceArray) => sourceArray,
		});

		props = {
			...props,
			theme,
		};
	} else {
		// snap templates
		props.theme = deepmerge.all([themeFunctionalityProps, props?.theme || {}], { arrayMerge: (destinationArray, sourceArray) => sourceArray });
	}

	let input: string | Element | null = props.input;
	if (input) {
		if (typeof input === 'string') {
			input = document.querySelector(input);
		}
	}

	const {
		facetsTitle,
		contentTitle,
		layout,
		column1,
		column2,
		column3,
		column4,
		excludeBanners,
		resultComponent,
		templates,
		disableStyles,
		className,
		controller,
		treePath,
	} = props;
	const subProps: AutocompleteSubProps = {
		button: {
			className: 'ss__autocomplete__button--see-more',
			// default props
			onClick: () => {
				controller?.setFocused && controller.setFocused();
				window.location.href = state.url.href;
			},
			name: 'see-more',
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		termsList: {
			className: 'ss__autocomplete__terms-list',
			// default props
			controller: controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		terms: {
			className: 'ss__autocomplete__terms',
			// default props
			controller: controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		facets: {
			name: 'autocomplete',
			// default props
			limit: 3,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		facetsHorizontal: {
			name: 'autocomplete',
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		banner: {
			// default props
			className: 'ss__autocomplete__banner',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		results: {
			columns: 3,
			rows: 2,
			// default props
			className: 'ss__autocomplete__results',
			resultComponent: resultComponent,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		icon: {
			// default props
			className: 'ss__autocomplete__icon',
			icon: 'angle-right',
			size: '10px',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
	};

	const { search, terms, trending, results, merchandising, pagination, filters, facets, state, loading } = controller.store;
	const history = controller.store.history || [];

	// you can pass in a selector or the actual input element,
	// if its the selector, we need to bind it to the controller here.
	if (controller && typeof input == 'string') {
		input = document.querySelector(input);
		// only bind on componentdidmount
		useEffect(() => {
			controller.bind();
		}, []);
	}

	const visible =
		Boolean(input === state.focusedInput) &&
		(terms.length > 0 || trending?.length > 0 || history?.length > 0 || (state.input && controller.store.loaded));

	const showResultsBool = () => Boolean(results.length > 0 || Object.keys(merchandising.content).length > 0 || search?.query?.string || loading);

	const [showResults, setShowResults] = useState(showResultsBool());

	const checkAndSetShowResults = () => {
		const trendingActive = trending?.filter((term) => term.active).pop();
		const historyActive = history?.filter((term) => term.active).pop();

		if (trendingActive || historyActive || showResultsBool()) {
			setShowResults(true);
		} else {
			setShowResults(false);
		}
	};

	useEffect(() => {
		checkAndSetShowResults();
	}, [trending, history]);

	const facetsToShow = facets.length ? facets.filter((facet) => facet.display !== FacetDisplay.SLIDER) : [];

	// results logic
	checkAndSetShowResults();

	const styling = mergeStyles<AutocompleteTemplateProps>(props, defaultStyles);

	const reset = () => {
		controller.setFocused();
	};

	//initialize lang
	const defaultLang: Partial<AutocompleteTemplateLang> = {
		contentTitle: {
			value: contentTitle,
		},
		closeButton: {
			value: 'Close Autocomplete',
			attributes: {
				'aria-label': 'close autocomplete',
			},
		},
		facetsTitle: {
			value: facetsTitle,
		},

		noResultsText: {
			value: `<p>No results found for "${search.originalQuery?.string || search.query?.string}".</p><p>Please try another search.</p>`,
		},
		seeMoreButton: {
			value: `See ${pagination.totalResults} ${filters.length > 0 ? 'filtered' : ''} result${pagination.totalResults == 1 ? '' : 's'} for "${
				search.query?.string
			}"`,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		controller,
	});

	let recsController: RecommendationController | undefined;
	let RecommendationTemplateComponent: FunctionalComponent<RecommendationComponentProps> | undefined;

	let RecommendationTemplateResultComponent: ResultComponent | undefined;

	const noresults = Boolean(controller.store.search?.query?.string && controller.store.results.length === 0);

	if (templates?.recommendation?.enabled && noresults) {
		const recs = createRecommendationTemplate(templates, properties.theme);
		RecommendationTemplateComponent = recs.RecommendationTemplateComponent;
		RecommendationTemplateResultComponent = recs.RecommendationTemplateResultComponent;
		recsController = recs.recsController;
	}

	useCleanUpEmptyDivs('.ss__autocomplete__column, .ss__autocomplete__terms-wrapper');

	const findModule = (module: ModuleNamesWithColumns) => {
		//new row
		if (typeof module !== 'string') {
			return <div className="ss__autocomplete__row">{module?.map((subModule) => findModule(subModule))}</div>;
		}

		if (module == 'c1' && column1?.layout?.length) {
			return (
				<div className="ss__autocomplete__column ss__autocomplete__column--c1">
					{column1?.layout?.map((module) => {
						return findModule(module);
					})}
				</div>
			);
		}
		if (module == 'c2' && column2?.layout?.length) {
			return (
				<div className="ss__autocomplete__column ss__autocomplete__column--c2">
					{column2?.layout?.map((module) => {
						return findModule(module);
					})}
				</div>
			);
		}
		if (module == 'c3' && column3?.layout?.length) {
			return (
				<div className="ss__autocomplete__column ss__autocomplete__column--c3">
					{column3?.layout?.map((module) => {
						return findModule(module);
					})}
				</div>
			);
		}
		if (module == 'c4' && column4?.layout?.length) {
			return (
				<div className="ss__autocomplete__column ss__autocomplete__column--c4">
					{column4?.layout?.map((module) => {
						return findModule(module);
					})}
				</div>
			);
		}
		if (module == 'termsList') {
			return (
				<div className={classnames('ss__autocomplete__terms-wrapper')}>
					<TermsList controller={controller} {...subProps.termsList} />
				</div>
			);
		}
		if (module == 'terms.history') {
			return (
				<Terms
					controller={controller}
					terms={controller.store.history}
					className={'ss__terms-list__terms--history'}
					name={'history'}
					{...subProps.terms}
					title="History"
				/>
			);
		}
		if (module == 'terms.trending') {
			return (
				<Terms
					controller={controller}
					terms={controller.store.trending}
					className={'ss__terms-list__terms--trending'}
					name={'trending'}
					{...subProps.terms}
					title="Trending"
				/>
			);
		}
		if (module == 'terms.suggestions') {
			return (
				<Terms
					controller={controller}
					terms={controller.store.terms}
					className={'ss__terms-list__terms--suggestions'}
					name={'suggestions'}
					{...subProps.terms}
					title="Suggestions"
				/>
			);
		}
		if (module == 'facets') {
			return facetsToShow.length ? (
				<div className={classnames('ss__autocomplete__facets-wrapper')}>
					{facetsTitle || lang.facetsTitle.value ? (
						<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--facets')}>
							<h5 {...mergedLang.facetsTitle?.all}></h5>
						</div>
					) : null}
					<div className="ss__autocomplete__facets">
						<Facets {...subProps.facets} facets={facetsToShow} />
						{!excludeBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.LEFT} name={'left'} /> : null}
					</div>
				</div>
			) : (
				<></>
			);
		}

		if (module == 'facetsHorizontal') {
			return facetsToShow.length ? (
				<>
					{facetsTitle || lang.facetsTitle.value ? (
						<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--facets')}>
							<h5 {...mergedLang.facetsTitle?.all}></h5>
						</div>
					) : null}
					<div className="ss__autocomplete__facets">
						<FacetsHorizontal {...subProps.facetsHorizontal} facets={facetsToShow} />
						{!excludeBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.LEFT} name={'left'} /> : null}
					</div>
				</>
			) : (
				<></>
			);
		}

		if (module == 'content' && showResults) {
			return (
				<div className="ss__autocomplete__content">
					{results.length > 0 || !loading ? (
						<div className="ss__autocomplete__content-inner">
							{!excludeBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.HEADER} name={'header'} /> : null}
							{!excludeBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.BANNER} name={'banner'} /> : null}
							{results.length > 0 ? (
								<div className="ss__autocomplete__content__results">
									{(contentTitle || lang.contentTitle.value) && results.length > 0 ? (
										<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--content')}>
											<h5 {...mergedLang.contentTitle?.all}></h5>
										</div>
									) : null}
									<Results results={results} {...subProps.results} controller={controller} />
								</div>
							) : !loading ? (
								<div className="ss__autocomplete__content__no-results">
									<div {...mergedLang.noResultsText?.all}></div>
									{RecommendationTemplateComponent && recsController?.store?.loaded ? (
										<div className="ss__no-results__recommendations">
											<RecommendationTemplateComponent
												controller={recsController}
												title={recsController.store?.profile?.display?.templateParameters?.title}
												resultComponent={RecommendationTemplateResultComponent}
												name={'noResultsRecommendations'}
												treePath={treePath}
											/>
										</div>
									) : null}
								</div>
							) : (
								<></>
							)}

							{!excludeBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.FOOTER} name={'footer'} /> : null}
						</div>
					) : (
						<></>
					)}
				</div>
			);
		}

		if (module == '_') {
			return <div className="ss__autocomplete__separator"></div>;
		}

		if (module == 'banner.banner') {
			return <Banner {...subProps.banner} content={merchandising.content} type={ContentType.BANNER} name={'banner'} />;
		}
		if (module == 'banner.footer') {
			return <Banner {...subProps.banner} content={merchandising.content} type={ContentType.FOOTER} name={'footer'} />;
		}
		if (module == 'banner.header') {
			return <Banner {...subProps.banner} content={merchandising.content} type={ContentType.HEADER} name={'header'} />;
		}
		if (module == 'banner.left') {
			return <Banner {...subProps.banner} content={merchandising.content} type={ContentType.LEFT} name={'left'} />;
		}

		if (module == 'button.see-more' && showResults && search?.query?.string && results.length > 0) {
			return (
				<Button {...subProps.button}>
					<div className="ss__autocomplete__see-more">
						<a href={state.url.href} onClick={() => controller?.setFocused && controller.setFocused()} {...mergedLang.seeMoreButton.attributes}>
							<span {...mergedLang.seeMoreButton.value}></span>
							<Icon {...subProps.icon} />
						</a>
					</div>
				</Button>
			);
		}
	};

	/***************************************/
	return visible && layout?.length ? (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__autocomplete', className)}
				onClick={(e) => e.stopPropagation()}
				ref={(e) => useA11y(e, 0, true, reset)}
			>
				<span
					role={'link'}
					ref={(e) => useA11y(e)}
					onClick={() => reset()}
					className="ss__autocomplete__close-button"
					style={{ position: 'absolute', top: '-10000000px', left: '-1000000px' }}
					{...mergedLang.closeButton?.all}
				></span>

				{layout?.map((module) => {
					return findModule(module as ModuleNames);
				})}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface AutocompleteSubProps {
	termsList: Partial<TermsListProps>;
	terms: Partial<TermsProps>;
	facets: Partial<FacetsProps>;
	facetsHorizontal: Partial<FacetsProps>;
	banner: Partial<BannerProps>;
	results: Partial<ResultsProps>;
	icon: Partial<IconProps>;
	button: Partial<ButtonProps>;
}

//can add categories here in the future
export type ModuleNames =
	| 'termsList'
	| 'terms.history'
	| 'terms.trending'
	| 'terms.suggestions'
	| 'facets'
	| 'facetsHorizontal'
	| 'button.see-more'
	| 'content'
	| '_'
	| 'banner.left'
	| 'banner.banner'
	| 'banner.footer'
	| 'banner.header';
type ColumnsNames = 'c1' | 'c2' | 'c3' | 'c4';
type ModuleNamesWithColumns = ModuleNames | ColumnsNames | ModuleNames[] | ColumnsNames[];

type Column = {
	layout: ModuleNames[][] | ModuleNames[];
	width: string | 'auto';
	alignContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
};

export interface AutocompleteTemplateProps extends ComponentProps {
	input: Element | string;
	controller: AutocompleteController;
	layout?: ModuleNamesWithColumns[];

	column1?: Column;
	column2?: Column;
	column3?: Column;
	column4?: Column;

	facetsTitle?: string;
	contentTitle?: string;
	excludeBanners?: boolean;
	viewportMaxHeight?: boolean;
	width?: string;

	resultComponent?: ResultComponent;
	templates?: {
		recommendation?: {
			enabled: boolean;
			component?: RecommendationComponentNames;
			resultComponent?: string;
			config?: Partial<RecommendationControllerConfig>;
		};
	};
	lang?: Partial<AutocompleteTemplateLang>;
}

export interface AutocompleteTemplateLang {
	facetsTitle: Lang<{
		controller: AutocompleteController;
	}>;
	contentTitle: Lang<{
		controller: AutocompleteController;
	}>;
	closeButton: Lang<{
		controller: AutocompleteController;
	}>;
	noResultsText: Lang<{
		controller: AutocompleteController;
	}>;
	seeMoreButton: Lang<{
		controller: AutocompleteController;
	}>;
}
