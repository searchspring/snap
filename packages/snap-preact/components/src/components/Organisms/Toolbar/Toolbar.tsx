import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { SearchController } from '@searchspring/snap-controller';
import { Layout, LayoutProps } from '../Layout';

const defaultStyles: StyleScript<ToolbarProps> = ({}) => {
	return css({});
};

export const Toolbar = observer((properties: ToolbarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<ToolbarProps> = {
		treePath: globalTreePath,
		layout: ['MobileSidebar', 'FilterSummary', 'PaginationInfo', 'SortBy', 'PerPage', 'Pagination'],
	};

	const props = mergeProps('toolbar', globalTheme, defaultProps, properties);
	const { controller, toggleSideBarButton, disableStyles, className, treePath, layout } = props;

	const styling = mergeStyles<ToolbarProps>(props, defaultStyles);

	const subProps: ToolbarSubProps = {
		Layout: {
			// default props
			toggleSideBarButton,
			className: 'ss__toolbar__layout',
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

	return hasChildrenToRender ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__toolbar', className)}>
				<Layout controller={controller} layout={layout} {...subProps.Layout} />
			</div>
		</CacheProvider>
	) : (
		<></>
	);
});

export interface ToolbarProps extends ComponentProps {
	controller: SearchController;
	name?: ToolbarNames;
	layout?: (ModuleNames | ModuleNames[])[];
	toggleSideBarButton?: React.FunctionComponent;
}

export type ModuleNames =
	| 'SearchHeader'
	| 'FilterSummary'
	| 'MobileSidebar'
	| 'LayoutSelector'
	| 'PerPage'
	| 'SortBy'
	| 'Pagination'
	| 'PaginationInfo'
	| '_'
	| 'Button.sidebar-toggle'
	| 'Banner.header'
	| 'Banner.banner'
	| 'Banner.footer';

export type ToolbarNames = 'top' | 'middle' | 'bottom';

interface ToolbarSubProps {
	Layout: Partial<LayoutProps>;
}
