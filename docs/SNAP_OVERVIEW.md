# Overview

Snap is built using the Model View Controller (MVC) pattern internally. When constructing an instance of the `Snap` class, the configuration object that is provided contains all the controllers that the project will use and where they will be rendered on the page. Each controller can be configured with various settings and custom functionallity can be implemented via middleware to tie into the search lifecycle.

Each controller contains a `controller.search()` method that is used to trigger a search to Searchspring API with parameters derived from the `controller.urlManager` state. A urlManager contains the state of the url (query and hash paramters), or in the case of Autocomplete, Recommendations, and Finder, is detached from the url and contains it's own state.

Data that is returned from the API is then stored in each controller's `controller.store`. The data schema is unique to each controller type (Search, Autocomplete, Recommendations, Finder) 

A root level Preact component is rendered to the target selector(s) for each controller. The component will contain a reference to the controller via `props.controller`. Data from `props.controller.store` can then be rendered within the component and sub-components and will be reactive to changes in the store.

Links attached to facet values, pagination, sort by, etc.. that are clicked will update the urlManager state and trigger a new search and re-render of the component.


Let's create the bare minimum configuration to create a search controller and render a root level `Content` component to the page.

```ts
// src/index.ts

const snap = new Snap({
    client: {
		globals: {
			siteId: 'abc123',
		},
	},
    controllers: {
        search: [
            {
                config: {
                    id: 'search',
                },
                targeters: [
                    {
                        selector: '#searchspring-content',
                        component: async () => {
                            return (await import('./components/Content/Content')).Content;
                        },
                    },
                ],
            },
        ],
    },
});
```

Let's go over our `Content` component. This is considered a root level component since it is being rendered onto the page using a targeter.

We'll want to create a `ControllerProvider` such that any subcomponents can have a reference to the controller via its props. The [@searchspring/snap-preact-components](https://github.com/searchspring/snap/tree/main/packages/snap-preact-components) package contains a `ControllerProvider` that we can utilize.

```tsx
// src/components/Content/Content.tsx

import { observer } from 'mobx-react';
import { withController, InlineBanner, Result } from '@searchspring/snap-preact-components';

export const Content = observer((props: { controller: SearchController }) => {
    const { controller } = props;

    return controller.store.loaded ? (
        <ControllerProvider controller={controller}>
            <Results />
        </ControllerProvider>
    ) : null;
});
```

Then from any subcomponent such as the `Results` component in this example, we'll need to add the `withController` higher order component to access our controller via props and it should be placed before any other decorators/HOCs. 

Finally, we'll want to add the `observer` higher order component to make it reactive to changes in the store.

```tsx
// src/components/Content/Content.tsx

const Results = withController(observer((props) => {
    const { controller } = props;

    return (
        <ul class="ss__results">
            {controller.store.results.map((result) => (
                <li class="ss__result" key={result.id}>
                    {{
                        banner: <InlineBanner banner={result} />,
                    }[result.type] || <Result result={result} />}
                </li>
            ))}
        </ul>
    );
}));
```
