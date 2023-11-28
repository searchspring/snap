import { BadgeProps } from '../components/Atoms/Badge';
import { BreadcrumbsProps } from '../components/Atoms/Breadcrumbs';
import { ButtonProps } from '../components/Atoms/Button';
import { DropdownProps } from '../components/Atoms/Dropdown';
import { ContainerProps } from '../components/Layouts/utils/Container';
import { FormattedNumberProps } from '../components/Atoms/FormattedNumber';
import { IconProps } from '../components/Atoms/Icon';
import { ImageProps } from '../components/Atoms/Image';
import { LoadingBarProps } from '../components/Atoms/Loading';
import { BannerProps, InlineBannerProps } from '../components/Atoms/Merchandising';
import { OverlayProps } from '../components/Atoms/Overlay';
import { PriceProps } from '../components/Atoms/Price';
import { SkeletonProps } from '../components/Atoms/Skeleton';
import { ElementProps } from '../components/Atoms/Element';
import { TermsProps } from '../components/Atoms/Terms';
import { ResultLayoutProps } from '../components/Layouts/ResultLayout';
import { CarouselProps } from '../components/Molecules/Carousel';
import { CheckboxProps } from '../components/Molecules/Checkbox';
import { ErrorHandlerProps } from '../components/Molecules/ErrorHandler';
import { FacetGridOptionsProps } from '../components/Molecules/FacetGridOptions';
import { FacetHierarchyOptionsProps } from '../components/Molecules/FacetHierarchyOptions';
import { FacetListOptionsProps } from '../components/Molecules/FacetListOptions';
import { FacetPaletteOptionsProps } from '../components/Molecules/FacetPaletteOptions';
import { FacetSliderProps } from '../components/Molecules/FacetSlider';
import { FilterProps } from '../components/Molecules/Filter';
import { PaginationProps } from '../components/Molecules/Pagination';
import { PerPageProps } from '../components/Molecules/PerPage';
import { RatingProps } from '../components/Molecules/Rating';
import { ResultProps } from '../components/Molecules/Result';
import { SearchInputProps } from '../components/Molecules/SearchInput';
import { SelectProps } from '../components/Molecules/Select';
import { SlideoutProps } from '../components/Molecules/Slideout';
import { SortByProps } from '../components/Molecules/SortBy';
import { BranchOverrideProps } from '../components/Organisms/BranchOverride';
import { FacetProps } from '../components/Organisms/Facet';
import { FacetsProps } from '../components/Organisms/Facets';
import { FilterSummaryProps } from '../components/Organisms/FilterSummary';
import { ResultsProps } from '../components/Organisms/Results';
import { SearchHeaderProps } from '../components/Atoms/SearchHeader';
import { SidebarProps } from '../components/Organisms/Sidebar';
import { ToolbarProps } from '../components/Organisms/Toolbar';
import { AutocompleteProps } from '../components/Templates/Autocomplete';
import { RecommendationProps } from '../components/Templates/Recommendation';
import { SearchProps } from '../components/Templates/Search';
import { NoResultsProps } from '../components/Atoms/NoResults';
import { MobileSidebarProps } from '../components/Organisms/MobileSidebar';
import { RadioListProps } from '../components/Molecules/RadioList';
import { ListProps } from '../components/Molecules/List';
import { RadioProps } from '../components/Molecules/Radio';
import { LayoutSelectorProps } from '../components/Molecules/LayoutSelector';

type GenericComponentProps<ComponentProps> = Partial<ComponentProps> & { named?: { [named: string]: Partial<ComponentProps> } };

export type ThemeComponents = {
	/* ATOMS */
	badge?: GenericComponentProps<BadgeProps>;
	breadcrumbs?: GenericComponentProps<BreadcrumbsProps>;
	button?: GenericComponentProps<ButtonProps>;
	dropdown?: GenericComponentProps<DropdownProps>;
	container?: GenericComponentProps<ContainerProps>;
	formattedNumber?: GenericComponentProps<FormattedNumberProps>;
	icon?: GenericComponentProps<IconProps>;
	image?: GenericComponentProps<ImageProps>;
	loadingBar?: GenericComponentProps<LoadingBarProps>;
	banner?: GenericComponentProps<BannerProps>;
	inlineBanner?: GenericComponentProps<InlineBannerProps>;
	overlay?: GenericComponentProps<OverlayProps>;
	price?: GenericComponentProps<PriceProps>;
	skeleton?: GenericComponentProps<SkeletonProps>;
	element?: GenericComponentProps<ElementProps>;
	terms?: GenericComponentProps<TermsProps>;

	/* MOLECULES */
	carousel?: GenericComponentProps<CarouselProps>;
	checkbox?: GenericComponentProps<CheckboxProps>;
	radio?: GenericComponentProps<RadioProps>;
	errorHandler?: GenericComponentProps<ErrorHandlerProps>;
	facetGridOptions?: GenericComponentProps<FacetGridOptionsProps>;
	facetHierarchyOptions?: GenericComponentProps<FacetHierarchyOptionsProps>;
	facetListOptions?: GenericComponentProps<FacetListOptionsProps>;
	facetPaletteOptions?: GenericComponentProps<FacetPaletteOptionsProps>;
	facetSlider?: GenericComponentProps<FacetSliderProps>;
	filter?: GenericComponentProps<FilterProps>;
	pagination?: GenericComponentProps<PaginationProps>;
	perPage?: GenericComponentProps<PerPageProps>;
	rating?: GenericComponentProps<RatingProps>;
	result?: GenericComponentProps<ResultProps>;
	searchInput?: GenericComponentProps<SearchInputProps>;
	select?: GenericComponentProps<SelectProps>;
	slideout?: GenericComponentProps<SlideoutProps>;
	sortBy?: GenericComponentProps<SortByProps>;
	radioList?: GenericComponentProps<RadioListProps>;
	list?: GenericComponentProps<ListProps>;
	layoutSelector?: GenericComponentProps<LayoutSelectorProps>;

	/* ORGANISMS */
	branchOverride?: GenericComponentProps<BranchOverrideProps>;
	facet?: GenericComponentProps<FacetProps>;
	facets?: GenericComponentProps<FacetsProps>;
	filterSummary?: GenericComponentProps<FilterSummaryProps>;
	noResults?: GenericComponentProps<NoResultsProps>;
	results?: GenericComponentProps<ResultsProps>;
	searchHeader?: GenericComponentProps<SearchHeaderProps>;
	sidebar?: GenericComponentProps<SidebarProps>;
	mobileSidebar?: GenericComponentProps<MobileSidebarProps>;
	toolbar?: GenericComponentProps<ToolbarProps>;
	/* LAYOUTS */
	resultLayout?: GenericComponentProps<ResultLayoutProps>;
	/* TEMPLATES */
	autocomplete?: GenericComponentProps<AutocompleteProps>;
	recommendation?: GenericComponentProps<RecommendationProps>;
	search?: GenericComponentProps<SearchProps>;
};

export type GlobalThemeVariables = {
	color?: {
		primary?: string; // (search header text, regular text, result title)
		secondary?: string; // (headings, dropdown button text)
		accent?: string; // (icons, borders)
		active?: {
			foreground?: string; // (active state text)
			background?: string; // (active state)
			accent?: string; // (icons, borders)
		};
		hover?: {
			foreground?: string; // (active state text)
			background?: string; // (active state)
			accent?: string; // (icons, borders)
		};
	};
};