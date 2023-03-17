import { h, Component } from 'preact';
import { observer } from 'mobx-react';

import {
	ThemeProvider,
	defaultTheme,
	FilterSummary,
	Facets,
	StoreProvider,
	withStore,
	withController,
	ControllerProvider,
} from '@searchspring/snap-preact-components';

type SidebarProps = {
	controller?: SearchController;
};

@observer
export class Sidebar extends Component<SidebarProps> {
	render() {
		const store = this.props.controller.store;

		return (
			<ThemeProvider theme={defaultTheme}>
				<ControllerProvider controller={this.props.controller}>
					<StoreProvider store={store}>
						<SidebarContents />
					</StoreProvider>
				</ControllerProvider>
			</ThemeProvider>
		);
	}
}

type SidebarContentsProps = {
	controller?: SearchController;
	store?: SearchStore;
};

@withController
@withStore
//@ts-ignore
@observer
export class SidebarContents extends Component<SidebarContentsProps> {
	render() {
		const { filters, facets } = this.props.store;

		return (
			<div class="ss-sidebar-container">
				<FilterSummary filters={filters} controller={this.props.controller} />
				<Facets facets={facets} />
			</div>
		);
	}
}
