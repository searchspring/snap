import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';
import type { ValueFacet } from '@searchspring/snap-store-mobx';
import type { IndividualFacetType } from '../Facets/Facets';
import { MobileSidebar, MobileSidebarProps } from '../MobileSidebar';
import { useClickOutside } from '../../../hooks';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';

const CSS = {
	facets: ({ theme }: Partial<HorizontalFacetsProps>) =>
		css({
			'& .ss__horizontal-facets__header': {
				display: 'flex',
				flexWrap: 'wrap',

				'& .ss__mobile-sidebar': {
					margin: '0 10px',
				},

				'& .ss__horizontal-facets__header__dropdown': {
					flex: '0 0 0%',
					margin: '0 0 10px 0',
					boxSizing: 'border-box',
					minWidth: '100px',

					'& .ss__dropdown__button__heading': {
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: '5px 10px',
					},

					'&.ss__dropdown--open': {
						'& .ss__dropdown__button__heading': {
							'& .ss__icon': {
								fill: theme?.variables?.color?.active?.accent,
							},
						},
						'& .ss__dropdown__content': {
							padding: '10px',
							minWidth: '160px',
							width: 'max-content',
							maxHeight: '500px',
							overflowY: 'auto',
							zIndex: 1,
						},
					},
				},
			},
			'&.ss__horizontal-facets--overlay': {
				'& .ss__horizontal-facets__header__dropdown': {
					'&.ss__dropdown--open': {
						'& .ss__dropdown__content': {
							border: `1px solid ${theme?.variables?.color?.active?.background || '#ccc'}`,
						},
					},
				},
			},
			'& .ss__facet__show-more-less': {
				display: 'block',
				margin: '8px 8px 0 8px',
				cursor: 'pointer',
				'& .ss__icon': {
					marginRight: '8px',
				},
			},
		}),
};

export const HorizontalFacets = observer((properties: HorizontalFacetsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<HorizontalFacetsProps> = {
		limit: 6,
		iconCollapse: 'angle-up',
		iconExpand: 'angle-down',
		facets: properties.controller?.store?.facets,
	};

	let props = mergeProps('horizontalFacets', globalTheme, defaultProps, properties);

	const {
		facets,
		limit,
		overlay,
		alwaysShowFiltersButton,
		onFacetOptionClick,
		iconExpand,
		iconCollapse,
		disableStyles,
		className,
		style,
		styleScript,
		controller,
	} = props;

	const facetClickEvent = (e: React.MouseEvent<Element, MouseEvent>) => {
		onFacetOptionClick && onFacetOptionClick(e);
	};

	const themeDefaults: Theme = {
		components: {
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

	// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)
	const theme = deepmerge(themeDefaults, props?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	props = {
		...props,
		theme,
	};

	let facetsToShow = facets;
	let isOverflowing = false;

	if (limit && facets && limit > 0) {
		isOverflowing = facets.length > +limit;
		facetsToShow = facets.slice(0, +limit);
	}

	const subProps: HorizontalFacetsSubProps = {
		dropdown: {
			// default props
			className: 'ss__horizontal-facets__header__dropdown',
			disableClickOutside: true,
			disableOverlay: true,
			disableA11y: true,
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
			className: 'ss__dropdown__button__heading__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		facet: {
			// default props
			className: `ss__horizontal-facets__content__facet`,
			justContent: true,
			horizontal: true,
			// global theme
			...globalTheme?.components?.facet,
			// inherited props
			...defined({
				disableStyles,
				overlay,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		MobileSidebar: {
			// default props
			className: 'ss__horizontal-facets__header__mobile-sidebar',
			hidePerPage: true,
			hideSortBy: true,
			// global theme
			...globalTheme?.components?.mobileSidebar,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.facets(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const [selectedFacet, setSelectedFacet] = useState<IndividualFacetType | undefined>(undefined);

	const innerRef = useClickOutside(() => {
		selectedFacet && setSelectedFacet(undefined);
	});

	return facetsToShow && facetsToShow?.length > 0 ? (
		<CacheProvider>
			<div
				className={classnames('ss__horizontal-facets', { 'ss__horizontal-facets--overlay': overlay }, className)}
				ref={innerRef as React.LegacyRef<HTMLDivElement>}
				{...styling}
			>
				<div className="ss__horizontal-facets__header">
					{facetsToShow.map((facet: IndividualFacetType) => (
						<Dropdown
							{...subProps.dropdown}
							className={classnames(
								subProps.dropdown.className,
								`ss__horizontal-facets__header__dropdown--${facet.display}`,
								`ss__horizontal-facets__header__dropdown--${facet.field}`
							)}
							open={selectedFacet?.field === facet.field}
							onClick={() => {
								if (selectedFacet === facet) {
									setSelectedFacet(undefined);
									return;
								}
								setSelectedFacet(facet);
							}}
							button={
								<div
									className="ss__dropdown__button__heading"
									role="heading"
									aria-level={3}
									aria-label={`currently ${selectedFacet?.field === facet.field ? 'collapsed' : 'open'} ${facet.field} facet dropdown ${
										(facet as ValueFacet).values?.length ? (facet as ValueFacet).values?.length + ' options' : ''
									}`}
								>
									{facet?.label}
									<Icon
										{...subProps.icon}
										{...(selectedFacet?.field === facet.field
											? { ...(typeof iconExpand == 'string' ? { icon: iconExpand } : (iconExpand as Partial<IconProps>)) }
											: { ...(typeof iconCollapse == 'string' ? { icon: iconCollapse } : (iconCollapse as Partial<IconProps>)) })}
									/>
								</div>
							}
							disableOverlay={!overlay}
						>
							{overlay ? <Facet {...subProps.facet} facet={facet} /> : undefined}
						</Dropdown>
					))}
					{(isOverflowing || alwaysShowFiltersButton) && <MobileSidebar controller={controller as any} {...subProps.MobileSidebar}></MobileSidebar>}
				</div>

				{!overlay && selectedFacet && (
					<div
						className={classnames(
							'ss__horizontal-facets__content',
							`ss__horizontal-facets__content--${selectedFacet.display}`,
							`ss__horizontal-facets__content--${selectedFacet.field}`
						)}
					>
						<Facet {...subProps.facet} facet={facets?.find((facet) => facet.field === selectedFacet.field)!} />
					</div>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface HorizontalFacetsSubProps {
	dropdown: Partial<DropdownProps>;
	icon: Partial<IconProps>;
	facet: Partial<FacetProps>;
	MobileSidebar: Partial<MobileSidebarProps>;
}

export interface HorizontalFacetsProps extends ComponentProps {
	facets?: IndividualFacetType[];
	limit?: number;
	overlay?: boolean;
	alwaysShowFiltersButton?: boolean;
	iconCollapse?: IconType | Partial<IconProps>;
	iconExpand?: IconType | Partial<IconProps>;
	controller?: SearchController | AutocompleteController;
	onFacetOptionClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}
