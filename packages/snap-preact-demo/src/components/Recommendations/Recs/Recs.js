import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { Result, Button } from '@searchspring/snap-preact-components';

@observer
export class Recs extends Component {
	constructor(props) {
		super();

		const controller = props.controller;
		controller.init();
		controller.search();
	}
	render() {
		const controller = this.props.controller;
		const store = controller?.store;

		return (
			<Fragment>
				{store?.results?.length ? (
					<div>
						{store.results.slice(0, 4).map((result) => (
							<Result result={result} />
						))}
					</div>
				) : (
					<Fragment />
				)}
			</Fragment>
		);
	}
}
