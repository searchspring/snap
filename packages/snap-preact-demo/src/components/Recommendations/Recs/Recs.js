import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { Carousel, Recommendation, Result } from '@searchspring/snap-preact-components';

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
		const arr = [...Array(9).keys()];

		return (
			<div>
				<Carousel>
					{arr.map((num) => (
						<div>{num}!!!</div>
					))}
				</Carousel>

				<hr style={{ margin: '20px 0' }} />

				<Recommendation controller={controller}>
					{store.results.map((result) => (
						<Result result={result}></Result>
					))}
				</Recommendation>
			</div>
		);
	}
}
