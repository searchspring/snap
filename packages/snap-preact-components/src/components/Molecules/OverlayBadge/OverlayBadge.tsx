/** @jsx jsx */
import { ComponentChildren, Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, ComponentMap } from '../../../types';
import { defaultBadgeComponentMap } from '../../../utilities';
import { useComponent } from '../../../hooks';
import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import type { Product, ResultBadge } from '@searchspring/snap-store-mobx';

const CSS = {
	OverlayBadge: ({ meta }: OverlayBadgeProps) => {
		const grid = meta?.badges?.locations?.grid;

		let gridProperties = {};
		if (grid?.length && grid[0]?.length) {
			const gridTemplateAreas = grid.map((row: string[]) => `"${row.join(' ')}"`).join(' ');
			const columns = grid[0].length;
			gridProperties = {
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
				gridTemplateAreas,
			};
		}

		return css({
			position: 'relative',

			'& .ss__overlay-badge__grid-wrapper': {
				display: 'grid',
				position: 'absolute',
				top: '0',
				left: '0',
				width: '100%',
				height: '100%',
				...gridProperties,
			},
		});
	},
	BadgePositioning: (props: ResultBadge & { index: number }) => {
		const { location, path, index } = props;
		const [_, overlayLocation] = path.split('/');

		return css({
			position: 'absolute',
			gridArea: location,
			[overlayLocation]: 0,
			boxSizing: 'border-box',
			zIndex: Math.max(100 - index, 1),
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

	const overlayBadges = result?.badges?.overlay;

	if (overlayBadges?.length) {
		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__overlay-badge', className)}>
					{children}
					<div className="ss__overlay-badge__grid-wrapper">
						{overlayBadges.map((badge, index) => {
							const BadgeComponent = useComponent(badgeComponentMap, badge.component);
							if (!BadgeComponent) {
								return <Fragment />;
							}
							return (
								<BadgeComponent
									{...badge}
									{...badge.parameters}
									css={[CSS.BadgePositioning({ ...badge, index })]}
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
