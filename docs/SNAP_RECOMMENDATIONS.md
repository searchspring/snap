# Recommendations

While it is possible to construct recommendation controllers via the Snap configuration, it is recommended to utilize the [RecommendationInstantiator config](https://searchspring.github.io/snap/reference-snap-preact-instantiators#recommendationinstantiatorconfig) instead for integration of recommendations. The `RecommendationInstantiator` will only create recommendation controllers if the page contains recommendation profiles.

There are three types of recommendations that Searchspring offers:

- Product Recommendations / Personalized Recommendations
- Bundle Recommendations
- Email Recommendations (documentation coming soon)
<!-- TODO: Add Email Recommendations Docs -->

This guide will cover usage of the Default templates that are available in the Searchspring Management Console. If you are looking to create a custom template, please refer to the [Custom Templates reference](https://searchspring.github.io/snap/reference-custom-recommendation-templates)

Changes to the recommendation integration scripts were made in Snap `v0.60.0`. Legacy Recommendation Integrations docs can still be found [`here`](https://searchspring.github.io/snap/snap-recommendations-legacy)


## More Information
See [Recommendations Controller reference](https://searchspring.github.io/snap/reference-controller-recommendation) for more information on all available context variables that can be used to configure recommendations. The reference also contains more information regarding batching, ordering, deduplication, filtering, examples, and more.

## Product Recommendations / Personalized Recommendations

The Searchspring Management Console contains a `Default` template available for standard profiles (non-bundle) that does not require the use of the Snapfu CLI to create a custom template. To use the `Default` template, the following instantiator config should be added to your `snap-preact` config.

```js
// src/index.js

import { Snap } from '@searchspring/snap-preact';

const snap = new Snap({
    client: {
        globals: {
            siteId: 'REPLACE_WITH_YOUR_SITE_ID',
        },
    },
    instantiators: {
		recommendation: {
			components: {
				Default: async () => {
					return (await import('./components/Recommendations/Recs')).Recs;
				},
			},
		},
	},
});
```

Note that the component is not required to be named `Default`, however `instantiators.recommendation.component` must contain the `Default` key as seen in the example above.


This example assumes a `recently-viewed` profile has been configured in the Searchspring Management Console (SMC) with the `Default` template selected. The profile (specified via the `tag` property) will render inside the `.ss__recs__recently-viewed` element below the script block. While the target element can be placed anywhere on the page, it's recommended to group elements with their corresponding script blocks for easier integration management. The component configuration is handled within the [`RecommendationInstantiator`](https://searchspring.github.io/snap/reference-snap-preact-instantiators).

```html
<script type="searchspring/recommendations">
	profiles = [
		{
			tag: 'recently-viewed',
			selector: '.ss__recs__recently-viewed',
			options: {
				limit: 5
			}
		}
	];
</script>

<div class="ss__recs__recently-viewed"><!-- recommendations will render here --></div>
```


### Recommendation Component
In this example, the `Recs` component is a wrapper around the `Recommendation` component from the `@searchspring/snap-preact-components` package. See [Components Preact > Recommendation](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Forganisms-recommendation--default) for more details.

```jsx
// components/Recommendations/Recs.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { useEffect } from 'preact/hooks';
import { Recommendation } from '@searchspring/snap-preact-components';

import './Recs.scss';

export const Recs = observer((props) => {
	
	const controller = props.controller;
	const store = controller?.store;

	useEffect(() => {
		if (!controller.store.loaded && !controller.store.loading) {
			controller.search();
		}
	}, []);

	const parameters = store?.profile?.display?.templateParameters;

	return (
		store.results.length > 0 && (
			<Recommendation controller={controller} title={parameters?.title}/>
		)
	);
});
```


## Bundle Recommendations
The Searchspring Management Console also contains a `Bundle` template available for bundle profiles, this template does not require the use of the Snapfu CLI to create a custom template. To use the `Bundle` template, another component mapping will need to be added to your instantiator config.

```js
// src/index.js

const snap = new Snap({
    client: {
        globals: {
            siteId: 'REPLACE_WITH_YOUR_SITE_ID',
        },
    },
    instantiators: {
		recommendation: {
			components: {
				Default: async () => {
					return (await import('./components/Recommendations/Recs')).Recs;
				},
                Bundle: async () => {
                    return (await import('./components/Recommendations/Bundled')).Bundled;
                },
			},
		},
	},
});
```

Note that the component is not required to be named `Bundle`, however `instantiators.recommendation.component` must contain the `Bundle` key as seen in the example above.

This example assumes a `bundle` profile has been configured in the Searchspring Management Console (SMC) with the `Bundle` template selected. The profile (specified via the `tag` property) will render inside the `.ss__recs__bundle` element below the script block. While the target element can be placed anywhere on the page, it's recommended to group elements with their corresponding script blocks for easier integration management. The component configuration is handled within the [`RecommendationInstantiator`](https://searchspring.github.io/snap/reference-snap-preact-instantiators). 

The `products` global context variable is required for bundle recommendations to specify the sku of the currently viewed product.

```html
<script type="searchspring/recommendations">
	global: {
		products: ['product_sku_123'],
	};
	profiles = [
		{
			tag: 'bundle',
			selector: '.ss__recs__bundle',
			options: {
				limit: 5
			}
		}
	];
</script>

<div class="ss__recs__bundle"><!-- recommendations will render here --></div>
```

### Bundle Component
The example `Bundled` component below uses the `RecommendationBundle` component imported from the snap component library. See [Components Preact > RecommendationBundle](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Forganisms-recommendationbundle--default) for more details. 

```jsx
// components/Recommendations/Bundled.jsx

import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { observer } from 'mobx-react';
import { RecommendationBundle } from '@searchspring/snap-preact-components';

import './Bundled.scss';

const addToCart = (data) => {
	// handle adding products to the cart
};

export const Bundled = observer((props) => {
	const controller = props.controller;
	const store = controller?.store;

	useEffect(() => {
		if (!controller.store.loaded && !controller.store.loading) {
			controller.search();
		}
	}, []);

	const parameters = store?.profile?.display?.templateParameters;

	return store.results.length > 0 && <RecommendationBundle controller={controller} onAddToCart={(e, data) => addToCart(data)} title={parameters?.title} />;
});


import { h } from 'preact';
import { observer } from 'mobx-react';

import { RecommendationBundle } from '@searchspring/snap-preact-components';

export const Bundled = observer((props) => {
	const controller = props.controller;
	const store = controller?.store;

	if (!controller.store.loaded && !controller.store.loading) {
		controller.search();
	}

	const parameters = store?.profile?.display?.templateParameters;

	return store.results.length > 0 && <RecommendationBundle controller={controller} onAddToCart={(items)=> console.log("need to add these to the platform cart", items)}  title={parameters?.title} />;
});
```


<!-- TODO: Add Email Recommendations Section -->