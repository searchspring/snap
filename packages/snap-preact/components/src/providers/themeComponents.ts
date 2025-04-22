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

/* TEMPLATES */
import type { AutocompleteProps } from '../components/Templates/Autocomplete';
// import type { AutocompleteTermsProps } from '../components/Templates/AutocompleteTerms';
import type { RecommendationProps } from '../components/Templates/Recommendation';
import type { RecommendationBundleProps } from '../components/Templates/RecommendationBundle';
import type { RecommendationBundleEasyAddProps } from '../components/Templates/RecommendationBundleEasyAdd';
import type { RecommendationBundleListProps } from '../components/Templates/RecommendationBundleList';
import type { RecommendationBundleVerticalProps } from '../components/Templates/RecommendationBundleVertical';
import type { RecommendationGridProps } from '../components/Templates/RecommendationGrid';
import type { RecommendationEmailProps } from '../components/Templates/RecommendationEmail';
import type { SearchProps } from '../components/Templates/Search';
import type { SearchHorizontalProps } from '../components/Templates/SearchHorizontal';

export type ThemeComponentProps<ComponentProps> = {
	default: Partial<ComponentProps>;
	mobile: Partial<ComponentProps>;
	tablet: Partial<ComponentProps>;
	desktop: Partial<ComponentProps>;
};

type NamedThemeComponentSelectors<ComponentType extends string, ComponentNames extends string> =
	| ComponentType
	| `${string} ${ComponentType}`
	| `${string} ${ComponentType}.${ComponentNames}`
	| `${ComponentType}.${ComponentNames}`;

type UnNamedThemeComponentSelectors<ComponentType extends string> = ComponentType | `${string} ${ComponentType}`;

type RestrictedComponentProps<Props> = Partial<Omit<Props, OmittedComponentProps>>;
type OmittedComponentProps =
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
	| 'disableStyles';

export type ThemeComponents = {
	/* ATOMS */
	badgeImage: Partial<BadgeImageProps>;
	badgePill: Partial<BadgePillProps>;
	badgeRectangle: Partial<BadgeRectangleProps>;
	badgeText: Partial<BadgeTextProps>;
	breadcrumbs: Partial<BreadcrumbsProps>;
	button: Partial<ButtonProps>;
	dropdown: Partial<DropdownProps>;
	formattedNumber: Partial<FormattedNumberProps>;
	icon: Partial<IconProps>;
	image: Partial<ImageProps>;
	loadingBar: Partial<LoadingBarProps>;
	banner: Partial<BannerProps>;
	inlineBanner: Partial<InlineBannerProps>;
	overlay: Partial<OverlayProps>;
	price: Partial<PriceProps>;
	skeleton: Partial<SkeletonProps>;
	// toggle: Partial<ToggleProps>;

	/* MOLECULES */
	calloutBadge: Partial<CalloutBadgeProps>;
	carousel: Partial<CarouselProps>;
	checkbox: Partial<CheckboxProps>;
	grid: Partial<GridProps>;
	layoutSelector: Partial<LayoutSelectorProps>;
	list: Partial<ListProps>;
	radio: Partial<RadioProps>;
	errorHandler: Partial<ErrorHandlerProps>;
	facetGridOptions: Partial<FacetGridOptionsProps>;
	facetHierarchyOptions: Partial<FacetHierarchyOptionsProps>;
	facetListOptions: Partial<FacetListOptionsProps>;
	facetPaletteOptions: Partial<FacetPaletteOptionsProps>;
	facetSlider: Partial<FacetSliderProps>;
	// facetToggle: Partial<FacetToggleProps>;
	filter: Partial<FilterProps>;
	loadMore: Partial<LoadMoreProps>;
	overlayBadge: Partial<OverlayBadgeProps>;
	pagination: Partial<PaginationProps>;
	perPage: Partial<PerPageProps>;
	radioList: Partial<RadioListProps>;
	rating: Partial<RatingProps>;
	result: Partial<ResultProps>;
	searchInput: Partial<SearchInputProps>;
	select: Partial<SelectProps>;
	slideout: Partial<SlideoutProps>;
	sortBy: Partial<SortByProps>;
	swatches: Partial<SwatchesProps>;
	variantSelection: Partial<VariantSelectionProps>;

	/* ORGANISMS */
	branchOverride: Partial<BranchOverrideProps>;
	facet: Partial<FacetProps>;
	facets: Partial<FacetsProps>;
	facetsHorizontal: Partial<FacetsHorizontalProps>;
	filterSummary: Partial<FilterSummaryProps>;
	noResults: Partial<NoResultsProps>;
	results: Partial<ResultsProps>;
	searchHeader: Partial<SearchHeaderProps>;
	sidebar: Partial<SidebarProps>;
	mobileSidebar: Partial<MobileSidebarProps>;
	toolbar: Partial<ToolbarProps>;

	/* TEMPLATES */
	autocomplete: Partial<AutocompleteProps>;
	// autocompleteTerms: Partial<AutocompleteTermsProps>;
	recommendation: Partial<RecommendationProps>;
	recommendationBundle: Partial<RecommendationBundleProps>;
	recommendationBundleEasyAdd: Partial<RecommendationBundleEasyAddProps>;
	recommendationBundleList: Partial<RecommendationBundleListProps>;
	recommendationBundleVertical: Partial<RecommendationBundleVerticalProps>;
	recommendationGrid: Partial<RecommendationGridProps>;
	recommendationEmail: Partial<RecommendationEmailProps>;
	search: Partial<SearchProps>;
	searchHorizontal: Partial<SearchHorizontalProps>;
};

