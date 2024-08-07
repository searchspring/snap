// import type { BadgeImageLang } from '../components/Atoms/BadgeImage';
// import type { BadgePillLang } from '../components/Atoms/BadgePill';
// import type { BadgeRectangleLang } from '../components/Atoms/BadgeRectangle';
// import type { BadgeTextLang } from '../components/Atoms/BadgeText';
// import type { BreadcrumbsLang } from '../components/Atoms/Breadcrumbs';
import type { ButtonLang } from '../components/Atoms/Button';
// import type { DropdownLang } from '../components/Atoms/Dropdown';
// import type { FormattedNumberLang } from '../components/Atoms/FormattedNumber';
// import type { IconLang } from '../components/Atoms/Icon';
// import type { ImageLang } from '../components/Atoms/Image';
// import type { LoadingBarLang } from '../components/Atoms/Loading';
// import type { BannerLang, InlineBannerLang } from '../components/Atoms/Merchandising';
// import type { OverlayLang } from '../components/Atoms/Overlay';
// import type { PriceLang } from '../components/Atoms/Price';
// import type { SkeletonLang } from '../components/Atoms/Skeleton';
import type { TermsLang } from '../components/Atoms/Terms';
import type { ToggleLang } from '../components/Atoms/Toggle';
// import type { CalloutBadgeLang } from '../components/Molecules/CalloutBadge';
// import type { CarouselLang } from '../components/Molecules/Carousel';
import type { CheckboxLang } from '../components/Molecules/Checkbox';
import type { ErrorHandlerLang } from '../components/Molecules/ErrorHandler';
import type { FacetGridOptionsLang } from '../components/Molecules/FacetGridOptions';
import type { FacetHierarchyOptionsLang } from '../components/Molecules/FacetHierarchyOptions';
import type { FacetListOptionsLang } from '../components/Molecules/FacetListOptions';
import type { FacetPaletteOptionsLang } from '../components/Molecules/FacetPaletteOptions';
import type { FacetSliderLang } from '../components/Molecules/FacetSlider';
// import type { FacetToggleLang } from '../components/Molecules/FacetToggle';
import type { FilterLang } from '../components/Molecules/Filter';
import type { GridLang } from '../components/Molecules/Grid';
// import type { LayoutSelectorLang } from '../components/Molecules/LayoutSelector';
import type { ListLang } from '../components/Molecules/List';
import type { LoadMoreLang } from '../components/Molecules/LoadMore';
// import type { OverlayBadgeLang } from '../components/Molecules/OverlayBadge';
import type { PaginationLang } from '../components/Molecules/Pagination';
// import type { PerPageLang } from '../components/Molecules/PerPage';
import type { RadioLang } from '../components/Molecules/Radio';
import type { RadioListLang } from '../components/Molecules/RadioList';
// import type { RatingLang } from '../components/Molecules/Rating';
// import type { ResultLang } from '../components/Molecules/Result';
// import type { SearchInputLang } from '../components/Molecules/SearchInput';
import type { SelectLang } from '../components/Molecules/Select';
// import type { SlideoutLang } from '../components/Molecules/Slideout';
import type { SortByLang } from '../components/Molecules/SortBy';
// import type { SwatchesLang } from '../components/Molecules/Swatches';
// import type { VariantSelectionLang } from '../components/Molecules/VariantSelection';
import type { FacetLang } from '../components/Organisms/Facet';
import type { HorizontalFacetsLang } from '../components/Organisms/HorizontalFacets';
// import type { FacetsLang } from '../components/Organisms/Facets';
import type { FilterSummaryLang } from '../components/Organisms/FilterSummary';
import type { RecommendationBundleLang } from '../components/Organisms/RecommendationBundle';
// import type { ResultsLang } from '../components/Organisms/Results';
import type { SearchHeaderLang } from '../components/Atoms/SearchHeader';
import type { SidebarLang } from '../components/Organisms/Sidebar';
// import type { ToolbarLang } from '../components/Organisms/Toolbar';
import type { AutocompleteLang } from '../components/Templates/Autocomplete';
import type { RecommendationLang } from '../components/Templates/Recommendation';
import type { SearchLang } from '../components/Templates/Search';
// import type { HorizontalSearchLang } from '../components/Templates/HorizontalSearch';
import type { NoResultsLang } from '../components/Atoms/NoResults';
import type { MobileSidebarLang } from '../components/Organisms/MobileSidebar';

// type ComponentLang> = Partial<ComponentLang> & { named?: Partial<{ [named?: Partial<string]?: Partial<Partial<ComponentLang> } };

