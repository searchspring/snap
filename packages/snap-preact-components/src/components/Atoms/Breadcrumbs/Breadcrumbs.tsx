/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider, cache } from '../../../providers';

const CSS = {
	breadcrumbs: ({ style }) =>
		css({
			'& .ss__breadcrumbs__crumbs': {
				padding: '0',
			},
			'& .ss__breadcrumbs__crumbs__crumb, & .ss__breadcrumbs__crumbs__separator': {
				padding: '0 5px',
				display: 'inline-block',
			},
			...style,
		}),
};

export const Breadcrumbs = observer((properties: BreadcrumbProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BreadcrumbProps = {
		// default props
		separator: '>',
		// global theme
		...globalTheme?.components?.breadcrumbs,
		// props
		...properties,
		...properties.theme?.components?.breadcrumbs,
	};

	const { data, separator, disableStyles, className, style } = props;

	return (
		<CacheProvider value={cache}>
			<div css={!disableStyles && CSS.breadcrumbs({ style })} className={classnames('ss__breadcrumbs', className)}>
				<ul className="ss__breadcrumbs__crumbs">
					{data
						.map<React.ReactNode>((crumb) => (
							<li className="ss__breadcrumbs__crumbs__crumb">{crumb.url ? <a href={crumb.url}>{crumb.label}</a> : crumb.label}</li>
						))
						.reduce((prev, curr) => [prev, <li className="ss__breadcrumbs__crumbs__separator">{separator}</li>, curr])}
				</ul>
			</div>
		</CacheProvider>
	);
});

export interface BreadcrumbProps extends ComponentProps {
	data: {
		label: string;
		url?: string;
	}[];
	separator?: string | JSX.Element;
}
