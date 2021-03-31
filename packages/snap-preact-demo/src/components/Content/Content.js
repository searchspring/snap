import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { ThemeProvider } from '@searchspring/snap-preact-components';

import { customTheme } from '../../theme.js';
import { StoreProvider } from '../../services/providers';

import { Header } from '../Header/Header';
import { Results, NoResults } from '../Results/Results';

@observer
export class Content extends Component {
	render() {
		const store = this.props.store;

		return (
			<ThemeProvider theme={customTheme}>
				<StoreProvider store={store}>
					<div>
						<Header />

						{this.props.store.pagination.totalResults ? <Results /> : this.props.store.pagination.totalResults === 0 && <NoResults />}
					</div>
				</StoreProvider>
			</ThemeProvider>
		);
	}
}
