import { h, Component } from 'preact';
import { observer } from 'mobx-react';

import { Select, withStore } from '@searchspring/snap-preact-components';

type SortByProps = {
	store?: SearchStore;
};

@withStore
@observer
export class SortBy extends Component<SortByProps> {
	constructor(props: SortByProps) {
		super(props);
	}

	render() {
		const { sorting } = this.props.store;

		return (
			<Select
				className="ss-sort-by"
				label="Sort By"
				options={sorting.options}
				selected={sorting.current}
				onSelect={(e, selection) => {
					selection.url.go();
				}}
			/>
		);
	}
}
