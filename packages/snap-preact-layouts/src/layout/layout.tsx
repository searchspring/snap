import { h } from 'preact';
import { observer } from 'mobx-react';

import { Layout as LayoutLib } from '@searchspring/snap-preact-components';
import { defaultTheme } from '@searchspring/snap-preact-components';
import type { LayoutProps } from '@searchspring/snap-preact-components';

import { mobileLayout } from './layouts/mobile';
import { tabletLayout } from './layouts/tablet';
import { desktopLayout } from './layouts/desktop';

const _theme = (controller: SearchController) => {
	console.log(controller);
	return {
		...defaultTheme,
		// components: {
		// 	perPage: {
		// 		label: 'hi {{ id }}'
		// 	},
		// }
	};
};

export const Layout = observer((properties: LayoutProps): JSX.Element => {
	const controller = properties.controller;

	const breakpoints = {
		0: mobileLayout(controller),
		540: tabletLayout(controller),
		768: desktopLayout(controller),
	};

	const theme = _theme(controller!);

	return <LayoutLib controller={controller} breakpoints={breakpoints} theme={theme} />;
});
