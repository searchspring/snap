import { h } from 'preact';
import { observer } from 'mobx-react';

import {
	ThemeProvider,
	defaultTheme,
	FilterSummary,
	Facets,
	StoreProvider,
	withController,
	ControllerProvider,
} from '@searchspring/snap-preact/components';

type SidebarProps = {
	controller?: SearchController;
};

export const Sidebar = observer(({ controller }: SidebarProps) => {
	const store = controller.store;

	return (
		<ThemeProvider theme={defaultTheme}>
			<ControllerProvider controller={controller}>
				<StoreProvider store={store}>
					<SidebarContents />
				</StoreProvider>
			</ControllerProvider>
		</ThemeProvider>
	);
});

type SidebarContentsProps = {
	controller?: SearchController;
	store?: SearchStore;
};

export const SidebarContents = withController(
	observer(({ controller }: SidebarContentsProps) => {
		const store = controller.store;
		const { filters, facets } = store;

		return (
			<div className="ss-sidebar-container">
				<FilterSummary filters={filters} controller={controller} />
				<Facets facets={facets} />
			</div>
		);
	})
);
