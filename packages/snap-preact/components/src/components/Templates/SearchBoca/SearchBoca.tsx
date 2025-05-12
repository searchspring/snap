import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { ComponentProps } from '../../../types';
import { CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const SearchBoca = observer((properties: SearchBocaProps): JSX.Element => {
	return (
		<CacheProvider>
			<Search {...properties} inherits="searchBoca" />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchBocaProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
