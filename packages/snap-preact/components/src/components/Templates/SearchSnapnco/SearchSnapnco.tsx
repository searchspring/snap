import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const SearchSnapnco = observer((properties: SearchSnapncoProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props = mergeProps('searchSnapnco', globalTheme, {}, properties);

	return (
		<CacheProvider>
			<Search {...props} />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchSnapncoProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
