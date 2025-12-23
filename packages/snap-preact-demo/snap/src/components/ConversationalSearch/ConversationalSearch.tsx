import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import {
	ThemeProvider,
	defaultTheme,
	StoreProvider,
	ControllerProvider,
	SnapProvider,
	ConversationalSearch as LibraryConversationalSearch,
} from '@searchspring/snap-preact/components';
import type { Snap } from '@searchspring/snap-preact';
import { ConversationalSearchController } from '@searchspring/snap-controller';

type ConversationalSearchProps = {
	controller?: ConversationalSearchController;
	snap?: Snap;
};

export const ConversationalSearch = observer(({ controller, snap }: ConversationalSearchProps) => {
	const store = controller.store;
	const theme = snap?.templates?.themes.local.global.theme;

	return (
		<SnapProvider snap={snap}>
			<ControllerProvider controller={controller}>
				<ThemeProvider theme={theme || defaultTheme}>
					<StoreProvider store={store}>
						<LibraryConversationalSearch controller={controller} />
					</StoreProvider>
				</ThemeProvider>
			</ControllerProvider>
		</SnapProvider>
	);
});

export default ConversationalSearch;
