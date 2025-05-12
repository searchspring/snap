import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { ComponentProps } from '../../../types';
import { CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const SearchSnappy = observer((properties: SearchSnappyProps): JSX.Element => {
	return (
		<CacheProvider>
			<Search {...properties} inherits="searchSnappy" />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchSnappyProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
