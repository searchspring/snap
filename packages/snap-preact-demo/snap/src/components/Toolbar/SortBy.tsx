import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import { Select, withController } from '@searchspring/snap-preact/components';

type SortByProps = {
	controller?: SearchController;
};

export const SortBy = withController(
	observer(({ controller }: SortByProps) => {
		const store = controller.store;
		const { sorting } = store;

		return (
			<Select
				className="ss-sort-by"
				label="Sort By"
				options={sorting.options}
				selected={sorting.current}
				onSelect={(e, selection) => {
					selection?.url?.go();
				}}
			/>
		);
	})
);
