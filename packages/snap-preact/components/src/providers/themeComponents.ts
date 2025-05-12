/* ATOMS */
import type { BadgeImageProps } from '../components/Atoms/BadgeImage';
import type { BadgePillProps } from '../components/Atoms/BadgePill';
import type { BadgeRectangleProps } from '../components/Atoms/BadgeRectangle';
import type { BadgeTextProps } from '../components/Atoms/BadgeText';
import type { BreadcrumbsProps } from '../components/Atoms/Breadcrumbs';
import type { ButtonNames, ButtonProps } from '../components/Atoms/Button';
import type { DropdownProps } from '../components/Atoms/Dropdown';
import type { FormattedNumberProps } from '../components/Atoms/FormattedNumber';
import type { IconProps, IconNames } from '../components/Atoms/Icon';
import type { ImageProps } from '../components/Atoms/Image';
import type { LoadingBarProps } from '../components/Atoms/Loading';
import type { BannerNames, BannerProps, InlineBannerProps } from '../components/Atoms/Merchandising';
import type { OverlayProps } from '../components/Atoms/Overlay';
import type { PaginationInfoProps } from '../components/Atoms/PaginationInfo';
import type { PriceNames, PriceProps } from '../components/Atoms/Price';
import type { SkeletonProps } from '../components/Atoms/Skeleton';
// import type { ToggleProps } from '../components/Atoms/Toggle';

/* MOLECULES */
import type { CalloutBadgeProps } from '../components/Molecules/CalloutBadge';
import type { CarouselProps } from '../components/Molecules/Carousel';
import type { CheckboxProps } from '../components/Molecules/Checkbox';
import type { ErrorHandlerProps } from '../components/Molecules/ErrorHandler';
import type { FacetGridOptionsProps } from '../components/Molecules/FacetGridOptions';
import type { FacetHierarchyOptionsProps } from '../components/Molecules/FacetHierarchyOptions';
import type { FacetListOptionsProps } from '../components/Molecules/FacetListOptions';
import type { FacetPaletteOptionsProps } from '../components/Molecules/FacetPaletteOptions';
import type { FacetSliderProps } from '../components/Molecules/FacetSlider';
// import type { FacetToggleProps } from '../components/Molecules/FacetToggle';
import type { FilterNames, FilterProps } from '../components/Molecules/Filter';
import type { GridProps } from '../components/Molecules/Grid';
import type { LayoutSelectorProps } from '../components/Molecules/LayoutSelector';
import type { ListProps } from '../components/Molecules/List';
import type { LoadMoreProps } from '../components/Molecules/LoadMore';
import type { OverlayBadgeProps } from '../components/Molecules/OverlayBadge';
import type { PaginationProps } from '../components/Molecules/Pagination';
import type { PerPageProps } from '../components/Molecules/PerPage';
import type { RadioProps } from '../components/Molecules/Radio';
import type { RadioListProps } from '../components/Molecules/RadioList';
import type { RatingProps } from '../components/Molecules/Rating';
import type { ResultNames, ResultProps } from '../components/Molecules/Result';
import type { SearchInputProps } from '../components/Molecules/SearchInput';
import type { SelectProps } from '../components/Molecules/Select';
import type { SlideoutProps } from '../components/Molecules/Slideout';
import type { SortByProps } from '../components/Molecules/SortBy';
import type { SwatchesProps } from '../components/Molecules/Swatches';
import type { VariantSelectionProps } from '../components/Molecules/VariantSelection';
import type { TermsNames, TermsProps } from '../components/Molecules/Terms';

/* ORGANISMS */
import type { BranchOverrideProps } from '../components/Organisms/BranchOverride';
import type { FacetProps } from '../components/Organisms/Facet';
import type { FacetsHorizontalProps } from '../components/Organisms/FacetsHorizontal';
import type { FacetsNames, FacetsProps } from '../components/Organisms/Facets';
import type { FilterSummaryProps } from '../components/Organisms/FilterSummary';
import type { MobileSidebarProps } from '../components/Organisms/MobileSidebar';
import type { NoResultsProps } from '../components/Organisms/NoResults';
import type { ResultsNames, ResultsProps } from '../components/Organisms/Results';
import type { SearchHeaderProps } from '../components/Atoms/SearchHeader';
import type { SidebarProps } from '../components/Organisms/Sidebar';
import type { ToolbarProps, ToolbarNames } from '../components/Organisms/Toolbar';
import type { TermsListProps } from '../components/Organisms/TermsList';

