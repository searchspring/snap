import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { mergeProps } from '../../../utilities';

const CSS = {
	breadcrumbs: ({}: Partial<BreadcrumbsProps>) =>
		css({
			'& .ss__breadcrumbs__crumbs': {
				padding: '0',
			},
			'& .ss__breadcrumbs__crumbs__crumb, & .ss__breadcrumbs__crumbs__separator': {
				padding: '0 5px',
				display: 'inline-block',
			},
		}),
};

export const Breadcrumbs = observer((properties: BreadcrumbsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<BreadcrumbsProps> = {
		separator: '>',
	};

	const props = mergeProps('breadcrumbs', globalTheme, defaultProps, properties);

	const { data, separator, disableStyles, className, style, styleScript } = props;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.breadcrumbs(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__breadcrumbs', className)}>
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

export interface BreadcrumbsProps extends ComponentProps {
	data: {
		label: string;
		url?: string;
	}[];
	separator?: string | JSX.Element;
}
