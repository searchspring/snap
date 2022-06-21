/** @jsx jsx */
import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { FacetListOptions, FacetListOptionsProps } from '../../Molecules/FacetListOptions';
import { FacetGridOptions, FacetGridOptionsProps } from '../../Molecules/FacetGridOptions';
import { FacetPaletteOptions, FacetPaletteOptionsProps } from '../../Molecules/FacetPaletteOptions';
import { FacetHierarchyOptions, FacetHierarchyOptionsProps } from '../../Molecules/FacetHierarchyOptions';
import { FacetSlider, FacetSliderProps } from '../../Molecules/FacetSlider';
import { SearchInput, SearchInputProps } from '../../Molecules/SearchInput';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { ComponentProps, FacetDisplay, StylingCSS } from '../../../types';
import type { Facet as BaseFacet, ValueFacet, RangeFacet, HierarchyValue, Value, RangeValue } from '@searchspring/snap-store-mobx';

import { defined, cloneWithProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';

const CSS = {
	facet: ({ color, theme }: OptionalFacetProps) =>
		css({
			width: '100%',
			margin: '0 0 20px 0',
			'& .ss__facet__header': {
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				color: color,
				border: 'none',
				borderBottom: `2px solid ${theme?.colors?.primary || '#ccc'}`,
				padding: '6px 0',
			},
			'& .ss__facet__options': {
				marginTop: '8px',
				maxHeight: '300px',
				overflowY: 'auto',
				overflowX: 'hidden',
			},
			'& .ss__facet__show-more-less': {
				display: 'block',
				margin: '8px',
				cursor: 'pointer',
				'& .ss__icon': {
					marginRight: '8px',
				},
			},
			'& .ss__search-input': {
				margin: '16px 0 0 0',
			},
		}),
};

export const Facet = observer((properties: FacetProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	let props: FacetProps = {
		// default props
		limit: 12,
		disableOverflow: false,
		iconCollapse: 'angle-up',
		iconExpand: 'angle-down',
		showMoreText: 'Show More',
		showLessText: 'Show Less',
		iconOverflowMore: 'plus',
		iconOverflowLess: 'minus',
		searchable: false,
		// global theme
		...globalTheme?.components?.facet,
		// props
		...properties,
		...properties.theme?.components?.facet,
	};
	//manual props override on a per facet level using the fields prop
	if (props.fields && props.fields[props.facet?.field]) {
		props = {
			...props,
			...props.fields[props.facet?.field],
		};
	}

	const {
		disableCollapse,
		facet,
		iconCollapse,
		iconExpand,
		limit,
		disableOverflow,
		iconColor,
		color,
		previewOnFocus,
		valueProps,
		showMoreText,
		showLessText,
		iconOverflowMore,
		iconOverflowLess,
		overflowSlot,
		optionsSlot,
		disableStyles,
		className,
		style,
		searchable,
	} = props;

	const subProps: FacetSubProps = {
		dropdown: {
			// default props
			className: 'ss__facet__dropdown',
			disableClickOutside: true,
			disableOverlay: true,
			// global theme
			...globalTheme?.components?.dropdown,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		icon: {
			// default props
			className: 'ss__facet__dropdown__icon',
			size: '12px',
			color: iconColor || color,
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		showMoreLessIcon: {
			// default props
			className: 'ss__facet__show-more-less__icon',
			size: '10px',
			color: iconColor || color,
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		facetHierarchyOptions: {
			// default props
			className: 'ss__facet__facet-hierarchy-options',
			// global theme
			...globalTheme?.components?.facetHierarchyOptions,
			// inherited props
			...defined({
				disableStyles,
				previewOnFocus,
				valueProps,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		facetListOptions: {
			// default props
			className: 'ss__facet__facet-list-options',
			// global theme
			...globalTheme?.components?.facetListOptions,
			// inherited props
			...defined({
				disableStyles,
				previewOnFocus,
				valueProps,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		facetGridOptions: {
			// default props
			className: 'ss__facet__facet-grid-options',
			// global theme
			...globalTheme?.components?.facetGridOptions,
			// inherited props
			...defined({
				disableStyles,
				previewOnFocus,
				valueProps,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		facetPaletteOptions: {
			// default props
			className: 'ss__facet__facet-palette-options',
			// global theme
			...globalTheme?.components?.facetPaletteOptions,
			// inherited props
			...defined({
				disableStyles,
				previewOnFocus,
				valueProps,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		facetSlider: {
			// default props
			className: 'ss__facet__facet-slider',
			// global theme
			...globalTheme?.components?.facetSlider,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		searchInput: {
			// default props
			className: 'ss__facet__search-input',
			// global theme
			...globalTheme?.components?.searchInput,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	let limitedValues: Array<HierarchyValue | Value | RangeValue | undefined>;
	if ((facet as ValueFacet)?.overflow && limit && Number.isInteger(limit) && !disableOverflow) {
		(facet as ValueFacet).overflow?.setLimit(limit);
		limitedValues = (facet as ValueFacet)?.refinedValues;
	} else if ((facet as ValueFacet)?.overflow && Number.isInteger(limit)) {
		limitedValues = (facet as ValueFacet)?.values.slice(0, limit);
	} else {
		limitedValues = (facet as ValueFacet)?.values;
	}

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.facet({ color, theme }), style];
	} else if (style) {
		styling.css = [style];
	}

	// Search within facet
	const searchableFacet = {
		allowableTypes: ['list', 'grid', 'palette'],
		searchFilter: (e: React.ChangeEvent<HTMLInputElement>) => {
			if ((facet as ValueFacet)?.search) {
				(facet as ValueFacet).search.input = e.target.value;
			}
		},
	};

	return (
		facet && (
			<CacheProvider>
				<div {...styling} className={classnames('ss__facet', `ss__facet--${facet.display}`, `ss__facet--${facet.field}`, className)}>
					<Dropdown
						{...subProps.dropdown}
						open={disableCollapse || !facet?.collapsed}
						onClick={(e) => !disableCollapse && facet.toggleCollapse && facet?.toggleCollapse()}
						button={
							<div className="ss__facet__header">
								{facet?.label}
								{!disableCollapse && <Icon {...subProps.icon} icon={facet?.collapsed ? iconExpand : iconCollapse} />}
							</div>
						}
					>
						{searchable && searchableFacet.allowableTypes.includes(facet.display) && (
							<SearchInput {...subProps.searchInput} onChange={searchableFacet.searchFilter} placeholder={`Search ${facet.label}`} />
						)}
						<div className={classnames('ss__facet__options', className)}>
							{(() => {
								//manual options component
								if (optionsSlot) {
									return cloneWithProps(optionsSlot, { facet, valueProps, limit, previewOnFocus });
								} else {
									switch (facet?.display) {
										case FacetDisplay.SLIDER:
											return <FacetSlider {...subProps.facetSlider} facet={facet as RangeFacet} />;
										case FacetDisplay.GRID:
											return <FacetGridOptions {...subProps.facetGridOptions} values={limitedValues as Value[]} />;
										case FacetDisplay.PALETTE:
											return <FacetPaletteOptions {...subProps.facetPaletteOptions} values={limitedValues as Value[]} />;
										case FacetDisplay.HIERARCHY:
											return <FacetHierarchyOptions {...subProps.facetHierarchyOptions} values={limitedValues as HierarchyValue[]} />;
										default:
											return <FacetListOptions {...subProps.facetListOptions} values={limitedValues as Value[]} />;
									}
								}
							})()}
						</div>

						{!disableOverflow && (facet as ValueFacet)?.overflow?.enabled && (
							<div className="ss__facet__show-more-less" onClick={() => (facet as ValueFacet).overflow?.toggle()}>
								{overflowSlot ? (
									cloneWithProps(overflowSlot, { facet })
								) : (
									<>
										<Icon
											{...subProps.showMoreLessIcon}
											icon={((facet as ValueFacet).overflow?.remaining || 0) > 0 ? iconOverflowMore : iconOverflowLess}
										/>
										<span>{((facet as ValueFacet)?.overflow?.remaining || 0) > 0 ? showMoreText : showLessText}</span>
									</>
								)}
							</div>
						)}
					</Dropdown>
				</div>
			</CacheProvider>
		)
	);
});

interface FacetSubProps {
	dropdown: DropdownProps;
	facetListOptions: FacetListOptionsProps;
	facetGridOptions: FacetGridOptionsProps;
	facetPaletteOptions: FacetPaletteOptionsProps;
	facetHierarchyOptions: FacetHierarchyOptionsProps;
	facetSlider: FacetSliderProps;
	searchInput: SearchInputProps;
	icon: IconProps;
	showMoreLessIcon: IconProps;
}

export interface FacetProps extends OptionalFacetProps {
	facet: ValueFacet | RangeFacet | BaseFacet;
}

interface OptionalFacetProps extends ComponentProps {
	disableCollapse?: boolean;
	color?: string;
	iconCollapse?: IconType | string;
	iconColor?: string;
	iconExpand?: IconType | string;
	limit?: number;
	overflowSlot?: JSX.Element;
	optionsSlot?: JSX.Element;
	disableOverflow?: boolean;
	previewOnFocus?: boolean;
	valueProps?: any;
	showMoreText?: string;
	showLessText?: string;
	iconOverflowMore?: string;
	iconOverflowLess?: string;
	fields?: FieldProps;
	searchable?: boolean;
}

type FieldProps = {
	[variable: string]: FacetProps;
};
