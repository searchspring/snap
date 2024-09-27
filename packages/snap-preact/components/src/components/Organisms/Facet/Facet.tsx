import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { FacetListOptions, FacetListOptionsProps } from '../../Molecules/FacetListOptions';
import { FacetGridOptions, FacetGridOptionsProps } from '../../Molecules/FacetGridOptions';
import { FacetPaletteOptions, FacetPaletteOptionsProps } from '../../Molecules/FacetPaletteOptions';
import { FacetHierarchyOptions, FacetHierarchyOptionsProps } from '../../Molecules/FacetHierarchyOptions';
import { FacetSlider, FacetSliderProps } from '../../Molecules/FacetSlider';
import { SearchInput, SearchInputProps } from '../../Molecules/SearchInput';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { ComponentProps, FacetDisplay, RootNodeProperties } from '../../../types';
import type { ValueFacet, RangeFacet, FacetHierarchyValue, FacetValue, FacetRangeValue } from '@searchspring/snap-store-mobx';

import { defined, cloneWithProps, mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useA11y } from '../../../hooks/useA11y';
// import { FacetToggle, FacetToggleProps } from '../../Molecules/FacetToggle';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const CSS = {
	facet: ({ color, theme }: Partial<FacetProps>) =>
		css({
			width: '100%',
			margin: '0 0 20px 0',
			'& .ss__facet__header': {
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				color: color,
				border: 'none',
				borderBottom: `2px solid ${theme?.variables?.colors?.primary || '#ccc'}`,
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
	const defaultProps: Partial<FacetProps> = {
		limit: 12,
		disableOverflow: false,
		iconCollapse: 'angle-up',
		iconExpand: 'angle-down',
		showMoreText: 'Show More',
		showLessText: 'Show Less',
		iconOverflowMore: 'plus',
		iconOverflowLess: 'minus',
		searchable: false,
	};

	let props = mergeProps('facet', globalTheme, defaultProps, properties);

	//manual props override on a per facet display type level using the display prop
	if (props.display && props.display[props.facet?.display]) {
		props = {
			...props,
			...props.display[props.facet?.display],
		};
	}

	//manual props override on a per facet field type level using the fields prop
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
		justContent,
		horizontal,
		disableStyles,
		className,
		style,
		styleScript,
		treePath,
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
			treePath,
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
			treePath,
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
			treePath,
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
				horizontal: (properties as any)?.overlay ? false : horizontal, // overlay facets should not be horizontal
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
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
				horizontal: (properties as any)?.overlay ? false : horizontal, // overlay facets should not be horizontal
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
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
				horizontal,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
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
				horizontal,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		// facetToggle: {
		// 	// default props
		// 	className: 'ss__facet__facet-toggle',
		// 	// global theme
		// 	...globalTheme?.components?.facetToggle,
		// 	// inherited props
		// 	...defined({
		// 		disableStyles,
		// 	}),
		// 	// component theme overrides
		// 	theme: props?.theme,
		// 	treePath,
		// },
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
			treePath,
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
			treePath,
		},
	};

	let limitedValues: Array<FacetHierarchyValue | FacetValue | FacetRangeValue | undefined>;
	if ((facet as ValueFacet)?.overflow && limit && Number.isInteger(limit) && !disableOverflow) {
		(facet as ValueFacet).overflow?.setLimit(limit);
		limitedValues = (facet as ValueFacet)?.refinedValues;
	} else if ((facet as ValueFacet)?.overflow && Number.isInteger(limit)) {
		limitedValues = (facet as ValueFacet)?.values.slice(0, limit);
	} else {
		limitedValues = (facet as ValueFacet)?.values;
	}

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = { ...props, color };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.facet(stylingProps), style];
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

	let renderFacet = true;
	if (facet.display == FacetDisplay.TOGGLE && facet && (facet as ValueFacet)?.values.length !== 1) {
		renderFacet = false;
	}

	const facetContentProps = {
		limitedValues,
		searchableFacet,
		subProps,
		className,
		...props,
	};

	//initialize lang
	const defaultLang = {
		showMoreText: {
			value: facetContentProps.showMoreText,
		},
		showLessText: {
			value: facetContentProps.showLessText,
		},
		dropdownButton: {
			attributes: {
				'aria-label': `currently ${facet?.collapsed ? 'collapsed' : 'open'} ${facet.label} facet dropdown ${
					(facet as ValueFacet).values?.length ? (facet as ValueFacet).values?.length + ' options' : ''
				}`,
			},
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		facet,
	});
	facetContentProps.lang = mergedLang;

	if (justContent) {
		return <FacetContent {...facetContentProps}></FacetContent>;
	}

	return facet && renderFacet ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet', `ss__facet--${facet.display}`, `ss__facet--${facet.field}`, className)}>
				<Dropdown
					{...subProps.dropdown}
					open={disableCollapse || !facet?.collapsed}
					onClick={() => !disableCollapse && facet.toggleCollapse && facet?.toggleCollapse()}
					disableA11y={true}
					button={
						<div
							className="ss__facet__header"
							ref={(e) => useA11y(e, disableCollapse ? -1 : 0)}
							role="heading"
							aria-level={3}
							{...mergedLang.dropdownButton.attributes}
						>
							<span {...mergedLang.dropdownButton.value}>{facet?.label}</span>
							{!disableCollapse && (
								<Icon
									{...subProps.icon}
									{...(facet?.collapsed
										? { ...(typeof iconExpand == 'string' ? { icon: iconExpand } : (iconExpand as Partial<IconProps>)) }
										: { ...(typeof iconCollapse == 'string' ? { icon: iconCollapse } : (iconCollapse as Partial<IconProps>)) })}
									name={facet?.collapsed ? 'expand' : 'collapse'}
								/>
							)}
						</div>
					}
				>
					<FacetContent {...facetContentProps}></FacetContent>
				</Dropdown>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

