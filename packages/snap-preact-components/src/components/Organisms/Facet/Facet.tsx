/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { FacetListOptions, FacetListOptionsProps } from '../../Molecules/FacetListOptions';
import { FacetGridOptions, FacetGridOptionsProps } from '../../Molecules/FacetGridOptions';
import { FacetPaletteOptions, FacetPaletteOptionsProps } from '../../Molecules/FacetPaletteOptions';
import { FacetHierarchyOptions, FacetHierarchyOptionsProps } from '../../Molecules/FacetHierarchyOptions';
import { FacetSlider, SliderProps } from '../../Molecules/FacetSlider';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { ComponentProps, FacetDisplay, ValueFacet, RangeFacet, RangeBucketFacet, BaseFacet, HierarchyFacet } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';

const CSS = {
	facet: ({ color, theme, style }) =>
		css({
			width: '100%',
			margin: '0 0 20px 0',
			'& .ss__facet__header': {
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				color: color,
				border: 'none',
				borderBottom: `2px solid ${theme.colors?.primary || '#ccc'}`,
				padding: '6px 0',
			},
			'& .ss__facet__options': {
				marginTop: '8px',
				minHeight: '70px',
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
			...style,
		}),
};

export const Facet = observer((properties: FacetProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: FacetProps = {
		// default props
		limit: 12,
		disableOverflow: false,
		iconCollapse: 'angle-up',
		iconExpand: 'angle-down',
		showMoreText: 'Show More',
		showLessText: 'Show Less',
		iconshowMoreExpand: 'plus',
		iconshowLessExpand: 'minus',
		// global theme
		...globalTheme?.components?.facet,
		// props
		...properties,
		...properties.theme?.components?.facet,
	};

	const {
		disableCollapse,
		facet,
		hideIcon,
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
		iconshowMoreExpand,
		iconshowLessExpand,
		disableStyles,
		className,
		style,
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
			...props.theme?.components?.dropdown,
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
			...props.theme?.components?.icon,
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
			...props.theme?.components?.icon,
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
			...props.theme?.components?.facetHierarchyOptions,
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
			...props.theme?.components?.facetListOptions,
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
			...props.theme?.components?.facetGridOptions,
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
			...props.theme?.components?.facetPaletteOptions,
		},
		slider: {
			// default props
			className: 'ss__facet__slider',
			// global theme
			...globalTheme?.components?.slider,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			...props.theme?.components?.slider,
		},
	};

	let limitedValues;
	if ((facet as ValueFacet)?.overflow && limit && !disableOverflow) {
		(facet as ValueFacet).overflow.setLimit(limit);
		limitedValues = (facet as ValueFacet)?.refinedValues;
	} else if ((facet as ValueFacet)?.overflow && limit) {
		limitedValues = (facet as ValueFacet)?.values.slice(0, limit);
	} else {
		limitedValues = (facet as ValueFacet)?.values;
	}

	return (
		<CacheProvider>
			<div
				css={!disableStyles && CSS.facet({ color, theme, style })}
				className={classnames('ss__facet', `ss__facet--${facet.display}`, `ss__facet--${facet.field}`, className)}
			>
				<Dropdown
					{...subProps.dropdown}
					open={disableCollapse || !facet?.collapsed}
					onClick={(e) => !disableCollapse && facet?.toggleCollapse()}
					button={
						<div className="ss__facet__header">
							{facet?.label}
							{!hideIcon && !disableCollapse && <Icon {...subProps.icon} icon={facet?.collapsed ? iconExpand : iconCollapse} />}
						</div>
					}
				>
					<div className={classnames('ss__facet__options', className)}>
						{(() => {
							switch (facet?.display) {
								case FacetDisplay.SLIDER:
									return <FacetSlider {...subProps.slider} facet={facet as RangeFacet} />;
								case FacetDisplay.GRID:
									return <FacetGridOptions {...subProps.facetGridOptions} values={limitedValues} />;
								case FacetDisplay.PALETTE:
									return <FacetPaletteOptions {...subProps.facetPaletteOptions} values={limitedValues} />;
								case FacetDisplay.HIERARCHY:
									return <FacetHierarchyOptions {...subProps.facetHierarchyOptions} values={limitedValues} />;
								default:
									return <FacetListOptions {...subProps.facetListOptions} values={limitedValues} />;
							}
						})()}
					</div>

					{!disableOverflow && (facet as ValueFacet)?.overflow && (facet as ValueFacet).overflow.enabled && (
						<div className="ss__facet__show-more-less" onClick={() => (facet as ValueFacet).overflow.toggle()}>
							<Icon {...subProps.showMoreLessIcon} icon={(facet as ValueFacet).overflow.remaining > 0 ? iconshowMoreExpand : iconshowLessExpand} />
							<span>{(facet as ValueFacet).overflow.remaining > 0 ? showMoreText : showLessText}</span>
						</div>
					)}
				</Dropdown>
			</div>
		</CacheProvider>
	);
});

interface FacetSubProps {
	dropdown: DropdownProps;
	facetListOptions: FacetListOptionsProps;
	facetGridOptions: FacetGridOptionsProps;
	facetPaletteOptions: FacetPaletteOptionsProps;
	facetHierarchyOptions: FacetHierarchyOptionsProps;
	slider: SliderProps;
	icon: IconProps;
	showMoreLessIcon: IconProps;
}

export interface FacetProps extends ComponentProps {
	disableCollapse?: boolean;
	facet: ValueFacet | RangeFacet | RangeBucketFacet | BaseFacet | HierarchyFacet;
	color?: string;
	iconCollapse?: IconType | string;
	iconColor?: string;
	iconExpand?: IconType | string;
	hideIcon?: boolean;
	limit?: number;
	disableOverflow?: boolean;
	previewOnFocus?: boolean;
	valueProps?: any;
	showMoreText?: string;
	showLessText?: string;
	iconshowMoreExpand?: string;
	iconshowLessExpand?: string;
}