export type LangComponentOverrides = {
	/* ATOMS */
	// badgeImage?: Partial<BadgeImageLang>
	// badgePill?: Partial<BadgePillLang>
	// badgeRectangle?: Partial<BadgeRectangleLang>
	// badgeText?: Partial<BadgeTextLang>
	// breadcrumbs?: Partial<BreadcrumbsLang>
	button?: Partial<ButtonLang>;
	// dropdown?: Partial<DropdownLang>
	// formattedNumber?: Partial<FormattedNumberLang>
	// icon?: Partial<IconLang>
	// image?: Partial<ImageLang>
	// loadingBar?: Partial<LoadingBarLang>
	// banner?: Partial<BannerLang>
	// inlineBanner?: Partial<InlineBannerLang>
	// overlay?: Partial<OverlayLang>
	// price?: Partial<PriceLang>
	// skeleton?: Partial<SkeletonLang>
	// terms?: Partial<TermsLang>
	toggle?: Partial<ToggleLang>;

	/* MOLECULES */
	// calloutBadge?: Partial<CalloutBadgeLang>
	// carousel?: Partial<CarouselLang>
	checkbox?: Partial<CheckboxLang>;
	grid?: Partial<GridLang>;
	// layoutSelector?: Partial<LayoutSelectorLang>
	list?: Partial<ListLang>;
	radio?: Partial<RadioLang>;
	errorHandler?: Partial<ErrorHandlerLang>;
	facetGridOptions?: Partial<FacetGridOptionsLang>;
	facetHierarchyOptions?: Partial<FacetHierarchyOptionsLang>;
	facetListOptions?: Partial<FacetListOptionsLang>;
	facetPaletteOptions?: Partial<FacetPaletteOptionsLang>;
	facetSlider?: Partial<FacetSliderLang>;
	// facetToggle?: Partial<FacetToggleLang>
	filter?: Partial<FilterLang>;
	loadMore?: Partial<LoadMoreLang>;
	// overlayBadge?: Partial<OverlayBadgeLang>
	pagination?: Partial<PaginationLang>;
	// perPage?: Partial<PerPageLang>
	radioList?: Partial<RadioListLang>;
	// rating?: Partial<RatingLang>
	// result?: Partial<ResultLang>
	// searchInput?: Partial<SearchInputLang>
	select?: Partial<SelectLang>;
	// slideout?: Partial<SlideoutLang>;
	sortBy?: Partial<SortByLang>;
	// swatches?: Partial<SwatchesLang>
	// variantSelection?: Partial<VariantSelectionLang>

	/* ORGANISMS */
	facet?: Partial<FacetLang>;
	// facets?: Partial<FacetsLang>
	horizontalFacets?: Partial<HorizontalFacetsLang>;
	filterSummary?: Partial<FilterSummaryLang>;
	noResults?: Partial<NoResultsLang>;
	recommendationBundle?: Partial<RecommendationBundleLang>;
	// results?: Partial<ResultsLang>
	searchHeader?: Partial<SearchHeaderLang>;
	sidebar?: Partial<SidebarLang>;
	mobileSidebar?: Partial<MobileSidebarLang>;
	// toolbar?: Partial<ToolbarLang>
	/* TEMPLATES */
	autocomplete?: Partial<AutocompleteLang>;
	recommendation?: Partial<RecommendationLang>;
	search?: Partial<SearchLang>;
	// horizontalSearch?: Partial<HorizontalSearchLang>
};

export type LangComponents = {
	/* ATOMS */
	// badgeImage: BadgeImageLang
	// badgePill: BadgePillLang
	// badgeRectangle: BadgeRectangleLang
	// badgeText: BadgeTextLang
	// breadcrumbs: BreadcrumbsLang
	button: ButtonLang;
	// dropdown: DropdownLang
	// formattedNumber: FormattedNumberLang
	// icon: IconLang
	// image: ImageLang
	// loadingBar: LoadingBarLang
	// banner: BannerLang
	// inlineBanner: InlineBannerLang
	// overlay: OverlayLang
	// price: PriceLang
	// skeleton: SkeletonLang
	terms: TermsLang;
	toggle: ToggleLang;

	/* MOLECULES */
	// calloutBadge: CalloutBadgeLang
	// carousel: CarouselLang
	checkbox: CheckboxLang;
	grid: GridLang;
	// layoutSelector: LayoutSelectorLang
	list: ListLang;
	radio: RadioLang;
	errorHandler: ErrorHandlerLang;
	facetGridOptions: FacetGridOptionsLang;
	facetHierarchyOptions: FacetHierarchyOptionsLang;
	facetListOptions: FacetListOptionsLang;
	facetPaletteOptions: FacetPaletteOptionsLang;
	facetSlider: FacetSliderLang;
	// facetToggle: FacetToggleLang
	filter: FilterLang;
	loadMore: LoadMoreLang;
	// overlayBadge: OverlayBadgeLang
	pagination: PaginationLang;
	// perPage: PerPageLang
	radioList: RadioListLang;
	// rating: RatingLang
	// result: ResultLang
	// searchInput: SearchInputLang
	select: SelectLang;
	// slideout: SlideoutLang;
	sortBy: SortByLang;
	// swatches: SwatchesLang
	// variantSelection: VariantSelectionLang

	/* ORGANISMS */
	facet: FacetLang;
	// facets: FacetsLang
	horizontalFacets: HorizontalFacetsLang;
	filterSummary: FilterSummaryLang;
	noResults: NoResultsLang;
	recommendationBundle: RecommendationBundleLang;
	// results: ResultsLang
	searchHeader: SearchHeaderLang;
	sidebar: SidebarLang;
	mobileSidebar: MobileSidebarLang;
	// toolbar: ToolbarLang
	/* TEMPLATES */
	autocomplete: AutocompleteLang;
	recommendation: RecommendationLang;
	search: SearchLang;
	// horizontalSearch: HorizontalSearchLang
};
