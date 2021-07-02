import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { Recommendation, Result } from '@searchspring/snap-preact-components';

@observer
export class Recs extends Component {
	constructor(props) {
		super();

		const controller = props.controller;

		if (!controller.store.profile) {
			controller.init();
			controller.search();
		}
	}
	render() {
		const controller = this.props.controller;
		const store = controller?.store;

		return (
			<Recommendation controller={controller} pagination={true}>
				{store.results.map((result) => (
					<Result result={result}></Result>
				))}
			</Recommendation>
		);
	}
}
