import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import { Recommendation, Result } from '@searchspring/snap-preact/components';

type RecsProps = {
	controller?: RecommendationController;
};

export const Recs = observer((props: RecsProps) => {
	const controller = props.controller;
	if (!controller.store.profile) {
		controller.init();
		controller.search();
	}
	const store = controller?.store;
	const parameters = store?.profile?.display?.templateParameters;

	return (
		<div>
			<hr style={{ margin: '20px 0' }} />
			<Recommendation controller={controller} title={parameters.title} speed={0} lazyRender={{ enabled: false }}>
				{store.results.map((result) => (
					<Result controller={controller} result={result}></Result>
				))}
			</Recommendation>
		</div>
	);
});
