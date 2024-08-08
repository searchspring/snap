# RecommendationList

Renders a list of product recommendations.

If using children, the provided children elements array length and order must match the results stored in the `controller.store.results` (or `results` prop) to avoid unexpected tracking behaviour.

Any modification to the results array and data are recommended to be made using an `afterSearch` and/or `afterStore` event via the Controller instead of making modifications in the component.


## Sub-components
- Result (default)

## Usage

### controller
The required `controller` prop specifies a reference to the RecommendationController

```jsx
<RecommendationList controller={controller} />
```

### results
The `results` prop specifies a reference to the results store array to use instead of the default `controller.store.results`

If using children, the provided children elements array length and order must match the results stored in the `results` prop to avoid unexpected tracking behaviour.

```jsx
<RecommendationList controller={controller} results={controller.store.results} />
```

### title
The `title` prop specifies the recommendation list  title

```jsx
<RecommendationList controller={controller} title={'Recommended Products'} />
```

### vertical
The `vertical` prop sets the recommendation list direction to vertical.

```jsx
<RecommendationList vertical={true}>{children}<RecommendationList/>
```

### limit
The `limit` prop sets a limit on the number of recommendations to render.

```jsx
<RecommendationList limit={4}>{children}<RecommendationList/>
```

### resultComponent
The `resultComponent` prop allows for a custom result component to be rendered. This component will be passed the following props -

```jsx
	{ 
		result: Product, 
		controller: RecommendationController, 
	}
```

```jsx
<RecommendationList resultComponent={<ResultSlot />}>{children}</RecommendationList>
```