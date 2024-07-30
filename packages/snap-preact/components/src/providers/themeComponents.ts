import type { BadgeImageProps } from '../components/Atoms/BadgeImage';
import type { BadgePillProps } from '../components/Atoms/BadgePill';
import type { BadgeRectangleProps } from '../components/Atoms/BadgeRectangle';
import type { BadgeTextProps } from '../components/Atoms/BadgeText';
import type { BreadcrumbsProps } from '../components/Atoms/Breadcrumbs';
import type { ButtonProps } from '../components/Atoms/Button';
import type { DropdownProps } from '../components/Atoms/Dropdown';
import type { FormattedNumberProps } from '../components/Atoms/FormattedNumber';
import type { IconProps, IconNames } from '../components/Atoms/Icon';
import type { ImageProps } from '../components/Atoms/Image';
import type { LoadingBarProps } from '../components/Atoms/Loading';
import type { BannerProps, InlineBannerProps } from '../components/Atoms/Merchandising';
import type { OverlayProps } from '../components/Atoms/Overlay';
import type { PriceProps } from '../components/Atoms/Price';
import type { SkeletonProps } from '../components/Atoms/Skeleton';
import type { TermsProps } from '../components/Atoms/Terms';
import type { ToggleProps } from '../components/Atoms/Toggle';
import type { CalloutBadgeProps } from '../components/Molecules/CalloutBadge';
import type { CarouselProps } from '../components/Molecules/Carousel';
import type { CheckboxProps } from '../components/Molecules/Checkbox';
import type { ErrorHandlerProps } from '../components/Molecules/ErrorHandler';
import type { FacetGridOptionsProps } from '../components/Molecules/FacetGridOptions';
import type { FacetHierarchyOptionsProps } from '../components/Molecules/FacetHierarchyOptions';
import type { FacetListOptionsProps } from '../components/Molecules/FacetListOptions';
import type { FacetPaletteOptionsProps } from '../components/Molecules/FacetPaletteOptions';
import type { FacetSliderProps } from '../components/Molecules/FacetSlider';
import type { FacetToggleProps } from '../components/Molecules/FacetToggle';
import type { FilterProps } from '../components/Molecules/Filter';
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
import type { ResultProps } from '../components/Molecules/Result';
import type { SearchInputProps } from '../components/Molecules/SearchInput';
import type { SelectProps } from '../components/Molecules/Select';
import type { SlideoutProps } from '../components/Molecules/Slideout';
import type { SortByProps } from '../components/Molecules/SortBy';
import type { SwatchesProps } from '../components/Molecules/Swatches';
import type { VariantSelectionProps } from '../components/Molecules/VariantSelection';
import type { BranchOverrideProps } from '../components/Organisms/BranchOverride';
import type { FacetProps } from '../components/Organisms/Facet';
import type { HorizontalFacetsProps } from '../components/Organisms/HorizontalFacets';
import type { FacetsProps } from '../components/Organisms/Facets';
import type { FilterSummaryProps } from '../components/Organisms/FilterSummary';
import type { RecommendationBundleProps } from '../components/Organisms/RecommendationBundle';
import type { ResultsProps } from '../components/Organisms/Results';
import type { SearchHeaderProps } from '../components/Atoms/SearchHeader';
import type { SidebarProps } from '../components/Organisms/Sidebar';
import type { ToolbarProps, ToolbarNames } from '../components/Organisms/Toolbar';
import type { AutocompleteProps } from '../components/Templates/Autocomplete';
import type { RecommendationProps } from '../components/Templates/Recommendation';
import type { SearchProps } from '../components/Templates/Search';
import type { HorizontalSearchProps } from '../components/Templates/HorizontalSearch';
import type { NoResultsProps } from '../components/Atoms/NoResults';
import type { MobileSidebarProps } from '../components/Organisms/MobileSidebar';
import type { ComponentProps } from '../types';

type NamedThemeComponentSelectors<ComponentType extends string, ComponentNames extends string> =
	| ComponentType
	| `${string} ${ComponentType}`
	| `${string} ${ComponentType}.${ComponentNames}`
	| `${ComponentType}.${ComponentNames}`;

