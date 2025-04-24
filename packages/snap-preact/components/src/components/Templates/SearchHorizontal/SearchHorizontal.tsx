import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import type { SearchController } from '@searchspring/snap-controller';
import { Results, ResultsProps } from '../../Organisms/Results';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, ResultComponent, StyleScript } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { NoResults, NoResultsProps } from '../../Organisms/NoResults';
import { FacetsHorizontal, FacetsHorizontalProps } from '../../Organisms/FacetsHorizontal';

const defaultStyles: StyleScript<SearchHorizontalProps> = ({}) => {
	return css({
		'& .ss__search-horizontal__content': {
			marginTop: '10px',
		},
	});
};

export const SearchHorizontal = observer((properties: SearchHorizontalProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SearchHorizontalProps> = {};

	const props = mergeProps('searchHorizontal', globalTheme, defaultProps, properties);

	const {
		disableStyles,
		className,
		controller,
		hideTopToolbar,
		hideMiddleToolbar,
		resultComponent,
		hideFacetsHorizontal,
		hideBottomToolBar,
		treePath,
	} = props;
	const store = controller.store;

	const subProps: SearchHorizontalSubProps = {
		FacetsHorizontal: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		TopToolbar: {
			name: 'top',
			// default props
			layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['layoutSelector', '_', 'sortBy', 'perPage']],
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		MiddleToolbar: {
			name: 'middle',
			// default props
			layout: [],
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		BottomToolbar: {
			name: 'bottom',
			// default props
			layout: [['banner.footer'], ['_', 'pagination']],
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		Results: {
			name: 'search',
			// default props
			resultComponent: resultComponent,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		NoResults: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
	};

	const styling = mergeStyles<SearchHorizontalProps>(props, defaultStyles);

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__search-horizontal', className)}>
				{!hideTopToolbar && store.pagination.totalResults > 0 && (
					<Toolbar {...subProps.TopToolbar} className="ss__search-horizontal__content__toolbar--top-toolbar" controller={controller} />
				)}

				{!hideFacetsHorizontal && <FacetsHorizontal {...subProps.FacetsHorizontal} facets={store.facets} controller={controller} />}

				<div className={classnames('ss__search-horizontal__content')}>
					{!hideMiddleToolbar && store.pagination.totalResults > 0 && (
						<Toolbar {...subProps.MiddleToolbar} className="ss__search-horizontal__content__toolbar--middle-toolbar" controller={controller} />
					)}

					{store.pagination.totalResults ? (
						<Results {...subProps.Results} controller={controller} />
					) : (
						store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
					)}

					{!hideBottomToolBar && store.pagination.totalResults > 0 && (
						<Toolbar {...subProps.BottomToolbar} className="ss__search-horizontal__content__toolbar--bottom-toolbar" controller={controller} />
					)}
				</div>
			</div>
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchHorizontalProps extends ComponentProps {
	controller: SearchController;
	resultComponent?: ResultComponent;
	hideTopToolbar?: boolean;
	hideMiddleToolbar?: boolean;
	hideBottomToolBar?: boolean;
	hideFacetsHorizontal?: boolean;
}

interface SearchHorizontalSubProps {
	FacetsHorizontal: Partial<FacetsHorizontalProps>;
	TopToolbar: Partial<ToolbarProps>;
	MiddleToolbar: Partial<ToolbarProps>;
	BottomToolbar: Partial<ToolbarProps>;
	Results: Partial<ResultsProps>;
	NoResults: Partial<NoResultsProps>;
}
