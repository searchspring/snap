/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, ComponentMap } from '../../../types';
import { defaultBadgeComponentMap } from '../../../utilities';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

const CSS = {
	CalloutBadge: ({}: CalloutBadgeProps) =>
		css({
			display: 'inline-block',
		}),
};

export const CalloutBadge = observer((properties: CalloutBadgeProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: CalloutBadgeProps = {
		// default props
		// global theme
		...globalTheme?.components?.calloutBadge,
		// props
		...properties,
		...properties.theme?.components?.calloutBadge,
	};
	const { result, name, controller, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	const badgeComponentMap = Object.assign(defaultBadgeComponentMap, props.componentMap || {});

	if (!disableStyles) {
		styling.css = [CSS.CalloutBadge(props), style];
	} else if (style) {
		styling.css = [style];
	}

	const calloutBadge = controller?.store?.badges.getCalloutBadge(result, name);

	if (calloutBadge) {
		const BadgeComponent = badgeComponentMap[calloutBadge.component];
		if (!BadgeComponent) {
			controller?.log?.warn(`Badge component not found for ${calloutBadge.component}`);
			return <Fragment />;
		}
		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__callout-badge', className)}>
					<BadgeComponent
						badge={calloutBadge}
						className={classnames(
							`ss__callout-badge--${calloutBadge.tag}`,
							`ss__callout-badge--${calloutBadge.location}`,
							`ss__callout-badge__${calloutBadge.component}`,
							`ss__callout-badge__${calloutBadge.component}--${calloutBadge.location}`,
							`ss__callout-badge__${calloutBadge.component}--${calloutBadge.tag}`
						)}
					/>
				</div>
			</CacheProvider>
		);
	}
	return <Fragment />;
});

export interface CalloutBadgeProps extends ComponentProps {
	result: Product;
	controller: SearchController | AutocompleteController | RecommendationController;
	name: string;
	componentMap?: ComponentMap;
}
