import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, RootNodeProperties } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';
import type { ValueFacet } from '@searchspring/snap-store-mobx';
import type { IndividualFacetType } from '../Facets/Facets';
import { MobileSidebar, MobileSidebarProps } from '../MobileSidebar';
import { Lang, useClickOutside, useLang } from '../../../hooks';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';

const CSS = {
	facets: ({ theme }: Partial<FacetsHorizontalProps>) =>
		css({
			'& .ss__facets-horizontal__header': {
				display: 'flex',
				flexWrap: 'wrap',

				'& .ss__mobile-sidebar': {
					margin: '0 10px',
				},

				'& .ss__facets-horizontal__header__dropdown': {
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
								fill: theme?.variables?.colors?.active?.accent,
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
			'&.ss__facets-horizontal--overlay': {
				'& .ss__facets-horizontal__header__dropdown': {
					'&.ss__dropdown--open': {
						'& .ss__dropdown__content': {
							border: `1px solid ${theme?.variables?.colors?.active?.background || '#ccc'}`,
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

export const FacetsHorizontal = observer((properties: FacetsHorizontalProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<FacetsHorizontalProps> = {
		limit: 6,
		iconCollapse: 'angle-up',
		iconExpand: 'angle-down',
		facets: properties.controller?.store?.facets,
	};

	let props = mergeProps('facetsHorizontal', globalTheme, defaultProps, properties);

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
		treePath,
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

	const subProps: FacetsHorizontalSubProps = {
		dropdown: {
			// default props
			className: 'ss__facets-horizontal__header__dropdown',
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
			treePath,
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
			treePath,
		},
		facet: {
			// default props
			className: `ss__facets-horizontal__content__facet`,
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
			treePath,
		},
		MobileSidebar: {
			// default props
			className: 'ss__facets-horizontal__header__mobile-sidebar',
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
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
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
				className={classnames('ss__facets-horizontal', { 'ss__facets-horizontal--overlay': overlay }, className)}
				ref={innerRef as React.LegacyRef<HTMLDivElement>}
				{...styling}
			>
				<div className="ss__facets-horizontal__header">
					{facetsToShow.map((facet: IndividualFacetType) => {
						//initialize lang
						const defaultLang = {
							dropdownButton: {
								attributes: {
									'aria-label': `currently ${selectedFacet?.field === facet.field ? 'collapsed' : 'open'} ${facet.field} facet dropdown ${
										(facet as ValueFacet).values?.length ? (facet as ValueFacet).values?.length + ' options' : ''
									}`,
								},
							},
						};

						//deep merge with props.lang
						const lang = deepmerge(defaultLang, props.lang || {});
						const mergedLang = useLang(lang as any, {
							selectedFacet,
							facet,
						});

						return (
							<Dropdown
								{...subProps.dropdown}
								className={classnames(
									subProps.dropdown.className,
									`ss__facets-horizontal__header__dropdown--${facet.display}`,
									`ss__facets-horizontal__header__dropdown--${facet.field}`
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
									<div className="ss__dropdown__button__heading" role="heading" aria-level={3} {...mergedLang.dropdownButton.attributes}>
										<span {...mergedLang.dropdownButton.value}>{facet?.label}</span>
										<Icon
											{...subProps.icon}
											// icon={selectedFacet?.field === facet.field ? iconExpand : iconCollapse}

											// {...(typeof icon == 'string' ? { icon: icon } : (icon as Partial<IconProps>))}

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
						);
					})}
					{(isOverflowing || alwaysShowFiltersButton) && <MobileSidebar controller={controller as any} {...subProps.MobileSidebar}></MobileSidebar>}
				</div>

				{!overlay && selectedFacet && (
					<div
						className={classnames(
							'ss__facets-horizontal__content',
							`ss__facets-horizontal__content--${selectedFacet.display}`,
							`ss__facets-horizontal__content--${selectedFacet.field}`
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

interface FacetsHorizontalSubProps {
	dropdown: Partial<DropdownProps>;
	icon: Partial<IconProps>;
	facet: Partial<FacetProps>;
	MobileSidebar: Partial<MobileSidebarProps>;
}

export interface FacetsHorizontalProps extends ComponentProps {
	facets?: IndividualFacetType[];
	limit?: number;
	overlay?: boolean;
	alwaysShowFiltersButton?: boolean;
	iconCollapse?: IconType | Partial<IconProps>;
	iconExpand?: IconType | Partial<IconProps>;
	controller?: SearchController | AutocompleteController;
	onFacetOptionClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
	lang?: Partial<FacetsHorizontalLang>;
}

export interface FacetsHorizontalLang {
	dropdownButton: Lang<{
		selectedFacet: IndividualFacetType;
		facet: IndividualFacetType;
	}>;
}