/* TEMPLATES */
import type { RecommendationProps } from '../components/Templates/Recommendation';
import type { RecommendationBundleProps } from '../components/Templates/RecommendationBundle';
import type { RecommendationBundleEasyAddProps } from '../components/Templates/RecommendationBundleEasyAdd';
import type { RecommendationBundleListProps } from '../components/Templates/RecommendationBundleList';
import type { RecommendationBundleVerticalProps } from '../components/Templates/RecommendationBundleVertical';
import type { RecommendationGridProps } from '../components/Templates/RecommendationGrid';
import type { RecommendationEmailProps } from '../components/Templates/RecommendationEmail';
import type { SearchProps } from '../components/Templates/Search';
import type { SearchHorizontalProps } from '../components/Templates/SearchHorizontal';
import type { AutocompleteTemplateProps } from '../components/Templates/AutocompleteTemplate';
import type { SearchBocaProps } from '../components/Templates/SearchBoca';
import type { SearchSnappyProps } from '../components/Templates/SearchSnappy';
import { SearchSnapncoProps } from '../components/Templates/SearchSnapnco';

export type ThemeComponentProps<ComponentProps> = {
	default: Partial<ComponentProps>;
	mobile: Partial<ComponentProps>;
	tablet: Partial<ComponentProps>;
	desktop: Partial<ComponentProps>;
};

type ThemeComponentUnNamedSelectors<ComponentType extends string> = `*${ComponentType}` | `*${string} ${ComponentType}`;
type ThemeComponentNamedSelectors<ComponentType extends string, ComponentNames extends string> =
	| `*${ComponentType}`
	| `*${string} ${ComponentType}`
	| `*${string} ${ComponentType}.${ComponentNames}`
	| `*${ComponentType}.${ComponentNames}`;

type ThemeComponentOverridesUnNamedSelectors<ComponentType extends string> = `${ComponentType}` | `${string} ${ComponentType}`;
type ThemeComponentOverridesNamedSelectors<ComponentType extends string, ComponentNames extends string> =
	| `${ComponentType}`
	| `${string} ${ComponentType}`
	| `${string} ${ComponentType}.${ComponentNames}`
	| `${ComponentType}.${ComponentNames}`;

type ThemeComponentUnNamedSelectorsStartingWithTemplate<TemplateComponentType extends string, SubComponentType extends string> =
	| `*${TemplateComponentType} ${SubComponentType}`
	| `*${TemplateComponentType} ${string} ${SubComponentType}`;

type ThemeComponentNamedSelectorsStartingWithTemplate<
	TemplateComponentType extends string,
	SubComponentType extends string,
	ComponentNames extends string
> =
	| `*${TemplateComponentType} ${SubComponentType}`
	| `*${TemplateComponentType} ${string} ${SubComponentType}`
	| `*${TemplateComponentType} ${string} ${SubComponentType}.${ComponentNames}`
	| `*${TemplateComponentType} ${SubComponentType}.${ComponentNames}`;

export type ThemeComponentRestrictedProps<Props> = Partial<Omit<Props, ThemeComponentOmittedProps>>;
type ThemeComponentOmittedProps = 'theme' | 'inherits';

type ThemeComponentOverridesRestrictedProps<Props> = Partial<Omit<Props, ThemeComponentOverrideOmittedProps>>;
type ThemeComponentOverrideOmittedProps =
	| 'breakpoints'
	| 'styleScript'
	| 'themeStyleScript'
	| 'controller'
	| 'results'
	| 'facets'
	| 'facet'
	| 'result'
	| 'filter'
	| 'lang'
	| 'className'
	| 'ref'
	| 'snap'
	| 'name'
	| 'treePath'
	| 'disableStyles'
	| 'theme'
	| 'inherits';

/*

	theme: {
		components: {
			'*thing': {},
			'*template thing': {}
		}
	}

*/

