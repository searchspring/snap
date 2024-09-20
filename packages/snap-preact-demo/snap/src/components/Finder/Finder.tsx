import { h } from 'preact';
import { observer } from 'mobx-react';

type FinderProps = {
	controller?: FinderController;
};

export const Finder = observer(({ controller }: FinderProps) => {
	const store = controller.store;
	const { selections, loading, pagination } = store;

	return (
		selections.length > 0 && (
			<div className={`finder-container`}>
				<div className="finder-wrapper">
					{selections.map((selection) =>
						controller.config.wrapSelect ? (
							<div className="finder-column finder-dropdown form-select-wrapper" key={selection.id}>
								<Dropdown selection={selection} store={store} loading={loading} />
							</div>
						) : (
							<Dropdown selection={selection} store={store} loading={loading} key={selection.id} />
						)
					)}

					<span style={{ color: '#aaa', fontSize: '10px' }}>{` ${pagination.totalResults} results`}</span>

					<div className="finder-column finder-button ss-shop">
						<button
							onClick={() => {
								controller.find();
							}}
							disabled={loading}
							className="button button--primary searchspring-finder_submit"
						>
							Shop Now
						</button>
						&nbsp;
						<button
							onClick={() => {
								controller.reset();
							}}
							disabled={loading}
							className="button button--primary searchspring-finder_reset"
						>
							Reset
						</button>
					</div>
				</div>
			</div>
		)
	);
});

type DropdownProps = {
	store: FinderController['store'];
	selection: FinderController['store']['selections'][0];
	loading: boolean;
};

export const Dropdown = observer(({ selection, loading }: DropdownProps) => {
	return (
		<select
			className="form-input form-select form-input-short searchspring-finder_field"
			onChange={(e: any) => {
				selection.select(e.target.value);
			}}
			disabled={loading || selection.disabled}
		>
			{selection?.values?.map((value) => (
				<option value={value.value} selected={selection.selected === value.value} key={value.value}>
					{value.label} {value.count ? `(${value.count})` : ''}
				</option>
			))}
		</select>
	);
});
