/** @jsx jsx */
import { ComponentChildren, Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import type { CSSObject } from '@emotion/serialize';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, ComponentMap } from '../../../types';
import { defaultBadgeComponentMap } from '../../../utilities';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import type { Product, OverlayResultBadge } from '@searchspring/snap-store-mobx';

const CSS = {
	OverlayBadge: ({}: OverlayBadgeProps) => {
		return css({
			position: 'relative',
		});
	},
	BadgePositioning: (props: OverlayResultBadge) => {
		const { location, overlayLocation, overlayLocationOptions } = props;
		let positioningStyles: CSSObject = {};

		const index = overlayLocationOptions.findIndex((option: any) => option.name === location);
		if (index === 0) {
			// first option, assume top
			positioningStyles = { top: 0 };
		} else if (index === overlayLocationOptions.length - 1) {
			// last in list, assume bottom
			positioningStyles = { bottom: 0 };
		} else if (index > 0 && index < overlayLocationOptions.length - 1) {
			// middle options, calculate percentage based on position in list
			const percentage = (index / (overlayLocationOptions.length - 1)) * 100;
			positioningStyles = { top: `${percentage}%`, transform: `translateY(-${percentage}%)`, margin: 'auto' };
		}

		return css({
			[overlayLocation]: 0, // left or right
			position: 'absolute',
			maxWidth: '50%',
			boxSizing: 'border-box',
			...positioningStyles,
		});
	},
};

export const OverlayBadge = observer((properties: OverlayBadgeProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: OverlayBadgeProps = {
		// default props
		// global theme
		...globalTheme?.components?.overlayBadge,
		// props
		...properties,
		...properties.theme?.components?.overlayBadge,
	};
	const { result, children, controller, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!children) {
		controller?.log?.warn('OverlayBadge component must have children');
		return <Fragment />;
	}

	const badgeComponentMap = Object.assign(defaultBadgeComponentMap, props.componentMap || {});

	if (!disableStyles) {
		styling.css = [CSS.OverlayBadge(props), style];
	} else if (style) {
		styling.css = [style];
	}

	const overlayBadges = controller.store.badges.getOverlayBadges(result);

	if (overlayBadges?.length) {
		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__overlay-badge', className)}>
					{children}
					{overlayBadges.map((badge) => {
						const BadgeComponent = badgeComponentMap[badge?.component];
						if (!BadgeComponent) {
							controller?.log?.warn(`Badge component not found for ${badge?.component}`);
							return;
						}
						return <BadgeComponent css={[CSS.BadgePositioning(badge)]} badge={badge} />;
					})}
				</div>
			</CacheProvider>
		);
	}

	return <Fragment>{children}</Fragment>;
});

export interface OverlayBadgeProps extends ComponentProps {
	result: Product;
	controller: SearchController | AutocompleteController | RecommendationController;
	children: ComponentChildren;
	componentMap?: ComponentMap;
}