export type ThemeComponents =
	/* ATOMS */
	{ [K in ThemeComponentOverridesUnNamedSelectors<'badgeImage'>]?: Partial<BadgeImageProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'badgePill'>]?: Partial<BadgePillProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'badgeRectangle'>]?: Partial<BadgeRectangleProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'badgeText'>]?: Partial<BadgeTextProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'breadcrumbs'>]?: Partial<BreadcrumbsProps> } & {
		[K in ThemeComponentOverridesNamedSelectors<'button', ButtonNames>]?: Partial<ButtonProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'dropdown'>]?: Partial<DropdownProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'formattedNumber'>]?: Partial<FormattedNumberProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'icon', IconNames>]?: Partial<IconProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'image'>]?: Partial<ImageProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'loadingBar'>]?: Partial<LoadingBarProps> } & {
		[K in ThemeComponentOverridesNamedSelectors<'banner', BannerNames>]?: Partial<BannerProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'inlineBanner'>]?: Partial<InlineBannerProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'overlay'>]?: Partial<OverlayProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'paginationInfo'>]?: Partial<PaginationInfoProps> } & {
		[K in ThemeComponentOverridesNamedSelectors<'price', PriceNames>]?: Partial<PriceProps>;
	} & {
		[K in ThemeComponentOverridesUnNamedSelectors<'skeleton'>]?: Partial<SkeletonProps>;
	} & /* MOLECULES */ // { [K in UnNamedThemeComponentSelectors<'toggle'>]?: RestrictedThemeComponentProps<ToggleProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'calloutBadge'>]?: Partial<CalloutBadgeProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'carousel'>]?: Partial<CarouselProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'checkbox'>]?: Partial<CheckboxProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'grid'>]?: Partial<GridProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'layoutSelector'>]?: Partial<LayoutSelectorProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'list'>]?: Partial<ListProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'radio'>]?: Partial<RadioProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'errorHandler'>]?: Partial<ErrorHandlerProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'facetGridOptions'>]?: Partial<FacetGridOptionsProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'facetHierarchyOptions'>]?: Partial<FacetHierarchyOptionsProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'facetListOptions'>]?: Partial<FacetListOptionsProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'facetPaletteOptions'>]?: Partial<FacetPaletteOptionsProps>;
	} & {
		[K in ThemeComponentOverridesUnNamedSelectors<'facetSlider'>]?: Partial<FacetSliderProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'filter', FilterNames>]?: Partial<FilterProps> } & { // { [K in UnNamedThemeComponentSelectors<'facetToggle'>]?: RestrictedThemeComponentProps<FacetToggleProps> } &
		[K in ThemeComponentOverridesUnNamedSelectors<'loadMore'>]?: Partial<LoadMoreProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'overlayBadge'>]?: Partial<OverlayBadgeProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'pagination'>]?: Partial<PaginationProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'perPage'>]?: Partial<PerPageProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'radioList'>]?: Partial<RadioListProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'rating'>]?: Partial<RatingProps> } & {
		[K in ThemeComponentOverridesNamedSelectors<'result', ResultNames>]?: Partial<ResultProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'searchInput'>]?: Partial<SearchInputProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'select'>]?: Partial<SelectProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'slideout'>]?: Partial<SlideoutProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'sortBy'>]?: Partial<SortByProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'swatches'>]?: Partial<SwatchesProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'variantSelection'>]?: Partial<VariantSelectionProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'terms', TermsNames>]?: Partial<TermsProps> } /* ORGANISMS */ & {
		[K in ThemeComponentOverridesUnNamedSelectors<'branchOverride'>]?: Partial<BranchOverrideProps>;
	} & {
		[K in ThemeComponentOverridesUnNamedSelectors<'facet'>]?: Partial<FacetProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'facets', FacetsNames>]?: Partial<FacetsProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'facetsHorizontal'>]?: Partial<FacetsHorizontalProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'filterSummary'>]?: Partial<FilterSummaryProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'noResults'>]?: Partial<NoResultsProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'results', ResultsNames>]?: Partial<ResultsProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'searchHeader'>]?: Partial<SearchHeaderProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'sidebar'>]?: Partial<SidebarProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'mobileSidebar'>]?: Partial<MobileSidebarProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'toolbar', ToolbarNames>]?: Partial<ToolbarProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'termsList'>]?: Partial<TermsListProps>;
	} /* TEMPLATES */ & { [K in ThemeComponentOverridesUnNamedSelectors<'autocompleteTemplate'>]?: Partial<AutocompleteTemplateProps> } & {
		[K in ThemeComponentOverridesNamedSelectors<'recommendation', string>]?: Partial<RecommendationProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'recommendationBundle', string>]?: Partial<RecommendationBundleProps> } & {
		[K in ThemeComponentOverridesNamedSelectors<'recommendationBundleEasyAdd', string>]?: Partial<RecommendationBundleEasyAddProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'recommendationBundleList', string>]?: Partial<RecommendationBundleListProps> } & {
		[K in ThemeComponentOverridesNamedSelectors<'recommendationBundleVertical', string>]?: Partial<RecommendationBundleVerticalProps>;
	} & { [K in ThemeComponentOverridesNamedSelectors<'recommendationGrid', string>]?: Partial<RecommendationGridProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'recommendationEmail'>]?: Partial<RecommendationEmailProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'search'>]?: Partial<SearchProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'searchSnappy'>]?: Partial<SearchSnappyProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'searchBoca'>]?: Partial<SearchBocaProps> } & {
		[K in ThemeComponentOverridesUnNamedSelectors<'searchSnapnco'>]?: Partial<SearchSnapncoProps>;
	} & { [K in ThemeComponentOverridesUnNamedSelectors<'searchHorizontal'>]?: Partial<SearchHorizontalProps> };

