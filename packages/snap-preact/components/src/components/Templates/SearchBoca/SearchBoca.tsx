import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const SearchBoca = observer((properties: SearchBocaProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const props = mergeProps('searchBoca', globalTheme, {}, properties);

	return (
		<CacheProvider>
			<Search {...props} />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchBocaProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
