# RecommendationBundleList

Renders a recommended bundle of products with seed, recommendations in list form, and add to cart display.

## Sub-components
- RecommendationBundle

### controller
The required `controller` prop specifies a reference to the RecommendationController

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} />
```

### onAddToCart 
the `onAddToCart` prop sets a the callback function for when a add to cart button is clicked. This function will be passed an array of selected item ids and their quantities. 

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} />
```

### results
The `results` prop specifies a reference to the results store array to use instead of the default `controller.store.results`. Note the first result will be displayed as the `seed` product. 

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} results={controller.store.results} />
```

### title
The `title` prop specifies the bundle title

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} title={'Recommended Bundle'} />
```

### resultComponent
The `resultComponent` prop allows for a custom result component to be rendered. This component will be passed the following props -

```jsx
	{ 
		result: Product, 
		seed: boolean, 
		selected: boolean, 
		onProductSelect: (result:Product) => void
	}
```

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} resultComponent={<ResultSlot />} />
```


### hideSeed
The `hideSeed` prop specifies if the seed result should be rendered or not.  

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} hideSeed={true} />
```

### hideSeedText
The `hideSeedText` prop specifies if the seed result text should be rendered or not.  

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} hideSeedText={true} />
```


### hideCheckboxes
The `hideCheckboxes` prop specifies if the result checkboxes should be rendered or not.  

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} hideCheckboxes={true} />
```

### ctaButtonText
The `ctaButtonText` prop specifies the inner text to render in the add to cart button.

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonText={'Add Bundle'} />
```

### ctaButtonSuccessText
The `ctaButtonSuccessText` prop specifies text to temporarily render in the add to cart button after it is clicked.

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonSuccessText={'Thanks for Shopping!'} />
```

### ctaButtonSuccessTimeout
The `ctaButtonSuccessTimeout` prop specifies number of ms to show success text in add to cart button before reverting back to normal text

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonSuccessTimeout={1500} />
```

### ctaSlot
The `ctaSlot` prop allows for a custom add to cart cta component to be rendered. This component will be passed the following props -

```jsx	
	{ 
		cartStore: CartStore;
		onclick: (e:any) => void
	}
```

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaSlot={<CTASlot />} />
```

### limit
The `limit` prop limits the number of results rendered

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} limit={5} />
```

### separatorIcon
The `separatorIcon` prop specifies the icon to render between products. Takes an object with `Icon` component props or a string.     

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} separatorIcon={'cog'} />
```

### separatorIconSeedOnly
The `separatorIconSeedOnly` prop specifies if the seperator Icon should only be rendered after the seed or after every product.     

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} separatorIconSeedOnly={true} />
```

### preselectedCount
The `preselectedCount` prop specifies how many products in the bundle will be preselected. This number will include the seed. Example `preselectedCount={3}` would be `seed` + 2 preselected items. If not provided, this will default to however many products are initially visible. 

```jsx
<RecommendationBundleList controller={controller} onAddToCart={(e, items)=>{console.log(items)}} preselectedCount={4} />
```

### lazyRender 
The `lazyRender` prop specifies an object of lazy rendering settings. The settings include an `enable` toggle (defaults to `true`) as well as an `offset` (default `"10%"`) to specify at what distance the component should start rendering relative to the bottom of the viewport.

```jsx
const customLazyRenderProps = {
	enabled: true,
	offset: "20px" // any css margin values accepted - px, %, etc...
}

<RecommendationBundleList controller={controller} lazyRender={ customLazyRenderProps } onAddToCart={(e, items)=>{console.log(items)}} />
```

