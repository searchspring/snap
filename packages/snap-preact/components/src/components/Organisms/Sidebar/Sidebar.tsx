import { Fragment, h } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { SearchController } from '@searchspring/snap-controller';
import { Layout, LayoutProps } from '../Layout';
import deepmerge from 'deepmerge';
import { Lang, useLang } from '../../../hooks/useLang';

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
		layout: [['FilterSummary'], ['SortBy', 'PerPage'], ['Facets'], ['Banner.left']],
	};

	const props = mergeProps('sidebar', globalTheme, defaultProps, properties);

	const { controller, layout, hideTitleText, titleText, sticky, disableStyles, className, treePath } = props;

	const styling = mergeStyles<SidebarProps>(props, defaultStyles);

	//initialize lang
	const defaultLang = {
		titleText: {
			value: titleText,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		controller: controller,
	});

	const subProps: SidebarSubProps = {
		Layout: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
	};

	const hasChildrenToRender = layout?.length;
	return controller?.store?.loaded && controller?.store?.pagination?.totalResults > 0 && hasChildrenToRender ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__sidebar', className, { 'ss__sidebar--sticky': sticky })}>
				{!hideTitleText ? (
					<h4 className={classnames('ss__sidebar__title-text')} aria-atomic="true" aria-live="polite" {...mergedLang.titleText.all}>
						{titleText}
					</h4>
				) : (
					<></>
				)}

				<div className={classnames('ss__sidebar__inner')}>
					<Layout controller={controller} layout={layout} {...subProps.Layout} />
				</div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export type SideBarModuleNames = 'FilterSummary' | 'SortBy' | 'PerPage' | 'Facets' | 'Banner.left' | 'PaginationInfo' | 'LayoutSelector' | '_';

export interface SidebarProps extends ComponentProps {
	controller: SearchController;
	layout?: SideBarModuleNames[] | SideBarModuleNames[][];
	titleText?: string;
	hideTitleText?: boolean;
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
