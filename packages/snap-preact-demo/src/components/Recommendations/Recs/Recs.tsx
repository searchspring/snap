import { h, Component } from 'preact';
import { observer } from 'mobx-react';

import { Carousel, Recommendation, Result } from '@searchspring/snap-preact/components';

type RecsProps = {
	controller?: RecommendationController;
};

@observer
export class Recs extends Component<RecsProps> {
	constructor(props: RecsProps) {
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
		const arr = Array.from(Array(9).keys());

		return (
			<div>
				<Carousel>
					{arr.map((num) => (
						<div>{num}!!!</div>
					))}
				</Carousel>

				<hr style={{ margin: '20px 0' }} />

				<Recommendation controller={controller} title={'Recommended For You'} speed={0}>
					{store.results.map((result) => (
						<Result result={result}></Result>
					))}
				</Recommendation>
			</div>
		);
	}
}
