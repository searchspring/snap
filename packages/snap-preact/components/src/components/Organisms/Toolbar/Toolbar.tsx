import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { SearchController } from '@searchspring/snap-controller';
import { Layout, LayoutProps } from '../Layout';
import { ButtonProps } from '../../Atoms/Button';

const defaultStyles: StyleScript<ToolbarProps> = ({}) => {
	return css({});
};

export const Toolbar = observer((properties: ToolbarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<ToolbarProps> = {
		treePath: globalTreePath,
		layout: ['mobileSidebar', 'filterSummary', 'paginationInfo', 'sortBy', 'perPage', 'pagination'],
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
	toggleSideBarButton?: Partial<ButtonProps>;
}

export type ModuleNames =
	| 'searchHeader'
	| 'filterSummary'
	| 'mobileSidebar'
	| 'layoutSelector'
	| 'perPage'
	| 'sortBy'
	| 'pagination'
	| 'paginationInfo'
	| 'breadcrumbs'
	| '_'
	| 'button.sidebar-toggle'
	| 'banner.header'
	| 'banner.banner'
	| 'banner.footer'
	| 'facetsHorizontal';

export type ToolbarNames = 'top' | 'middle' | 'bottom';

interface ToolbarSubProps {
	Layout: Partial<LayoutProps>;
}
