import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';
import type { ValueFacet } from '@searchspring/snap-store-mobx';
import type { IndividualFacetType } from '../Facets/Facets';
import { MobileSidebar, MobileSidebarProps } from '../MobileSidebar';
import { Lang, useA11y, useClickOutside, useLang } from '../../../hooks';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { useEffect } from 'react';

const defaultStyles: StyleScript<FacetsHorizontalProps> = ({}) => {
	return css({
		margin: '10px 0px',

		'& .ss__facets-horizontal__header': {
			display: 'flex',
			flexWrap: 'wrap',
			gap: '10px',

			'& .ss__mobile-sidebar': {
				margin: '0 10px',
			},

			'& .ss__facets-horizontal__header__dropdown': {
				margin: '0 0 10px 0',
				'.ss__dropdown__button': {
					display: 'flex',
				},

				'& .ss__dropdown__button__heading': {
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '5px 10px',
					flexShrink: '0',
					gap: '10px',
				},

				'&.ss__dropdown--open': {
					'& .ss__dropdown__button__heading': {
						'& .ss__icon': {},
					},
					'& .ss__dropdown__content': {
						padding: '10px',
						minWidth: '160px',
						width: 'max-content',
						maxHeight: '500px',
						overflowY: 'auto',
						zIndex: 1000,
					},
				},
			},
		},
		'&.ss__facets-horizontal--overlay': {
			'& .ss__facets-horizontal__header__dropdown': {
				'&.ss__dropdown--open': {
					'& .ss__dropdown__content': {},
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
	});
};

export const FacetsHorizontal = observer((properties: FacetsHorizontalProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<FacetsHorizontalProps> = {
		limit: 6,
		overlay: true,
		iconCollapse: 'angle-up',
		iconExpand: 'angle-down',
		facets: properties.controller?.store?.facets,
		treePath: globalTreePath,
	};

	let props = mergeProps('facetsHorizontal', globalTheme, defaultProps, properties);

	const {
		facets,
		limit,
		overlay,
		alwaysShowFiltersButton,
		hideFiltersButton,
		onFacetOptionClick,
		iconExpand,
		iconCollapse,
		disableStyles,
		className,
		internalClassName,
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

	// merge deeply the themeDefaults with the theme prop
	const theme = deepmerge(themeDefaults, props?.theme || {});

	props = {
		...props,
		theme,
	};

	let facetsToShow = facets;
	let isOverflowing = false;

	if (typeof limit != 'undefined' && Number.isInteger(limit) && facets) {
		isOverflowing = facets.length > +limit;
		if (limit > 0) {
			facetsToShow = facets.slice(0, +limit);
		} else if (limit == 0) {
			facetsToShow = [];
		}
	}

	const subProps: FacetsHorizontalSubProps = {
		dropdown: {
			// default props
			internalClassName: 'ss__facets-horizontal__header__dropdown',
			disableClickOutside: true,
			disableOverlay: true,
			focusTrapContent: true,
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
			internalClassName: 'ss__dropdown__button__heading__icon',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath: `${treePath} dropdown button`,
		},
		facet: {
			// default props
			internalClassName: `ss__facets-horizontal__content__facet`,
			justContent: true,
			// horizontal: true,
			// inherited props
			...defined({
				disableStyles,
				overlay,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath: overlay ? `${treePath} dropdown` : treePath,
		},
		MobileSidebar: {
			// default props
			internalClassName: 'ss__facets-horizontal__header__mobile-sidebar',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<FacetsHorizontalProps>(props, defaultStyles);

	const [selectedFacet, setSelectedFacet] = useState<IndividualFacetType | undefined>(undefined);

	const innerRef = useClickOutside(() => {
		selectedFacet && setSelectedFacet(undefined);
	});

	let contentRef: any;
	useEffect(() => {
		!overlay && contentRef?.focus();
	}, [selectedFacet]);

	//todo investigate keyboard navigation here when overlay prop is true/false
	return (facetsToShow && facetsToShow?.length > 0) || isOverflowing ? (
		<CacheProvider>
			<div
				className={classnames('ss__facets-horizontal', { 'ss__facets-horizontal--overlay': overlay }, className, internalClassName)}
				ref={innerRef as React.LegacyRef<HTMLDivElement>}
				{...styling}
			>
				<div className="ss__facets-horizontal__header">
					{facetsToShow?.map((facet: IndividualFacetType) => {
						//initialize lang
						const defaultLang = {
							dropdownButton: {
								attributes: {
									'aria-label': `currently ${selectedFacet?.field === facet.field ? 'open' : 'collapsed'} ${facet.field} facet dropdown ${
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
								internalClassName={classnames(
									subProps.dropdown.internalClassName,
									`ss__facets-horizontal__header__dropdown--${facet.display}`,
									`ss__facets-horizontal__header__dropdown--${facet.field}`
								)}
								open={selectedFacet?.field === facet.field}
								onClick={(e) => {
									// @ts-ignore - this is a workaround for the fact that selectedFacet is not defined when the onclick is triggered by the escape key.
									if (selectedFacet !== facet && e.code !== 'Escape') {
										setSelectedFacet(facet);
									} else {
										setSelectedFacet(undefined);
									}
								}}
								button={
									<div className="ss__dropdown__button__heading" {...mergedLang.dropdownButton.attributes}>
										<span {...mergedLang.dropdownButton.value}>{facet?.label}</span>
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
						);
					})}
					{!hideFiltersButton && (isOverflowing || alwaysShowFiltersButton) && (
						<MobileSidebar controller={controller as any} {...subProps.MobileSidebar}></MobileSidebar>
					)}
				</div>

				{!overlay && selectedFacet && (
					<div
						ref={(e) => {
							useA11y(e, 0, true, () => {
								setSelectedFacet(undefined);
								setTimeout(() => {
									(innerRef.current?.querySelector('.ss__dropdown__button__heading') as HTMLElement)?.focus();
								});
							});
							contentRef = e;
						}}
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
	hideFiltersButton?: boolean;
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
