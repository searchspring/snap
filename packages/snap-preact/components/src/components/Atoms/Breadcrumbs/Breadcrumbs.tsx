import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import { SearchController } from '@searchspring/snap-controller';
import { Icon, IconProps, IconType } from '../Icon';

const defaultStyles: StyleScript<BreadcrumbsProps> = () => {
	return css({
		'& .ss__breadcrumbs__crumbs': {
			padding: '0',
			display: 'flex',
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
		data: properties.controller
			? (controller) => {
					return [
						{ label: 'Search' },
						{ label: `Results ${controller?.store.search?.query?.string ? `for "${controller?.store.search?.query?.string}"` : ''}` },
					];
			  }
			: [{ label: 'Search' }],
	};

	const props = mergeProps('breadcrumbs', globalTheme, defaultProps, properties);

	const { data, separator, separatorIcon, className, internalClassName, controller, disableStyles, treePath } = props;

	const subProps: BreadcrumbsSubProps = {
		icon: {
			className: 'ss__breadcrumbs__separator__icon',
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<BreadcrumbsProps>(props, defaultStyles);

	let _data;
	if (typeof data == 'function') {
		_data = data(controller);
	} else {
		_data = data;
	}

	return _data ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__breadcrumbs', className, internalClassName)}>
				<ul className="ss__breadcrumbs__crumbs">
					{_data
						.map<React.ReactNode>((crumb: any) => (
							<li className="ss__breadcrumbs__crumbs__crumb">{crumb.url ? <a href={crumb.url}>{crumb.label}</a> : crumb.label}</li>
						))
						.reduce((prev: any, curr: any) => [
							prev,
							<li className="ss__breadcrumbs__crumbs__separator">
								{separator !== false ? separator : <></>}
								{separatorIcon && (
									<Icon
										{...subProps.icon}
										{...(typeof separatorIcon == 'string' ? { icon: separatorIcon } : (separatorIcon as Partial<IconProps>))}
									/>
								)}
							</li>,
							curr,
						])}
				</ul>
			</div>
		</CacheProvider>
	) : (
		<></>
	);
});

export interface BreadcrumbsProps extends ComponentProps<BreadcrumbsProps> {
	data?:
		| {
				label: string;
				url?: string;
		  }[]
		| ((controller?: SearchController) => {
				label: string;
				url?: string;
		  }[]);
	separator?: string | JSX.Element | false;
	separatorIcon?: IconType | Partial<IconProps> | false;
	controller?: SearchController;
}

interface BreadcrumbsSubProps {
	icon: Partial<IconProps>;
}
