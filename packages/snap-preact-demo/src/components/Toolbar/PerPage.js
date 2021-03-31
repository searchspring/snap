import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';
import { withStore } from '../../services/providers';

import { Select } from '@searchspring/snap-preact-components';
import { defaultTheme, ThemeProvider } from '@searchspring/snap-preact-components';

@withStore
@observer
export class PerPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { pagination } = this.props.store;

		return (
			<div class="ss-per-page">
				<Select
					label="Per Page"
					options={pagination.pageSizeOptions}
					selected={{ label: `Show ${pagination.pageSize}`, value: pagination.pageSize }}
					onSelect={(e, option) => {
						pagination.setPageSize(option.value);
					}}
				/>
			</div>
		);
	}
}