const FacetContent = (props: any) => {
	const {
		searchableFacet,
		subProps,
		className,
		limitedValues,
		facet,
		limit,
		overflowSlot,
		optionsSlot,
		searchable,
		iconOverflowMore,
		iconOverflowLess,
		disableOverflow,
		previewOnFocus,
		valueProps,
		treePath,
		lang,
	} = props;

	return (
		<Fragment>
			{searchable && searchableFacet.allowableTypes.includes(facet.display) && (
				<SearchInput {...subProps.searchInput} onChange={searchableFacet.searchFilter} placeholder={`Search ${facet.label}`} />
			)}
			<div className={classnames('ss__facet__options', className)}>
				{(() => {
					//manual options component
					if (optionsSlot) {
						return cloneWithProps(optionsSlot, { facet, valueProps, limit, previewOnFocus, treePath });
					} else {
						switch (facet?.display) {
							// case FacetDisplay.TOGGLE:
							// 	return <FacetToggle {...subProps.facetToggle} facet={facet as ValueFacet} />;
							case FacetDisplay.SLIDER:
								return <FacetSlider {...subProps.facetSlider} facet={facet as RangeFacet} />;
							case FacetDisplay.GRID:
								return <FacetGridOptions {...subProps.facetGridOptions} values={limitedValues as FacetValue[]} facet={facet as ValueFacet} />;
							case FacetDisplay.PALETTE:
								return <FacetPaletteOptions {...subProps.facetPaletteOptions} values={limitedValues as FacetValue[]} facet={facet as ValueFacet} />;
							case FacetDisplay.HIERARCHY:
								return (
									<FacetHierarchyOptions
										{...subProps.facetHierarchyOptions}
										values={limitedValues as FacetHierarchyValue[]}
										facet={facet as ValueFacet}
									/>
								);
							default:
								return <FacetListOptions {...subProps.facetListOptions} values={limitedValues as FacetValue[]} facet={facet as ValueFacet} />;
						}
					}
				})()}
			</div>

			{!disableOverflow && (facet as ValueFacet)?.overflow?.enabled && (
				<div className="ss__facet__show-more-less" onClick={() => (facet as ValueFacet).overflow?.toggle()} ref={(e) => useA11y(e)}>
					{overflowSlot ? (
						cloneWithProps(overflowSlot, { facet, treePath })
					) : (
						<Fragment>
							<Icon
								{...subProps.showMoreLessIcon}
								{...(((facet as ValueFacet).overflow?.remaining || 0) > 0
									? { ...(typeof iconOverflowMore == 'string' ? { icon: iconOverflowMore } : (iconOverflowMore as Partial<IconProps>)) }
									: { ...(typeof iconOverflowLess == 'string' ? { icon: iconOverflowLess } : (iconOverflowLess as Partial<IconProps>)) })}
							/>
							<span {...(((facet as ValueFacet)?.overflow?.remaining || 0) > 0 ? lang.showMoreText?.all : lang.showLessText?.all)}></span>
						</Fragment>
					)}
				</div>
			)}
		</Fragment>
	);
};

interface FacetSubProps {
	dropdown: Partial<DropdownProps>;
	facetListOptions: Partial<FacetListOptionsProps>;
	facetGridOptions: Partial<FacetGridOptionsProps>;
	facetPaletteOptions: Partial<FacetPaletteOptionsProps>;
	facetHierarchyOptions: Partial<FacetHierarchyOptionsProps>;
	// facetToggle: Partial<FacetToggleProps>;
	facetSlider: Partial<FacetSliderProps>;
	searchInput: Partial<SearchInputProps>;
	icon: Partial<IconProps>;
	showMoreLessIcon: Partial<IconProps>;
}

export interface FacetProps extends OptionalFacetProps {
	facet: ValueFacet | RangeFacet;
}

interface OptionalFacetProps extends ComponentProps {
	disableCollapse?: boolean;
	color?: string;
	iconCollapse?: IconType | Partial<IconProps>;
	iconColor?: string;
	iconExpand?: IconType | Partial<IconProps>;
	limit?: number;
	overflowSlot?: JSX.Element | JSX.Element[];
	optionsSlot?: JSX.Element | JSX.Element[];
	disableOverflow?: boolean;
	previewOnFocus?: boolean;
	valueProps?: any;
	showMoreText?: string;
	showLessText?: string;
	iconOverflowMore?: IconType | Partial<IconProps>;
	iconOverflowLess?: IconType | Partial<IconProps>;
	fields?: FieldProps;
	display?: FieldProps;
	searchable?: boolean;
	justContent?: boolean;
	horizontal?: boolean;
	lang?: Partial<FacetLang>;
}

export interface FacetLang {
	showMoreText: Lang<{
		facet: ValueFacet | RangeFacet;
	}>;
	showLessText: Lang<{
		facet: ValueFacet | RangeFacet;
	}>;
	dropdownButton: Lang<{
		facet: ValueFacet | RangeFacet;
	}>;
}

type FieldProps = {
	[variable: string]: Omit<FacetProps, 'facet'>;
};
