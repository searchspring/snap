import { Fragment, h } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, useTreePath, useSnap } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { SortBy, SortByProps } from '../../Molecules/SortBy';
import { PerPage, PerPageProps } from '../../Molecules/PerPage';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Facets, FacetsProps } from '../Facets';
import { SearchController } from '@searchspring/snap-controller';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';
import { PaginationInfo, PaginationInfoProps } from '../../Atoms/PaginationInfo';
import { BannerProps } from '../../Atoms/Merchandising';
import { LayoutSelector, LayoutSelectorProps } from '../../Molecules/LayoutSelector';
import { SnapTemplates } from '../../../../../src';

const defaultStyles: StyleScript<SidebarProps> = ({ stickyOffset }) => {
	return css({
		// need sticky styles using new sticky prop
		'&.ss__sidebar--sticky': {
			position: 'sticky',
			top: stickyOffset || 0,
		},
	});
};

export const Sidebar = observer((properties: SidebarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const snap = useSnap() as SnapTemplates;
	const themeStore = snap?.templates?.getThemeStore(globalTheme.name);

	const defaultProps: Partial<SidebarProps> = {
		titleText: 'Filters',
		treePath: globalTreePath,
		layout: ['Title', 'Facets', 'Banner.left'],
	};

	const props = mergeProps('sidebar', globalTheme, defaultProps, properties);

	const { controller, layout, titleText, sticky, disableStyles, className, treePath } = props;

	const styling = mergeStyles<SidebarProps>(props, defaultStyles);

	const subProps: SidebarSubProps = {
		LayoutSelector: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		PaginationInfo: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		Banner: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		FilterSummary: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		Facets: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		SortBy: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		PerPage: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	//initialize lang
	const defaultLang: Partial<SidebarLang> = {
		titleText: {
			value: titleText,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, { controller: controller });

	function renderModule(module: ModuleNames) {
		switch (module) {
			case 'Title':
				return <h4 className="ss__sidebar__title" {...mergedLang.titleText?.all}></h4>;

			case 'FilterSummary':
				return <FilterSummary {...subProps.FilterSummary} />;

			case 'Facets':
				return <Facets {...subProps.Facets} />;

			case 'LayoutSelector':
				if (themeStore && props.theme?.layoutOptions && props.theme.layoutOptions.length > 0) {
					return (
						<LayoutSelector
							onSelect={(e, option) => {
								if (option) {
									themeStore?.layout.select(option);
								}
							}}
							selected={themeStore?.layout.selected}
							options={props.theme?.layoutOptions}
							{...subProps.LayoutSelector}
						/>
					);
				}
				break;

			case 'PaginationInfo':
				return <PaginationInfo {...subProps.PaginationInfo} />;

			case 'SortBy':
				return <SortBy {...subProps.SortBy} />;

			case 'PerPage':
				return <PerPage {...subProps.PerPage} />;

			// case 'Button.toggleSideBar':
			// 	return toggleSideBarButton && <Button {...subProps.Button}>{cloneWithProps(toggleSideBarButton)}</Button>;

			case '_':
				return <div className={`ss__toolbar__separator ss__toolbar__separator--${separatorIndex++}`} />;

			default:
				return null;
		}
	}

	const hasChildrenToRender = layout?.length;

	let rowIndex = 0;
	let separatorIndex = 0;

	return controller?.store?.loaded && controller?.store?.pagination?.totalResults > 0 && hasChildrenToRender ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__sidebar', className, { 'ss__sidebar--sticky': sticky })}>
				<div className={classnames('ss__sidebar__inner')}>
					{layout?.map((module) => {
						if (Array.isArray(module)) {
							return (
								<div className={`ss__toolbar__group ss__toolbar__group--${rowIndex++}`}>
									{module.map((subModule) => {
										return renderModule(subModule);
									})}
								</div>
							);
						} else {
							return renderModule(module);
						}
					})}
				</div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

type ModuleNames = 'Title' | 'FilterSummary' | 'SortBy' | 'PerPage' | 'Facets' | 'Banner.left' | 'PaginationInfo' | 'LayoutSelector' | '_';

export interface SidebarProps extends ComponentProps {
	controller: SearchController;
	layout: ModuleNames[] | ModuleNames[][];
	titleText?: string;
	sticky?: boolean;
	stickyOffset?: number;
	lang?: Partial<SidebarLang>;
}

export interface SidebarLang {
	titleText: Lang<{
		controller: SearchController;
	}>;
}

interface SidebarSubProps {
	FilterSummary: Partial<FilterSummaryProps>;
	Facets: Partial<FacetsProps>;
	SortBy: Partial<SortByProps>;
	PerPage: Partial<PerPageProps>;
	Banner: Partial<BannerProps>;
	PaginationInfo: Partial<PaginationInfoProps>;
	LayoutSelector: Partial<LayoutSelectorProps>;
}

export type SidebarNames = 'search' | 'mobile';