// prettier-ignore
export type ThemeComponentOverrides =
	/* ATOMS */
	{ [K in UnNamedThemeComponentSelectors<'badgeImage'>]?: Partial<BadgeImageProps> } &
	{ [K in UnNamedThemeComponentSelectors<'badgePill'>]?: Partial<BadgePillProps> } &
	{ [K in UnNamedThemeComponentSelectors<'badgeRectangle'>]?: Partial<BadgeRectangleProps> } &
	{ [K in UnNamedThemeComponentSelectors<'badgeText'>]?: Partial<BadgeTextProps> } &
	{ [K in UnNamedThemeComponentSelectors<'breadcrumbs'>]?: Partial<BreadcrumbsProps> } &
	{ [K in NamedThemeComponentSelectors<'button', ButtonNames>]?: Partial<ButtonProps> } &
	{ [K in UnNamedThemeComponentSelectors<'dropdown'>]?: Partial<DropdownProps> } &
	{ [K in UnNamedThemeComponentSelectors<'formattedNumber'>]?: Partial<FormattedNumberProps> } &
	{ [K in NamedThemeComponentSelectors<'icon', IconNames>]?: Partial<IconProps> } &
	{ [K in UnNamedThemeComponentSelectors<'image'>]?: Partial<ImageProps> } &
	{ [K in UnNamedThemeComponentSelectors<'loadingBar'>]?: Partial<LoadingBarProps> } &
	{ [K in NamedThemeComponentSelectors<'banner', BannerNames>]?: Partial<BannerProps> } &
	{ [K in UnNamedThemeComponentSelectors<'inlineBanner'>]?: Partial<InlineBannerProps> } &
	{ [K in UnNamedThemeComponentSelectors<'overlay'>]?: Partial<OverlayProps> } &
	{ [K in UnNamedThemeComponentSelectors<'paginationInfo'>]?: Partial<PaginationInfoProps> } &
	{ [K in NamedThemeComponentSelectors<'price', PriceNames>]?: Partial<PriceProps> } &
	{ [K in UnNamedThemeComponentSelectors<'skeleton'>]?: Partial<SkeletonProps> } &
	// { [K in UnNamedThemeComponentSelectors<'toggle'>]?: Partial<ToggleProps> } &
	
	/* MOLECULES */
	{ [K in UnNamedThemeComponentSelectors<'calloutBadge'>]?: Partial<CalloutBadgeProps> } & 
	{ [K in UnNamedThemeComponentSelectors<'carousel'>]?: Partial<CarouselProps> } &
	{ [K in UnNamedThemeComponentSelectors<'checkbox'>]?: Partial<CheckboxProps> } &
	{ [K in UnNamedThemeComponentSelectors<'grid'>]?: Partial<GridProps> } &
	{ [K in UnNamedThemeComponentSelectors<'layoutSelector'>]?: Partial<LayoutSelectorProps> } &
	{ [K in UnNamedThemeComponentSelectors<'list'>]?: Partial<ListProps> } &
	{ [K in UnNamedThemeComponentSelectors<'radio'>]?: Partial<RadioProps> } &
	{ [K in UnNamedThemeComponentSelectors<'errorHandler'>]?: Partial<ErrorHandlerProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetGridOptions'>]?: Partial<FacetGridOptionsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetHierarchyOptions'>]?: Partial<FacetHierarchyOptionsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetListOptions'>]?: Partial<FacetListOptionsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetPaletteOptions'>]?: Partial<FacetPaletteOptionsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetSlider'>]?: Partial<FacetSliderProps> } &
	// { [K in UnNamedThemeComponentSelectors<'facetToggle'>]?: Partial<FacetToggleProps> } &
	{ [K in NamedThemeComponentSelectors<'filter', FilterNames>]?: Partial<FilterProps> } &
	{ [K in UnNamedThemeComponentSelectors<'loadMore'>]?: Partial<LoadMoreProps> } &
	{ [K in UnNamedThemeComponentSelectors<'overlayBadge'>]?: Partial<OverlayBadgeProps> } &
	{ [K in UnNamedThemeComponentSelectors<'pagination'>]?: Partial<PaginationProps> } &
	{ [K in UnNamedThemeComponentSelectors<'perPage'>]?: Partial<PerPageProps> } &
	{ [K in UnNamedThemeComponentSelectors<'radioList'>]?: Partial<RadioListProps> } &
	{ [K in UnNamedThemeComponentSelectors<'rating'>]?: Partial<RatingProps> } &
	{ [K in NamedThemeComponentSelectors<'result', ResultNames>]?: Partial<ResultProps> } &
	{ [K in UnNamedThemeComponentSelectors<'searchInput'>]?: Partial<SearchInputProps> } &
	{ [K in UnNamedThemeComponentSelectors<'select'>]?: Partial<SelectProps> } &
	{ [K in UnNamedThemeComponentSelectors<'slideout'>]?: Partial<SlideoutProps> } &
	{ [K in UnNamedThemeComponentSelectors<'sortBy'>]?: Partial<SortByProps> } &
	{ [K in UnNamedThemeComponentSelectors<'swatches'>]?: Partial<SwatchesProps> } &
	{ [K in UnNamedThemeComponentSelectors<'variantSelection'>]?: Partial<VariantSelectionProps> } &

	/* ORGANISMS */
	{ [K in UnNamedThemeComponentSelectors<'branchOverride'>]?: Partial<BranchOverrideProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facet'>]?: Partial<FacetProps> } &
	{ [K in NamedThemeComponentSelectors<'facets', FacetsNames>]?: Partial<FacetsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetsHorizontal'>]?: Partial<FacetsHorizontalProps> } &
	{ [K in UnNamedThemeComponentSelectors<'filterSummary'>]?: Partial<FilterSummaryProps> } &
	{ [K in UnNamedThemeComponentSelectors<'noResults'>]?: Partial<NoResultsProps> } &
	{ [K in NamedThemeComponentSelectors<'results', ResultsNames>]?: Partial<ResultsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'searchHeader'>]?: Partial<SearchHeaderProps> } &
	{ [K in UnNamedThemeComponentSelectors<'sidebar'>]?: Partial<SidebarProps> } &
	{ [K in UnNamedThemeComponentSelectors<'mobileSidebar'>]?: Partial<MobileSidebarProps> } &
	{ [K in NamedThemeComponentSelectors<'toolbar', ToolbarNames>]?: Partial<ToolbarProps> } &

	/* TEMPLATES */
	{ [K in UnNamedThemeComponentSelectors<'autocomplete'>]?: Partial<AutocompleteProps> } &
	// { [K in UnNamedThemeComponentSelectors<'autocompleteTerms'>]?: Partial<AutocompleteTermsProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendation', string>]?: Partial<RecommendationProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationBundle', string>]?: Partial<RecommendationBundleProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationBundleEasyAdd', string>]?: Partial<RecommendationBundleEasyAddProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationBundleList', string>]?: Partial<RecommendationBundleListProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationBundleVertical', string>]?: Partial<RecommendationBundleVerticalProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationGrid', string>]?: Partial<RecommendationGridProps> } &
	{ [K in UnNamedThemeComponentSelectors<'recommendationEmail'>]?: Partial<RecommendationEmailProps> } & 
	{ [K in UnNamedThemeComponentSelectors<'search'>]?: Partial<SearchProps> } &
	{ [K in UnNamedThemeComponentSelectors<'searchHorizontal'>]?: Partial<SearchHorizontalProps> };

// prettier-ignore
export type ThemeComponentRestrictedOverrides =
	/* ATOMS */
	{ [K in UnNamedThemeComponentSelectors<'badgeImage'>]?: RestrictedComponentProps<BadgeImageProps> } &
	{ [K in UnNamedThemeComponentSelectors<'badgePill'>]?: RestrictedComponentProps<BadgePillProps> } &
	{ [K in UnNamedThemeComponentSelectors<'badgeRectangle'>]?: RestrictedComponentProps<BadgeRectangleProps> } &
	{ [K in UnNamedThemeComponentSelectors<'badgeText'>]?: RestrictedComponentProps<BadgeTextProps> } &
	{ [K in UnNamedThemeComponentSelectors<'breadcrumbs'>]?: RestrictedComponentProps<BreadcrumbsProps> } &
	{ [K in NamedThemeComponentSelectors<'button', ButtonNames>]?: RestrictedComponentProps<ButtonProps> } &
	{ [K in UnNamedThemeComponentSelectors<'dropdown'>]?: RestrictedComponentProps<DropdownProps> } &
	{ [K in UnNamedThemeComponentSelectors<'formattedNumber'>]?: RestrictedComponentProps<FormattedNumberProps> } &
	{ [K in NamedThemeComponentSelectors<'icon', IconNames>]?: RestrictedComponentProps<IconProps> } &
	{ [K in UnNamedThemeComponentSelectors<'image'>]?: RestrictedComponentProps<ImageProps> } &
	{ [K in UnNamedThemeComponentSelectors<'loadingBar'>]?: RestrictedComponentProps<LoadingBarProps> } &
	{ [K in NamedThemeComponentSelectors<'banner', BannerNames>]?: RestrictedComponentProps<BannerProps> } &
	{ [K in UnNamedThemeComponentSelectors<'inlineBanner'>]?: RestrictedComponentProps<InlineBannerProps> } &
	{ [K in UnNamedThemeComponentSelectors<'overlay'>]?: RestrictedComponentProps<OverlayProps> } &
	{ [K in UnNamedThemeComponentSelectors<'paginationInfo'>]?: RestrictedComponentProps<PaginationInfoProps> } &
	{ [K in NamedThemeComponentSelectors<'price', PriceNames>]?: RestrictedComponentProps<PriceProps> } &
	{ [K in UnNamedThemeComponentSelectors<'skeleton'>]?: RestrictedComponentProps<SkeletonProps> } &
	// { [K in UnNamedThemeComponentSelectors<'toggle'>]?: RestrictedComponentProps<ToggleProps> } &
	
	/* MOLECULES */
	{ [K in UnNamedThemeComponentSelectors<'calloutBadge'>]?: RestrictedComponentProps<CalloutBadgeProps> } & 
	{ [K in UnNamedThemeComponentSelectors<'carousel'>]?: RestrictedComponentProps<CarouselProps> } &
	{ [K in UnNamedThemeComponentSelectors<'checkbox'>]?: RestrictedComponentProps<CheckboxProps> } &
	{ [K in UnNamedThemeComponentSelectors<'grid'>]?: RestrictedComponentProps<GridProps> } &
	{ [K in UnNamedThemeComponentSelectors<'layoutSelector'>]?: RestrictedComponentProps<LayoutSelectorProps> } &
	{ [K in UnNamedThemeComponentSelectors<'list'>]?: RestrictedComponentProps<ListProps> } &
	{ [K in UnNamedThemeComponentSelectors<'radio'>]?: RestrictedComponentProps<RadioProps> } &
	{ [K in UnNamedThemeComponentSelectors<'errorHandler'>]?: RestrictedComponentProps<ErrorHandlerProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetGridOptions'>]?: RestrictedComponentProps<FacetGridOptionsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetHierarchyOptions'>]?: RestrictedComponentProps<FacetHierarchyOptionsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetListOptions'>]?: RestrictedComponentProps<FacetListOptionsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetPaletteOptions'>]?: RestrictedComponentProps<FacetPaletteOptionsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetSlider'>]?: RestrictedComponentProps<FacetSliderProps> } &
	// { [K in UnNamedThemeComponentSelectors<'facetToggle'>]?: RestrictedComponentProps<FacetToggleProps> } &
	{ [K in NamedThemeComponentSelectors<'filter', FilterNames>]?: RestrictedComponentProps<FilterProps> } &
	{ [K in UnNamedThemeComponentSelectors<'loadMore'>]?: RestrictedComponentProps<LoadMoreProps> } &
	{ [K in UnNamedThemeComponentSelectors<'overlayBadge'>]?: RestrictedComponentProps<OverlayBadgeProps> } &
	{ [K in UnNamedThemeComponentSelectors<'pagination'>]?: RestrictedComponentProps<PaginationProps> } &
	{ [K in UnNamedThemeComponentSelectors<'perPage'>]?: RestrictedComponentProps<PerPageProps> } &
	{ [K in UnNamedThemeComponentSelectors<'radioList'>]?: RestrictedComponentProps<RadioListProps> } &
	{ [K in UnNamedThemeComponentSelectors<'rating'>]?: RestrictedComponentProps<RatingProps> } &
	{ [K in NamedThemeComponentSelectors<'result', ResultNames>]?: RestrictedComponentProps<ResultProps> } &
	{ [K in UnNamedThemeComponentSelectors<'searchInput'>]?: RestrictedComponentProps<SearchInputProps> } &
	{ [K in UnNamedThemeComponentSelectors<'select'>]?: RestrictedComponentProps<SelectProps> } &
	{ [K in UnNamedThemeComponentSelectors<'slideout'>]?: RestrictedComponentProps<SlideoutProps> } &
	{ [K in UnNamedThemeComponentSelectors<'sortBy'>]?: RestrictedComponentProps<SortByProps> } &
	{ [K in UnNamedThemeComponentSelectors<'swatches'>]?: RestrictedComponentProps<SwatchesProps> } &
	{ [K in UnNamedThemeComponentSelectors<'variantSelection'>]?: RestrictedComponentProps<VariantSelectionProps> } &

	/* ORGANISMS */
	{ [K in UnNamedThemeComponentSelectors<'branchOverride'>]?: RestrictedComponentProps<BranchOverrideProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facet'>]?: RestrictedComponentProps<FacetProps> } &
	{ [K in NamedThemeComponentSelectors<'facets', FacetsNames>]?: RestrictedComponentProps<FacetsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'facetsHorizontal'>]?: RestrictedComponentProps<FacetsHorizontalProps> } &
	{ [K in UnNamedThemeComponentSelectors<'filterSummary'>]?: RestrictedComponentProps<FilterSummaryProps> } &
	{ [K in UnNamedThemeComponentSelectors<'noResults'>]?: RestrictedComponentProps<NoResultsProps> } &
	{ [K in NamedThemeComponentSelectors<'results', ResultsNames>]?: RestrictedComponentProps<ResultsProps> } &
	{ [K in UnNamedThemeComponentSelectors<'searchHeader'>]?: RestrictedComponentProps<SearchHeaderProps> } &
	{ [K in UnNamedThemeComponentSelectors<'sidebar'>]?: RestrictedComponentProps<SidebarProps> } &
	{ [K in UnNamedThemeComponentSelectors<'mobileSidebar'>]?: RestrictedComponentProps<MobileSidebarProps> } &
	{ [K in NamedThemeComponentSelectors<'toolbar', ToolbarNames>]?: RestrictedComponentProps<ToolbarProps> } &

	/* TEMPLATES */
	{ [K in UnNamedThemeComponentSelectors<'autocomplete'>]?: RestrictedComponentProps<AutocompleteProps> } &
	// { [K in UnNamedThemeComponentSelectors<'autocompleteTerms'>]?: RestrictedComponentProps<AutocompleteTermsProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendation', string>]?: RestrictedComponentProps<RecommendationProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationBundle', string>]?: RestrictedComponentProps<RecommendationBundleProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationBundleEasyAdd', string>]?: RestrictedComponentProps<RecommendationBundleEasyAddProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationBundleList', string>]?: RestrictedComponentProps<RecommendationBundleListProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationBundleVertical', string>]?: RestrictedComponentProps<RecommendationBundleVerticalProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationGrid', string>]?: RestrictedComponentProps<RecommendationGridProps> } &
	{ [K in NamedThemeComponentSelectors<'recommendationEmail', string>]?: RestrictedComponentProps<RecommendationEmailProps> } & 
	{ [K in UnNamedThemeComponentSelectors<'search'>]?: RestrictedComponentProps<SearchProps> } &
	{ [K in UnNamedThemeComponentSelectors<'searchHorizontal'>]?: RestrictedComponentProps<SearchHorizontalProps> };
