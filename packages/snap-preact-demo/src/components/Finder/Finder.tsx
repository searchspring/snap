import { h, Component } from 'preact';
import { observer } from 'mobx-react';

type FinderProps = {
	controller?: FinderController;
};

@observer
export class Finder extends Component<FinderProps> {
	render() {
		const controller = this.props.controller;
		const store = controller.store;
		const { selections, loading, pagination } = store;

		return (
			selections.length > 0 && (
				<div class={`finder-container`}>
					<div class="finder-wrapper">
						{selections.map((selection) =>
							controller.config.wrapSelect ? (
								<div class="finder-column finder-dropdown form-select-wrapper">
									<Dropdown selection={selection} store={store} loading={loading} />
								</div>
							) : (
								<Dropdown selection={selection} store={store} loading={loading} />
							)
						)}

						<span style={{ color: '#aaa', 'font-size': '10px' }}>{` ${pagination.totalResults} results`}</span>

						<div class="finder-column finder-button ss-shop">
							<button
								onClick={() => {
									controller.find();
								}}
								disabled={loading}
								class="button button--primary searchspring-finder_submit"
							>
								Shop Now
							</button>
							&nbsp;
							<button
								onClick={() => {
									controller.reset();
								}}
								disabled={loading}
								class="button button--primary searchspring-finder_reset"
							>
								Reset
							</button>
						</div>
					</div>
				</div>
			)
		);
	}
}

type DropdownProps = {
	store: FinderController['store'];
	selection: FinderController['store']['selections'][0];
	loading: boolean;
};

@observer
class Dropdown extends Component<DropdownProps> {
	render() {
		const selection = this.props.selection;
		const loading = this.props.loading;

		return (
			<select
				class="form-input form-select form-input-short searchspring-finder_field"
				onChange={(e: any) => {
					selection.select(e.target.value);
				}}
				disabled={loading || selection.disabled}
			>
				{selection?.values?.map((value) => (
					<option value={value.value} selected={selection.selected === value.value}>
						{value.label} {value.count ? `(${value.count})` : ''}
					</option>
				))}
			</select>
		);
	}
}
