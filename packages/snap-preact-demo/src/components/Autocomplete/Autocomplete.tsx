import { h, Component } from 'preact';
import { observer } from 'mobx-react';

import { Autocomplete as LibraryAutocomplete } from '@searchspring/snap-preact-components';

type AutocompleteProps = {
	controller?: AutocompleteController;
};

@observer
export class Autocomplete extends Component<AutocompleteProps> {
	render() {
		const controller = this.props.controller;

		const theme = {
			components: {
				facet: {
					limit: 5,
				},
			},
		};

		const breakpoints = {
			0: {
				columns: 1,
				rows: 1,
				hideHistory: true,
				hideTrending: true,
			},
			320: {
				columns: 2,
				rows: 1,
				hideFacets: true,
				vertical: true,
				hideHistory: true,
				hideTrending: true,
			},
			768: {
				columns: 3,
				rows: 1,
				layout: 'list',
			},
			1200: {
				width: 'auto',
				columns: 2,
				rows: 2,
			},
		};

		return <LibraryAutocomplete controller={controller} input={controller.config.selector} breakpoints={breakpoints} theme={theme} />;
	}
}
