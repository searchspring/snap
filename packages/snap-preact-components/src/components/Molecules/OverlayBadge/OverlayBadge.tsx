/** @jsx jsx */
import { ComponentChildren, Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, ComponentMap } from '../../../types';
import { defaultBadgeComponentMap, lcm } from '../../../utilities';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import type { Product, ResultBadge } from '@searchspring/snap-store-mobx';

const CSS = {
	OverlayBadge: ({ meta }: OverlayBadgeProps & { meta: any }) => {
		// TODO: type meta as MetaResponseModel when updated
		const leftAreas = meta?.badges?.locations?.overlay?.left?.map((area: any) => area.name) || [];
		const rightAreas = meta?.badges?.locations?.overlay?.right?.map((area: any) => area.name) || [];

		const LCM = lcm(leftAreas.length, rightAreas.length);
		const leftAreasLCM = Array.from({ length: LCM }).map((_, index) => leftAreas[Math.floor(index / (LCM / leftAreas.length))]);
		const rightAreasLCM = Array.from({ length: LCM }).map((_, index) => rightAreas[Math.floor(index / (LCM / rightAreas.length))]);

		const gridTemplateAreas = leftAreasLCM.map((left, index) => `"${left} ${rightAreasLCM[index]}"`).join(' ');
		const columns = Object.keys(meta?.badges?.locations?.overlay || {}).length;

		return css({
			position: 'relative',

			'& .ss__overlay-badge__grid-wrapper': {
				display: 'grid',
				position: 'absolute',
				top: '0',
				left: '0',
				width: '100%',
				height: '100%',
				gridTemplateColumns: columns && `repeat(${columns}, 1fr)`,
				gridTemplateAreas,
			},
		});
	},
	BadgePositioning: (props: ResultBadge & { meta: any; index: number }) => {
		// TODO: type meta as MetaResponseModel when updated
		const { location, meta, index } = props;

		const isLeftOverlay = meta?.badges?.locations?.overlay?.left?.some((leftOverlays: any) => leftOverlays.name === location);
		const isRightOverlay = meta?.badges?.locations?.overlay?.right?.some((rightOverlays: any) => rightOverlays.name === location);
		const overlayLocation = isRightOverlay ? 'right' : isLeftOverlay ? 'left' : '';

		const overlayLocationArr = overlayLocation && meta?.badges?.locations?.overlay[overlayLocation];
		const isBottom =
			Array.isArray(overlayLocationArr) && overlayLocationArr.length > 1 && overlayLocationArr[overlayLocationArr.length - 1].name === location;

		return css({
			position: 'absolute',
			gridArea: location,
			[overlayLocation]: 0,
			bottom: isBottom ? 0 : undefined,
			boxSizing: 'border-box',
			zIndex: Math.max(10 - index, 1),
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

	const meta = controller?.store?.meta;
	if (!disableStyles) {
		styling.css = [CSS.OverlayBadge({ ...props, meta }), style];
	} else if (style) {
		styling.css = [style];
	}

	const overlayBadges = controller?.store?.badges.getOverlayBadges(result);

	if (overlayBadges?.length) {
		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__overlay-badge', className)}>
					{children}
					<div className="ss__overlay-badge__grid-wrapper">
						{overlayBadges.map((badge, index) => {
							const BadgeComponent = badgeComponentMap[badge?.component];
							if (!BadgeComponent) {
								controller?.log?.warn(`Badge component not found for ${badge?.component}`);
								return;
							}
							return (
								<BadgeComponent
									{...badge}
									{...badge.parameters}
									css={[CSS.BadgePositioning({ ...badge, meta, index })]}
									className={classnames(
										`ss__overlay-badge--${badge.tag}`,
										`ss__overlay-badge--${badge.location}`,
										`ss__overlay-badge__${badge.component}`,
										`ss__overlay-badge__${badge.component}--${badge.location}`,
										`ss__overlay-badge__${badge.component}--${badge.tag}`
									)}
								/>
							);
						})}
					</div>
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