// prettier-ignore
export type ThemeComponentsRestricted =
	/* ATOMS */
	{ [K in ThemeComponentUnNamedSelectors<'badgeImage'>]?: ThemeComponentRestrictedProps<BadgeImageProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'badgePill'>]?: ThemeComponentRestrictedProps<BadgePillProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'badgeRectangle'>]?: ThemeComponentRestrictedProps<BadgeRectangleProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'badgeText'>]?: ThemeComponentRestrictedProps<BadgeTextProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'breadcrumbs'>]?: ThemeComponentRestrictedProps<BreadcrumbsProps> } &
	{ [K in ThemeComponentNamedSelectors<'button', ButtonNames>]?: ThemeComponentRestrictedProps<ButtonProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'dropdown'>]?: ThemeComponentRestrictedProps<DropdownProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'formattedNumber'>]?: ThemeComponentRestrictedProps<FormattedNumberProps> } &
	{ [K in ThemeComponentNamedSelectors<'icon', IconNames>]?: ThemeComponentRestrictedProps<IconProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'image'>]?: ThemeComponentRestrictedProps<ImageProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'loadingBar'>]?: ThemeComponentRestrictedProps<LoadingBarProps> } &
	{ [K in ThemeComponentNamedSelectors<'banner', BannerNames>]?: ThemeComponentRestrictedProps<BannerProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'inlineBanner'>]?: ThemeComponentRestrictedProps<InlineBannerProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'overlay'>]?: ThemeComponentRestrictedProps<OverlayProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'paginationInfo'>]?: ThemeComponentRestrictedProps<PaginationInfoProps> } &
	{ [K in ThemeComponentNamedSelectors<'price', PriceNames>]?: ThemeComponentRestrictedProps<PriceProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'skeleton'>]?: ThemeComponentRestrictedProps<SkeletonProps> } &
	// { [K in UnNamedThemeComponentSelectors<'toggle'>]?: RestrictedThemeComponentProps<ToggleProps> } &
	
	/* MOLECULES */
	{ [K in ThemeComponentUnNamedSelectors<'calloutBadge'>]?: ThemeComponentRestrictedProps<CalloutBadgeProps> } & 
	{ [K in ThemeComponentUnNamedSelectors<'carousel'>]?: ThemeComponentRestrictedProps<CarouselProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'checkbox'>]?: ThemeComponentRestrictedProps<CheckboxProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'grid'>]?: ThemeComponentRestrictedProps<GridProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'layoutSelector'>]?: ThemeComponentRestrictedProps<LayoutSelectorProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'list'>]?: ThemeComponentRestrictedProps<ListProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'radio'>]?: ThemeComponentRestrictedProps<RadioProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'errorHandler'>]?: ThemeComponentRestrictedProps<ErrorHandlerProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'facetGridOptions'>]?: ThemeComponentRestrictedProps<FacetGridOptionsProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'facetHierarchyOptions'>]?: ThemeComponentRestrictedProps<FacetHierarchyOptionsProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'facetListOptions'>]?: ThemeComponentRestrictedProps<FacetListOptionsProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'facetPaletteOptions'>]?: ThemeComponentRestrictedProps<FacetPaletteOptionsProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'facetSlider'>]?: ThemeComponentRestrictedProps<FacetSliderProps> } &
	// { [K in UnNamedThemeComponentSelectors<'facetToggle'>]?: RestrictedThemeComponentProps<FacetToggleProps> } &
	{ [K in ThemeComponentNamedSelectors<'filter', FilterNames>]?: ThemeComponentRestrictedProps<FilterProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'loadMore'>]?: ThemeComponentRestrictedProps<LoadMoreProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'overlayBadge'>]?: ThemeComponentRestrictedProps<OverlayBadgeProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'pagination'>]?: ThemeComponentRestrictedProps<PaginationProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'perPage'>]?: ThemeComponentRestrictedProps<PerPageProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'radioList'>]?: ThemeComponentRestrictedProps<RadioListProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'rating'>]?: ThemeComponentRestrictedProps<RatingProps> } &
	{ [K in ThemeComponentNamedSelectors<'result', ResultNames>]?: ThemeComponentRestrictedProps<ResultProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'searchInput'>]?: ThemeComponentRestrictedProps<SearchInputProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'select'>]?: ThemeComponentRestrictedProps<SelectProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'slideout'>]?: ThemeComponentRestrictedProps<SlideoutProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'sortBy'>]?: ThemeComponentRestrictedProps<SortByProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'swatches'>]?: ThemeComponentRestrictedProps<SwatchesProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'variantSelection'>]?: ThemeComponentRestrictedProps<VariantSelectionProps> } &
	{ [K in ThemeComponentNamedSelectors<'terms', TermsNames>]?: ThemeComponentRestrictedProps<TermsProps> } &

	/* ORGANISMS */
	{ [K in ThemeComponentUnNamedSelectors<'branchOverride'>]?: ThemeComponentRestrictedProps<BranchOverrideProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'facet'>]?: ThemeComponentRestrictedProps<FacetProps> } &
	{ [K in ThemeComponentNamedSelectors<'facets', FacetsNames>]?: ThemeComponentRestrictedProps<FacetsProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'facetsHorizontal'>]?: ThemeComponentRestrictedProps<FacetsHorizontalProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'filterSummary'>]?: ThemeComponentRestrictedProps<FilterSummaryProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'noResults'>]?: ThemeComponentRestrictedProps<NoResultsProps> } &
	{ [K in ThemeComponentNamedSelectors<'results', ResultsNames>]?: ThemeComponentRestrictedProps<ResultsProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'searchHeader'>]?: ThemeComponentRestrictedProps<SearchHeaderProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'sidebar'>]?: ThemeComponentRestrictedProps<SidebarProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'mobileSidebar'>]?: ThemeComponentRestrictedProps<MobileSidebarProps> } &
	{ [K in ThemeComponentNamedSelectors<'toolbar', ToolbarNames>]?: ThemeComponentRestrictedProps<ToolbarProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'termsList'>]?: ThemeComponentRestrictedProps<TermsListProps> } &


	/* TEMPLATES */
	{ [K in ThemeComponentUnNamedSelectors<'autocompleteTemplate'>]?: ThemeComponentRestrictedProps<AutocompleteTemplateProps> } &
	{ [K in ThemeComponentNamedSelectors<'recommendation', string>]?: ThemeComponentRestrictedProps<RecommendationProps> } &
	{ [K in ThemeComponentNamedSelectors<'recommendationBundle', string>]?: ThemeComponentRestrictedProps<RecommendationBundleProps> } &
	{ [K in ThemeComponentNamedSelectors<'recommendationBundleEasyAdd', string>]?: ThemeComponentRestrictedProps<RecommendationBundleEasyAddProps> } &
	{ [K in ThemeComponentNamedSelectors<'recommendationBundleList', string>]?: ThemeComponentRestrictedProps<RecommendationBundleListProps> } &
	{ [K in ThemeComponentNamedSelectors<'recommendationBundleVertical', string>]?: ThemeComponentRestrictedProps<RecommendationBundleVerticalProps> } &
	{ [K in ThemeComponentNamedSelectors<'recommendationGrid', string>]?: ThemeComponentRestrictedProps<RecommendationGridProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'recommendationEmail'>]?: ThemeComponentRestrictedProps<RecommendationEmailProps> } & 
	{ [K in ThemeComponentUnNamedSelectors<'search'>]?: ThemeComponentRestrictedProps<SearchProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'searchSnappy'>]?: ThemeComponentRestrictedProps<SearchSnappyProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'searchBoca'>]?: ThemeComponentRestrictedProps<SearchBocaProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'searchSnapnco'>]?: ThemeComponentRestrictedProps<SearchSnapncoProps> } &
	{ [K in ThemeComponentUnNamedSelectors<'searchHorizontal'>]?: ThemeComponentRestrictedProps<SearchHorizontalProps> };

