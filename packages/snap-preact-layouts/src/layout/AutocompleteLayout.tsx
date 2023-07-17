import { h } from 'preact';
import { observer } from 'mobx-react';

import { AutocompleteLayout as LayoutLib, PriceProps } from '@searchspring/snap-preact-components';
import { defaultTheme } from '@searchspring/snap-preact-components';
import { autocompleteStyling } from '../styles/autocomplete';
import type { AutocompleteLayoutProps } from '@searchspring/snap-preact-components';

import { acMobile } from './layouts/mobile/acMobile';
import { acTablet } from './layouts/tablet/acTablet';
import { acDesktop } from './layouts/desktop/acDesktop';

const _theme = (controller: AutocompleteController) => {
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

export const AutocompleteLayout = observer((properties: AutocompleteLayoutProps): JSX.Element => {
	const controller = properties.controller;

	const breakpoints = {
		0: acMobile(controller),
		540: acTablet(controller),
		768: acDesktop(controller),
	};

	const theme = _theme(controller!);

	return <LayoutLib input={properties.input} controller={controller} breakpoints={breakpoints} theme={theme} style={autocompleteStyling} />;
});
