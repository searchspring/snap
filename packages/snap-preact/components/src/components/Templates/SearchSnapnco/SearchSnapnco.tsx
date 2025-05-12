import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { ComponentProps } from '../../../types';
import { CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const SearchSnapnco = observer((properties: SearchSnapncoProps): JSX.Element => {
	return (
		<CacheProvider>
			<Search {...properties} inherits="searchSnapnco" />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchSnapncoProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
