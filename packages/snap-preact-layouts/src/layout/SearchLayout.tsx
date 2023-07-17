import { h } from 'preact';
import { observer } from 'mobx-react';

import { SearchLayout as LayoutLib, PriceProps } from '@searchspring/snap-preact-components';
import { defaultTheme } from '@searchspring/snap-preact-components';
import type { SearchLayoutProps } from '@searchspring/snap-preact-components';

import { mobileLayout } from './layouts/mobile/searchMobile';
import { tabletLayout } from './layouts/tablet/searchTablet';
import { desktopLayout } from './layouts/desktop/searchDesktop';

const _theme = (controller: SearchController) => {
	console.log(controller);
	return {
		...defaultTheme,
		components: {
			price: {
				symbol: '%',
			} as PriceProps,
		},
	};
};

export const SearchLayout = observer((properties: SearchLayoutProps): JSX.Element => {
	const controller = properties.controller;

	const breakpoints = {
		0: mobileLayout(controller),
		540: tabletLayout(controller),
		768: desktopLayout(controller),
	};

	const theme = _theme(controller!);

	return <LayoutLib controller={controller} breakpoints={breakpoints} theme={theme} />;
});
