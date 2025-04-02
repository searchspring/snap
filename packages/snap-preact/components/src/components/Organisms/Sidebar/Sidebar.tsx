import { Fragment, h } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { SearchController } from '@searchspring/snap-controller';
import { Lang } from '../../../hooks';
import { Layout, LayoutProps } from '../Layout';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<SidebarProps> = ({ stickyOffset }) => {
	return css({
		// need sticky styles using new sticky prop
		'&.ss__sidebar--sticky': {
			position: 'sticky',
			top: stickyOffset || 0,
		},

		'& .ss__facets': {
			width: '100%',
		},
	});
};

export const Sidebar = observer((properties: SidebarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<SidebarProps> = {
		titleText: 'Filters',
		treePath: globalTreePath,
		layout: [['Title'], ['FilterSummary'], ['SortBy', 'PerPage'], ['Facets'], ['Banner.left']],
	};

	const props = mergeProps('sidebar', globalTheme, defaultProps, properties);

	const { controller, layout, titleText, sticky, disableStyles, className, treePath } = props;

	const styling = mergeStyles<SidebarProps>(props, defaultStyles);

	//initialize lang
	const defaultLang = {
		titleText: {
			value: titleText,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});

	const subProps: SidebarSubProps = {
		Layout: {
			// default props
			lang: lang,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const hasChildrenToRender = layout?.length;
	return controller?.store?.loaded && controller?.store?.pagination?.totalResults > 0 && hasChildrenToRender ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__sidebar', className, { 'ss__sidebar--sticky': sticky })}>
				<div className={classnames('ss__sidebar__inner')}>
					<Layout {...subProps.Layout} controller={controller} layout={layout} />
				</div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export type SideBarModuleNames =
	| 'Title'
	| 'FilterSummary'
	| 'SortBy'
	| 'PerPage'
	| 'Facets'
	| 'Banner.left'
	| 'PaginationInfo'
	| 'LayoutSelector'
	| '_';

export interface SidebarProps extends ComponentProps {
	controller: SearchController;
	layout?: SideBarModuleNames[] | SideBarModuleNames[][];
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
	Layout: Partial<LayoutProps>;
}

export type SidebarNames = 'search' | 'mobile';
