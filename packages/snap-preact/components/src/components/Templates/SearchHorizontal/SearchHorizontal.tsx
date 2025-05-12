import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { ComponentProps } from '../../../types';
import { CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const SearchHorizontal = observer((properties: SearchHorizontalProps): JSX.Element => {
	return (
		<CacheProvider>
			<Search {...properties} inherits="searchHorizontal" />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchHorizontalProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
