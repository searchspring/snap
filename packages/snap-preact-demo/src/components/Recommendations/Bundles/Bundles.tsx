import { h } from 'preact';
import { observer } from 'mobx-react';

import { RecommendationBundle, RecommendationBundleProps } from '@searchspring/snap-preact-components';
import { useEffect } from 'preact/hooks';

import './Bundles.scss';

export const Bundles = observer((props) => {
	const { controller } = props;

	useEffect(() => {
		// useEffect here is used to load recommendations on no results
		if (!controller.store.loaded) {
			controller.search();
		}
	}, []);

	const bundleRecsProps: RecommendationBundleProps = {
		controller: controller,
		onAddToCart: (data) => controller.log.debug('ADDING TO CART', data),
		lazyRender: {
			enabled: false,
		},
	};

	return (
		<div>
			<hr style={{ margin: '20px 0' }} />
			<RecommendationBundle {...bundleRecsProps} />
		</div>
	);
});