type UnNamedThemeComponentSelectors<ComponentType extends string> = ComponentType | `${string} ${ComponentType}`;

type GenericComponentProps<Props> = Partial<Props> & ComponentProps;

export type ThemeComponents = {
	/* ATOMS */
	[K in UnNamedThemeComponentSelectors<'badgeImage'>]?: GenericComponentProps<BadgeImageProps>;
} & { [K in UnNamedThemeComponentSelectors<'badgePill'>]?: GenericComponentProps<BadgePillProps> } & {
	[K in UnNamedThemeComponentSelectors<'badgeRectangle'>]?: GenericComponentProps<BadgeRectangleProps>;
} & { [K in UnNamedThemeComponentSelectors<'badgeText'>]?: GenericComponentProps<BadgeTextProps> } & {
	[K in UnNamedThemeComponentSelectors<'breadcrumbs'>]?: GenericComponentProps<BreadcrumbsProps>;
} & { [K in UnNamedThemeComponentSelectors<'button'>]?: GenericComponentProps<ButtonProps> } & {
	[K in UnNamedThemeComponentSelectors<'dropdown'>]?: GenericComponentProps<DropdownProps>;
} & { [K in UnNamedThemeComponentSelectors<'formattedNumber'>]?: GenericComponentProps<FormattedNumberProps> } & {
	[K in NamedThemeComponentSelectors<'icon', IconNames>]?: GenericComponentProps<IconProps>;
} & { [K in UnNamedThemeComponentSelectors<'image'>]?: GenericComponentProps<ImageProps> } & {
	[K in UnNamedThemeComponentSelectors<'loadingBar'>]?: GenericComponentProps<LoadingBarProps>;
} & { [K in UnNamedThemeComponentSelectors<'banner'>]?: GenericComponentProps<BannerProps> } & {
	[K in UnNamedThemeComponentSelectors<'inlineBanner'>]?: GenericComponentProps<InlineBannerProps>;
} & { [K in UnNamedThemeComponentSelectors<'overlay'>]?: GenericComponentProps<OverlayProps> } & {
	[K in UnNamedThemeComponentSelectors<'price'>]?: GenericComponentProps<PriceProps>;
} & { [K in UnNamedThemeComponentSelectors<'skeleton'>]?: GenericComponentProps<SkeletonProps> } & {
	[K in UnNamedThemeComponentSelectors<'terms'>]?: GenericComponentProps<TermsProps>;
} & { [K in UnNamedThemeComponentSelectors<'toggle'>]?: GenericComponentProps<ToggleProps> } & /* MOLECULES */
{ [K in UnNamedThemeComponentSelectors<'calloutBadge'>]?: GenericComponentProps<CalloutBadgeProps> } & {
	[K in UnNamedThemeComponentSelectors<'carousel'>]?: GenericComponentProps<CarouselProps>;
} & { [K in UnNamedThemeComponentSelectors<'checkbox'>]?: GenericComponentProps<CheckboxProps> } & {
	[K in UnNamedThemeComponentSelectors<'grid'>]?: GenericComponentProps<GridProps>;
} & { [K in UnNamedThemeComponentSelectors<'layoutSelector'>]?: GenericComponentProps<LayoutSelectorProps> } & {
	[K in UnNamedThemeComponentSelectors<'list'>]?: GenericComponentProps<ListProps>;
} & { [K in UnNamedThemeComponentSelectors<'radio'>]?: GenericComponentProps<RadioProps> } & {
	[K in UnNamedThemeComponentSelectors<'errorHandler'>]?: GenericComponentProps<ErrorHandlerProps>;
} & { [K in UnNamedThemeComponentSelectors<'facetGridOptions'>]?: GenericComponentProps<FacetGridOptionsProps> } & {
	[K in UnNamedThemeComponentSelectors<'facetHierarchyOptions'>]?: GenericComponentProps<FacetHierarchyOptionsProps>;
} & { [K in UnNamedThemeComponentSelectors<'facetListOptions'>]?: GenericComponentProps<FacetListOptionsProps> } & {
	[K in UnNamedThemeComponentSelectors<'facetPaletteOptions'>]?: GenericComponentProps<FacetPaletteOptionsProps>;
} & { [K in UnNamedThemeComponentSelectors<'facetSlider'>]?: GenericComponentProps<FacetSliderProps> } & {
	[K in UnNamedThemeComponentSelectors<'facetToggle'>]?: GenericComponentProps<FacetToggleProps>;
} & { [K in UnNamedThemeComponentSelectors<'filter'>]?: GenericComponentProps<FilterProps> } & {
	[K in UnNamedThemeComponentSelectors<'loadMore'>]?: GenericComponentProps<LoadMoreProps>;
} & { [K in UnNamedThemeComponentSelectors<'overlayBadge'>]?: GenericComponentProps<OverlayBadgeProps> } & {
	[K in UnNamedThemeComponentSelectors<'pagination'>]?: GenericComponentProps<PaginationProps>;
} & { [K in UnNamedThemeComponentSelectors<'perPage'>]?: GenericComponentProps<PerPageProps> } & {
	[K in UnNamedThemeComponentSelectors<'radioList'>]?: GenericComponentProps<RadioListProps>;
} & { [K in UnNamedThemeComponentSelectors<'rating'>]?: GenericComponentProps<RatingProps> } & {
	[K in UnNamedThemeComponentSelectors<'result'>]?: GenericComponentProps<ResultProps>;
} & { [K in UnNamedThemeComponentSelectors<'searchInput'>]?: GenericComponentProps<SearchInputProps> } & {
	[K in UnNamedThemeComponentSelectors<'select'>]?: GenericComponentProps<SelectProps>;
} & { [K in UnNamedThemeComponentSelectors<'slideout'>]?: GenericComponentProps<SlideoutProps> } & {
	[K in UnNamedThemeComponentSelectors<'sortBy'>]?: GenericComponentProps<SortByProps>;
} & { [K in UnNamedThemeComponentSelectors<'swatches'>]?: GenericComponentProps<SwatchesProps> } & {
	[K in UnNamedThemeComponentSelectors<'variantSelection'>]?: GenericComponentProps<VariantSelectionProps>;
} & /* ORGANISMS */
{ [K in UnNamedThemeComponentSelectors<'branchOverride'>]?: GenericComponentProps<BranchOverrideProps> } & {
	[K in UnNamedThemeComponentSelectors<'facet'>]?: GenericComponentProps<FacetProps>;
} & { [K in UnNamedThemeComponentSelectors<'facets'>]?: GenericComponentProps<FacetsProps> } & {
	[K in UnNamedThemeComponentSelectors<'horizontalFacets'>]?: GenericComponentProps<HorizontalFacetsProps>;
} & { [K in UnNamedThemeComponentSelectors<'filterSummary'>]?: GenericComponentProps<FilterSummaryProps> } & {
	[K in UnNamedThemeComponentSelectors<'noResults'>]?: GenericComponentProps<NoResultsProps>;
} & { [K in UnNamedThemeComponentSelectors<'recommendationBundle'>]?: GenericComponentProps<RecommendationBundleProps> } & {
	[K in UnNamedThemeComponentSelectors<'results'>]?: GenericComponentProps<ResultsProps>;
} & { [K in UnNamedThemeComponentSelectors<'searchHeader'>]?: GenericComponentProps<SearchHeaderProps> } & {
	[K in UnNamedThemeComponentSelectors<'sidebar'>]?: GenericComponentProps<SidebarProps>;
} & { [K in UnNamedThemeComponentSelectors<'mobileSidebar'>]?: GenericComponentProps<MobileSidebarProps> } & {
	[K in NamedThemeComponentSelectors<'toolbar', ToolbarNames>]?: GenericComponentProps<ToolbarProps>;
} & /* TEMPLATES */
{ [K in UnNamedThemeComponentSelectors<'autocomplete'>]?: GenericComponentProps<AutocompleteProps> } & {
	[K in UnNamedThemeComponentSelectors<'recommendation'>]?: GenericComponentProps<RecommendationProps>;
} & { [K in UnNamedThemeComponentSelectors<'search'>]?: GenericComponentProps<SearchProps> } & {
	[K in UnNamedThemeComponentSelectors<'horizontalSearch'>]?: GenericComponentProps<HorizontalSearchProps>;
};
