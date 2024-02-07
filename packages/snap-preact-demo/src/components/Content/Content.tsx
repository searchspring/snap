import { h, Component } from 'preact';
import { observer } from 'mobx-react';

import { ThemeProvider, LoadingBar, defaultTheme, StoreProvider, ControllerProvider, SnapProvider } from '@searchspring/snap-preact/components';
import { Header } from '../Header/Header';
import { Results, NoResults } from '../Results/Results';
import type { Snap } from '@searchspring/snap-preact';

type ContentProps = {
	controller?: SearchController;
	snap?: Snap;
};

@observer
export class Content extends Component<ContentProps> {
	render() {
		const store = this.props.controller.store;
		const snap = this.props.snap;

		return (
			<SnapProvider snap={snap}>
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
			</SnapProvider>
		);
	}
}
