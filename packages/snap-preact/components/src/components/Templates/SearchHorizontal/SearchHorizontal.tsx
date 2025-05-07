import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';
import classNames from 'classnames';

export const SearchHorizontal = observer((properties: SearchHorizontalProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const props = mergeProps('searchHorizontal', globalTheme, {}, properties);

	return (
		<CacheProvider>
			<div className={classNames('ss__search-horizontal', props.className)}>
				<Search {...props} />
			</div>
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchHorizontalProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
