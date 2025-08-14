import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';

const defaultStyles: StyleScript<BreadcrumbsProps> = () => {
	return css({
		'& .ss__breadcrumbs__crumbs': {
			padding: '0',
		},
		'& .ss__breadcrumbs__crumbs__crumb, & .ss__breadcrumbs__crumbs__separator': {
			padding: '0 5px',
			display: 'inline-block',
		},
	});
};

export const Breadcrumbs = observer((properties: BreadcrumbsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<BreadcrumbsProps> = {
		separator: '>',
		treePath: globalTreePath,
	};

	const props = mergeProps('breadcrumbs', globalTheme, defaultProps, properties);

	const { data, separator, className, internalClassName } = props;

	const styling = mergeStyles<BreadcrumbsProps>(props, defaultStyles);

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__breadcrumbs', className, internalClassName)}>
				<ul className="ss__breadcrumbs__crumbs">
					{data
						.map<React.ReactNode>((crumb: any) => (
							<li className="ss__breadcrumbs__crumbs__crumb">{crumb.url ? <a href={crumb.url}>{crumb.label}</a> : crumb.label}</li>
						))
						.reduce((prev: any, curr: any) => [prev, <li className="ss__breadcrumbs__crumbs__separator">{separator}</li>, curr])}
				</ul>
			</div>
		</CacheProvider>
	);
});

export interface BreadcrumbsProps extends ComponentProps<BreadcrumbsProps> {
	data: {
		label: string;
		url?: string;
	}[];
	separator?: string | JSX.Element;
}
