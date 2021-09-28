import { h, Component } from 'preact';
import { observer } from 'mobx-react';

@observer
export class Finder extends Component {
	render() {
		const controller = this.props.controller;
		const store = controller.store;
		const { selections, loading } = store;

		return (
			selections.length > 0 && (
				<div class={`finder-container`}>
					<div class="finder-wrapper">
						{selections.map((selection) =>
							controller.config.wrapSelect ? (
								<div class="finder-column finder-dropdown form-select-wrapper">
									<Dropdown selection={selection} store={loading} />
								</div>
							) : (
								<Dropdown selection={selection} store={loading} />
							)
						)}

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
						</div>
					</div>
				</div>
			)
		);
	}
}

@observer
class Dropdown extends Component {
	render() {
		const selection = this.props.selection;
		const loading = this.props.loading;

		return (
			<select
				class="form-input form-select form-input-short searchspring-finder_field"
				onChange={(e) => {
					selection.select(e.target.value);
				}}
				disabled={loading || selection.disabled}
			>
				{selection?.values?.map((value) => (
					<option value={value.value} selected={selection.selected === value.value}>
						{value.label}
					</option>
				))}
			</select>
		);
	}
}
