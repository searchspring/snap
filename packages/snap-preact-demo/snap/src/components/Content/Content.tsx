import { h } from 'preact';
import { observer } from 'mobx-react';

import { ThemeProvider, LoadingBar, defaultTheme, StoreProvider, ControllerProvider, SnapProvider } from '@searchspring/snap-preact/components';
import { Header } from '../Header/Header';
import { Results, NoResults } from '../Results/Results';
import type { Snap } from '@searchspring/snap-preact';

type ContentProps = {
	controller?: SearchController;
	snap?: Snap;
};

export const Content = observer(({ controller, snap }: ContentProps) => {
	const store = controller.store;
	const theme = snap?.templates?.themes.local.global.theme;

	return (
		<SnapProvider snap={snap}>
			<ControllerProvider controller={controller}>
				<ThemeProvider theme={theme || defaultTheme}>
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
});

export default Content;
