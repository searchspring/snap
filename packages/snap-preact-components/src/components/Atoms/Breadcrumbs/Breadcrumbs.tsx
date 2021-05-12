/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps } from '../../../types';
import { Theme, useTheme } from '../../../providers/theme';

const CSS = {
	breadcrumbs: ({ style }) =>
		css({
			'& .ss-breadcrumbs__crumbs': {
				padding: '0',
			},
			'& .ss-breadcrumbs__crumb, & .ss-breadcrumbs__separator': {
				padding: '0 5px',
				display: 'inline-block',
			},
			...style,
		}),
};

export const Breadcrumbs = observer(
	(properties: BreadcrumbProps): JSX.Element => {
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
			<div css={!disableStyles && CSS.breadcrumbs({ style })} className={classnames('ss-breadcrumbs', className)}>
				<ul className="ss-breadcrumbs__crumbs">
					{data
						.map<React.ReactNode>((crumb) => (
							<li className="ss-breadcrumbs__crumb">{crumb.url ? <a href={crumb.url}>{crumb.label}</a> : crumb.label}</li>
						))
						.reduce((prev, curr) => [prev, <li className="ss-breadcrumbs__separator">{separator}</li>, curr])}
				</ul>
			</div>
		);
	}
);

export interface BreadcrumbProps extends ComponentProps {
	data: {
		label: string;
		url?: string;
	}[];
	separator?: string | JSX.Element;
}
