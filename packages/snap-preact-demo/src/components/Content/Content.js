import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { ThemeProvider, LoadingBar, defaultTheme, StoreProvider, ControllerProvider } from '@searchspring/snap-preact-components';
import { Header } from '../Header/Header';
import { Results, NoResults } from '../Results/Results';
@observer
export class Content extends Component {
	render() {
		const store = this.props.controller.search.store;

		return (
			<ControllerProvider controller={this.props.controller}>
				<ThemeProvider theme={defaultTheme}>
					<StoreProvider store={store}>
						<div>
							<LoadingBar active={store.loading} />

							<Header />

							{store.pagination.totalResults ? <Results /> : store.pagination.totalResults === 0 && <NoResults />}
						</div>
					</StoreProvider>
				</ThemeProvider>
			</ControllerProvider>
		);
	}
}
