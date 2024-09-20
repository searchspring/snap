# Facet Slider

Renders a slider to be used with any slider facet. Built using [react-ranger](https://github.com/tannerlinsley/react-ranger).

## Usage

### facet
The required `facet` prop specifies a reference to a facet within the facets store array. The facet must be a range facet (`display` type of `'slider'`).

```jsx
<FacetSlider facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} />
```

### showTicks
The `showTicks` prop will render reference ticks below the slider track.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	showTicks={true}
/>
```

### tickSize
The `tickSize` prop specifies the unit number between ticks. Must be used with `showTicks` prop.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	showTicks={true}
	tickSize={20}
/>
```

### tickTextColor
The `tickTextColor` prop specifies ticks text color. Must be used with `showTicks` prop.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	showTicks={true}
	tickTextColor={'#cccccc'}
/>
```

### handleColor
The `handleColor` prop specifies the handle color.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	handleColor={'#0000ff'}
/>
```

### stickyHandleLabel
The `stickyHandleLabel` prop specifies if the handle value text should display above each handle.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	stickyHandleLabel={true}
/>
```

### handleDraggingColor
The `handleDraggingColor` prop specifies the handle color while dragging.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	handleDraggingColor={'0000ff'}
/>
```

### valueTextColor
The `valueTextColor` prop specifies the value text color.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	valueTextColor={'#222222'}
/>
```

### trackColor
The `trackColor` prop specifies the slider track (background) color.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	trackColor={'#cccccc'}
/>
```

### railColor
The `railColor` prop specifies the slider rail (foreground) color.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	railColor={'#0000ff'}
/>
```

### Events

#### onChange
The `onChange` prop allows for a custom callback function for when a slider handle has been changed.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	onChange={(values)=>{ console.log(`low: ${values[0]} high: ${values[1]}`) }}
/>
```

#### onDrag
The `onDrag` prop allows for a custom callback function for when a slider handle is being dragged.

```jsx
<FacetSlider 
	facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
	onDrag={(values)=>{ console.log(`low: ${values[0]} high: ${values[1]}`) }}
/>
```