// prettier-ignore
export type ThemeComponentsRestrictedOverrides =
	/* ATOMS */
	{ [K in ThemeComponentOverridesUnNamedSelectors<'badgeImage'>]?: ThemeComponentOverridesRestrictedProps<BadgeImageProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'badgePill'>]?: ThemeComponentOverridesRestrictedProps<BadgePillProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'badgeRectangle'>]?: ThemeComponentOverridesRestrictedProps<BadgeRectangleProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'badgeText'>]?: ThemeComponentOverridesRestrictedProps<BadgeTextProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'breadcrumbs'>]?: ThemeComponentOverridesRestrictedProps<BreadcrumbsProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'button', ButtonNames>]?: ThemeComponentOverridesRestrictedProps<ButtonProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'dropdown'>]?: ThemeComponentOverridesRestrictedProps<DropdownProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'formattedNumber'>]?: ThemeComponentOverridesRestrictedProps<FormattedNumberProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'icon', IconNames>]?: ThemeComponentOverridesRestrictedProps<IconProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'image'>]?: ThemeComponentOverridesRestrictedProps<ImageProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'loadingBar'>]?: ThemeComponentOverridesRestrictedProps<LoadingBarProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'banner', BannerNames>]?: ThemeComponentOverridesRestrictedProps<BannerProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'inlineBanner'>]?: ThemeComponentOverridesRestrictedProps<InlineBannerProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'overlay'>]?: ThemeComponentOverridesRestrictedProps<OverlayProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'paginationInfo'>]?: ThemeComponentOverridesRestrictedProps<PaginationInfoProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'price', PriceNames>]?: ThemeComponentOverridesRestrictedProps<PriceProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'skeleton'>]?: ThemeComponentOverridesRestrictedProps<SkeletonProps> } &
	// { [K in UnNamedThemeComponentSelectors<'toggle'>]?: RestrictedComponentProps<ToggleProps> } &
	
	/* MOLECULES */
	{ [K in ThemeComponentOverridesUnNamedSelectors<'calloutBadge'>]?: ThemeComponentOverridesRestrictedProps<CalloutBadgeProps> } & 
	{ [K in ThemeComponentOverridesUnNamedSelectors<'carousel'>]?: ThemeComponentOverridesRestrictedProps<CarouselProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'checkbox'>]?: ThemeComponentOverridesRestrictedProps<CheckboxProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'grid'>]?: ThemeComponentOverridesRestrictedProps<GridProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'layoutSelector'>]?: ThemeComponentOverridesRestrictedProps<LayoutSelectorProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'list'>]?: ThemeComponentOverridesRestrictedProps<ListProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'radio'>]?: ThemeComponentOverridesRestrictedProps<RadioProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'errorHandler'>]?: ThemeComponentOverridesRestrictedProps<ErrorHandlerProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'facetGridOptions'>]?: ThemeComponentOverridesRestrictedProps<FacetGridOptionsProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'facetHierarchyOptions'>]?: ThemeComponentOverridesRestrictedProps<FacetHierarchyOptionsProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'facetListOptions'>]?: ThemeComponentOverridesRestrictedProps<FacetListOptionsProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'facetPaletteOptions'>]?: ThemeComponentOverridesRestrictedProps<FacetPaletteOptionsProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'facetSlider'>]?: ThemeComponentOverridesRestrictedProps<FacetSliderProps> } &
	// { [K in UnNamedThemeComponentSelectors<'facetToggle'>]?: RestrictedComponentProps<FacetToggleProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'filter', FilterNames>]?: ThemeComponentOverridesRestrictedProps<FilterProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'loadMore'>]?: ThemeComponentOverridesRestrictedProps<LoadMoreProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'overlayBadge'>]?: ThemeComponentOverridesRestrictedProps<OverlayBadgeProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'pagination'>]?: ThemeComponentOverridesRestrictedProps<PaginationProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'perPage'>]?: ThemeComponentOverridesRestrictedProps<PerPageProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'radioList'>]?: ThemeComponentOverridesRestrictedProps<RadioListProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'rating'>]?: ThemeComponentOverridesRestrictedProps<RatingProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'result', ResultNames>]?: ThemeComponentOverridesRestrictedProps<ResultProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'searchInput'>]?: ThemeComponentOverridesRestrictedProps<SearchInputProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'select'>]?: ThemeComponentOverridesRestrictedProps<SelectProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'slideout'>]?: ThemeComponentOverridesRestrictedProps<SlideoutProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'sortBy'>]?: ThemeComponentOverridesRestrictedProps<SortByProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'swatches'>]?: ThemeComponentOverridesRestrictedProps<SwatchesProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'variantSelection'>]?: ThemeComponentOverridesRestrictedProps<VariantSelectionProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'terms', TermsNames>]?: ThemeComponentOverridesRestrictedProps<TermsProps> } &

	/* ORGANISMS */
	{ [K in ThemeComponentOverridesUnNamedSelectors<'branchOverride'>]?: ThemeComponentOverridesRestrictedProps<BranchOverrideProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'facet'>]?: ThemeComponentOverridesRestrictedProps<FacetProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'facets', FacetsNames>]?: ThemeComponentOverridesRestrictedProps<FacetsProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'facetsHorizontal'>]?: ThemeComponentOverridesRestrictedProps<FacetsHorizontalProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'filterSummary'>]?: ThemeComponentOverridesRestrictedProps<FilterSummaryProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'noResults'>]?: ThemeComponentOverridesRestrictedProps<NoResultsProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'results', ResultsNames>]?: ThemeComponentOverridesRestrictedProps<ResultsProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'searchHeader'>]?: ThemeComponentOverridesRestrictedProps<SearchHeaderProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'sidebar'>]?: ThemeComponentOverridesRestrictedProps<SidebarProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'mobileSidebar'>]?: ThemeComponentOverridesRestrictedProps<MobileSidebarProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'toolbar', ToolbarNames>]?: ThemeComponentOverridesRestrictedProps<ToolbarProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'termsList'>]?: ThemeComponentOverridesRestrictedProps<TermsListProps> } &

	/* TEMPLATES */
	{ [K in ThemeComponentOverridesUnNamedSelectors<'autocompleteTemplate'>]?: ThemeComponentOverridesRestrictedProps<AutocompleteTemplateProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'recommendation', string>]?: ThemeComponentOverridesRestrictedProps<RecommendationProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'recommendationBundle', string>]?: ThemeComponentOverridesRestrictedProps<RecommendationBundleProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'recommendationBundleEasyAdd', string>]?: ThemeComponentOverridesRestrictedProps<RecommendationBundleEasyAddProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'recommendationBundleList', string>]?: ThemeComponentOverridesRestrictedProps<RecommendationBundleListProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'recommendationBundleVertical', string>]?: ThemeComponentOverridesRestrictedProps<RecommendationBundleVerticalProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'recommendationGrid', string>]?: ThemeComponentOverridesRestrictedProps<RecommendationGridProps> } &
	{ [K in ThemeComponentOverridesNamedSelectors<'recommendationEmail', string>]?: ThemeComponentOverridesRestrictedProps<RecommendationEmailProps> } & 
	{ [K in ThemeComponentOverridesUnNamedSelectors<'search'>]?: ThemeComponentOverridesRestrictedProps<SearchProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'searchSnappy'>]?: ThemeComponentOverridesRestrictedProps<SearchSnappyProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'searchBoca'>]?: ThemeComponentOverridesRestrictedProps<SearchBocaProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'searchSnapnco'>]?: ThemeComponentOverridesRestrictedProps<SearchSnapncoProps> } &
	{ [K in ThemeComponentOverridesUnNamedSelectors<'searchHorizontal'>]?: ThemeComponentOverridesRestrictedProps<SearchHorizontalProps> };

