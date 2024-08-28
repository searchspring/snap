import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Theme, useTheme, CacheProvider, useSnap } from '../../../providers';
import { ComponentProps, RootNodeProperties, ComponentMap } from '../../../types';
import { defaultBadgeComponentMap } from '../../../utilities';
import { useComponent } from '../../../hooks';
import type { Product } from '@searchspring/snap-store-mobx';
import type { SnapTemplates } from '../../../../../src/Templates';

const CSS = {
	CalloutBadge: ({}: CalloutBadgeProps) =>
		css({
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			gap: '5px',
		}),
};

export const CalloutBadge = observer((properties: CalloutBadgeProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const snap = useSnap();

	const props: CalloutBadgeProps = {
		// default props
		tag: 'callout',
		limit: 1,
		// global theme
		...globalTheme?.components?.calloutBadge,
		// props
		...properties,
		...properties.theme?.components?.calloutBadge,
	};
	const { result, tag, renderEmpty, limit, disableStyles, className, style } = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };

	const badgeComponentMap = {
		...defaultBadgeComponentMap,
		...((snap as SnapTemplates)?.templates?.library.import.component.badge || {}),
		...props.componentMap,
	};
	if (!disableStyles) {
		styling.css = [CSS.CalloutBadge(props), style];
	} else if (style) {
		styling.css = [style];
	}

	const badges = result?.badges?.atLocation(tag).slice(0, limit);

	if (renderEmpty || badges?.length) {
		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__callout-badge', `ss__callout-badge--${tag?.replace('/', '-')}`, className)}>
					{badges.map((badge) => {
						const BadgeComponent = useComponent(badgeComponentMap, badge.component);
						if (!BadgeComponent) {
							return <Fragment />;
						}
						return <BadgeComponent {...badge} {...badge.parameters} />;
					})}
				</div>
			</CacheProvider>
		);
	}
	return <Fragment />;
});

export interface CalloutBadgeProps extends ComponentProps {
	result: Product;
	tag?: string;
	renderEmpty?: boolean;
	componentMap?: ComponentMap;
	limit?: number;
}
