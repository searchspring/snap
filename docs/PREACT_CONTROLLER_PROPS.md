## Controller Props

For each targeted element, the corresponding controller that created it will be passed along to the component via the `controller` prop.

Lets go over our `Content` component. This is considered a root level component since it is being rendered onto the page using a targeter.

We'll want to create a `ControllerProvider` such that any subcomponents can have a reference to the controller via its props (as long as it is using the cooresponding `withController` consumer). The [@searchspring/snap-preact-components](https://github.com/searchspring/snap/tree/main/packages/snap-preact-components) package contains a `ControllerProvider` that we can utilize.


```jsx
import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';
import { ControllerProvider } from '@searchspring/snap-preact-components';
import { Results, NoResults } from './Results';

@observer
export class Content extends Component {
	render() {
		const controller = this.props.controller;

		return (
			controller.store.loaded && (
				<ControllerProvider controller={controller}>
					{
						controller.store.pagination.totalResults > 0 ? (<Results />) : (<NoResults />)
					}
				</ControllerProvider>
			)
		);
	}
}
```

Then from any subcomponent such as the `Result` component in this example, we'll need to add the `@withController` decorator to access our controller via props. The `@withController` decorator should be placed before any other decorators.

```jsx
import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';
import { withController, InlineBanner, Result } from '@searchspring/snap-preact-components';

@withController
@observer
export class Results extends Component {
	render() {
		const controller = this.props.controller;
		const { results } = controller.store;

		return (
			<ul class="ss__results">
				{results.map((result) => (
					<li class="ss__result" key={result.id}>
						{{
							banner: <InlineBanner banner={result} />,
						}[result.type] || <Result result={result} />}
					</li>
				))}
			</ul>
		);
	}
}
```


## Reactivity 

Each controller has a `store` property. This is a MobX store created from the core [@searchspring/snap-store-mobx](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx) package and we will be rendering its data in our components. 

The MobX store contains many observable properties that are reactive to changes such as user interaction (ie. collapsing a facet) or fetching data (ie. pagination). In order to react to these store changes the `@observer` decorator must be added to our components.

If you are creating functional components you would use this as a function wrapping your component.

```jsx
import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';
import { withController, InlineBanner, Result } from '@searchspring/snap-preact-components';

export const Results = observer(withController((props) => {
	const controller = props.controller;
	const { results } = controller.store;

		return (
			<ul class="ss__results">
				{results.map((result) => (
					<li class="ss__result" key={result.id}>
						{{
							banner: <InlineBanner banner={result} />,
						}[result.type] || <Result result={result} />}
					</li>
				))}
			</ul>
		)
}));
```