// prettier-ignore
export type ThemeComponentTemplateOverrides<Template extends string> =
	/* ATOMS */
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template, 'badgeImage'>]?: ThemeComponentRestrictedProps<BadgeImageProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'badgePill'>]?: ThemeComponentRestrictedProps<BadgePillProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'badgeRectangle'>]?: ThemeComponentRestrictedProps<BadgeRectangleProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'badgeText'>]?: ThemeComponentRestrictedProps<BadgeTextProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'breadcrumbs'>]?: ThemeComponentRestrictedProps<BreadcrumbsProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template, 'button', ButtonNames>]?: ThemeComponentRestrictedProps<ButtonProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'dropdown'>]?: ThemeComponentRestrictedProps<DropdownProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'formattedNumber'>]?: ThemeComponentRestrictedProps<FormattedNumberProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template, 'icon', IconNames>]?: ThemeComponentRestrictedProps<IconProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'image'>]?: ThemeComponentRestrictedProps<ImageProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'loadingBar'>]?: ThemeComponentRestrictedProps<LoadingBarProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template,'banner', BannerNames>]?: ThemeComponentRestrictedProps<BannerProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'inlineBanner'>]?: ThemeComponentRestrictedProps<InlineBannerProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'overlay'>]?: ThemeComponentRestrictedProps<OverlayProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'paginationInfo'>]?: ThemeComponentRestrictedProps<PaginationInfoProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template,'price', PriceNames>]?: ThemeComponentRestrictedProps<PriceProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'skeleton'>]?: ThemeComponentRestrictedProps<SkeletonProps> } &
	// { [K in StartsWithTemplateHavingUnNamedThemeComponentSelectors<Template,'toggle'>]?: RestrictedThemeComponentProps<ToggleProps> } &
	
	/* MOLECULES */
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'calloutBadge'>]?: ThemeComponentRestrictedProps<CalloutBadgeProps> } & 
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'carousel'>]?: ThemeComponentRestrictedProps<CarouselProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'checkbox'>]?: ThemeComponentRestrictedProps<CheckboxProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'grid'>]?: ThemeComponentRestrictedProps<GridProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'layoutSelector'>]?: ThemeComponentRestrictedProps<LayoutSelectorProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'list'>]?: ThemeComponentRestrictedProps<ListProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'radio'>]?: ThemeComponentRestrictedProps<RadioProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'errorHandler'>]?: ThemeComponentRestrictedProps<ErrorHandlerProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'facetGridOptions'>]?: ThemeComponentRestrictedProps<FacetGridOptionsProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'facetHierarchyOptions'>]?: ThemeComponentRestrictedProps<FacetHierarchyOptionsProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'facetListOptions'>]?: ThemeComponentRestrictedProps<FacetListOptionsProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'facetPaletteOptions'>]?: ThemeComponentRestrictedProps<FacetPaletteOptionsProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'facetSlider'>]?: ThemeComponentRestrictedProps<FacetSliderProps> } &
	// { [K in StartsWithTemplateHavingUnNamedThemeComponentSelectors<Template,'facetToggle'>]?: RestrictedThemeComponentProps<FacetToggleProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template,'filter', FilterNames>]?: ThemeComponentRestrictedProps<FilterProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'loadMore'>]?: ThemeComponentRestrictedProps<LoadMoreProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'overlayBadge'>]?: ThemeComponentRestrictedProps<OverlayBadgeProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'pagination'>]?: ThemeComponentRestrictedProps<PaginationProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'perPage'>]?: ThemeComponentRestrictedProps<PerPageProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'radioList'>]?: ThemeComponentRestrictedProps<RadioListProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'rating'>]?: ThemeComponentRestrictedProps<RatingProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template,'result', ResultNames>]?: ThemeComponentRestrictedProps<ResultProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'searchInput'>]?: ThemeComponentRestrictedProps<SearchInputProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'select'>]?: ThemeComponentRestrictedProps<SelectProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'slideout'>]?: ThemeComponentRestrictedProps<SlideoutProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'sortBy'>]?: ThemeComponentRestrictedProps<SortByProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'swatches'>]?: ThemeComponentRestrictedProps<SwatchesProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'variantSelection'>]?: ThemeComponentRestrictedProps<VariantSelectionProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template,'terms', TermsNames>]?: ThemeComponentRestrictedProps<TermsProps> } &

	/* ORGANISMS */
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'branchOverride'>]?: ThemeComponentRestrictedProps<BranchOverrideProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'facet'>]?: ThemeComponentRestrictedProps<FacetProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template,'facets', FacetsNames>]?: ThemeComponentRestrictedProps<FacetsProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'facetsHorizontal'>]?: ThemeComponentRestrictedProps<FacetsHorizontalProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'filterSummary'>]?: ThemeComponentRestrictedProps<FilterSummaryProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'noResults'>]?: ThemeComponentRestrictedProps<NoResultsProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template,'results', ResultsNames>]?: ThemeComponentRestrictedProps<ResultsProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'searchHeader'>]?: ThemeComponentRestrictedProps<SearchHeaderProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'sidebar'>]?: ThemeComponentRestrictedProps<SidebarProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'mobileSidebar'>]?: ThemeComponentRestrictedProps<MobileSidebarProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template,'toolbar', ToolbarNames>]?: ThemeComponentRestrictedProps<ToolbarProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'termsList'>]?: ThemeComponentRestrictedProps<TermsListProps> } &


	/* TEMPLATES */
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'autocompleteTemplate'>]?: ThemeComponentRestrictedProps<AutocompleteTemplateProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template, 'recommendation', string>]?: ThemeComponentRestrictedProps<RecommendationProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template, 'recommendationBundle', string>]?: ThemeComponentRestrictedProps<RecommendationBundleProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template, 'recommendationBundleEasyAdd', string>]?: ThemeComponentRestrictedProps<RecommendationBundleEasyAddProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template, 'recommendationBundleList', string>]?: ThemeComponentRestrictedProps<RecommendationBundleListProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template, 'recommendationBundleVertical', string>]?: ThemeComponentRestrictedProps<RecommendationBundleVerticalProps> } &
	{ [K in ThemeComponentNamedSelectorsStartingWithTemplate<Template, 'recommendationGrid', string>]?: ThemeComponentRestrictedProps<RecommendationGridProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'recommendationEmail'>]?: ThemeComponentRestrictedProps<RecommendationEmailProps> } & 
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'search'>]?: ThemeComponentRestrictedProps<SearchProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'searchSnappy'>]?: ThemeComponentRestrictedProps<SearchSnappyProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'searchBoca'>]?: ThemeComponentRestrictedProps<SearchBocaProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'searchSnapnco'>]?: ThemeComponentRestrictedProps<SearchSnapncoProps> } &
	{ [K in ThemeComponentUnNamedSelectorsStartingWithTemplate<Template,'searchHorizontal'>]?: Partial<SearchHorizontalProps> };
