import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import {
	ThemeProvider,
	defaultTheme,
	FilterSummary,
	Select,
	Facets,
	StoreProvider,
	withStore,
	ControllerProvider,
} from '@searchspring/snap-preact-components';

@observer
export class Sidebar extends Component {
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

@withStore
@observer
export class SidebarContents extends Component {
	render() {
		const {
			filters,
			custom: { onSaleFacet },
			facets,
		} = this.props.store;

		return (
			<div class="ss-sidebar-container">
				<FilterSummary hideClearAll filters={filters} />

				{onSaleFacet && (
					<Select
						className="ss-facet-onsale"
						disableClickOutside
						style={{ width: '100%', margin: '10px 0' }}
						label={`${onSaleFacet.label}`}
						options={onSaleFacet?.values.map((value) => {
							value.label = `${value.label} (${value.count})`;
							return value;
						})}
						selected={onSaleFacet?.values?.filter((value) => value.filtered)}
						clearSelection="clear"
						onSelect={(e, option) => {
							if (option) {
								option.url.go();
							} else {
								onSaleFacet?.controller.urlManager.remove('page').remove('filter.on_sale').go();
							}
						}}
					/>
				)}

				<Facets facets={facets} />
			</div>
		);
	}
}
