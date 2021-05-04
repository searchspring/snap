## Slider

Renders a slider to be used with any slider facet. Built using [react-ranger](https://github.com/tannerlinsley/react-ranger).

## Usage

### facet
The required `facet` prop specifies a reference to a facet within the facets store array. The facet must be a range facet (`display` type of `'slider'`).

```jsx
<Slider facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} />
```

### showTicks
The `showTicks` prop will render reference ticks below the slider track.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    showTicks={true}
/>
```

### tickSize
The `tickSize` prop specifies the unit number between ticks. Must be used with `showTicks` prop.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    showTicks={true}
    tickSize={20}
/>
```

### textColor
The `textColor` prop specifies ticks color. Must be used with `showTicks` prop.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    showTicks={true}
    textColor={'#cccccc'}
/>
```

### handleColor
The `handleColor` prop specifies the handle color.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    handleColor={'#0000ff'}
/>
```

### handleTextColor
The `handleTextColor` prop specifies the handle text color.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    handleColor={'#222222'}
/>
```

### trackColor
The `trackColor` prop specifies the slider track (background) color.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    handleColor={'#cccccc'}
/>
```

### railColor
The `railColor` prop specifies the slider rail (foreground) color.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    handleColor={'#0000ff'}
/>
```

### handleDraggingColor
The `handleDraggingColor` prop specifies the handle color while dragging.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    handleDraggingColor={'0000ff'}
/>
```

### Events

#### onChange
The `onChange` prop allows for a custom callback function for when a slider handle has been changed.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    onChange={(values)=>{ console.log(`low: ${values[0]} high: ${values[1]}`) }}
/>
```

#### onDrag
The `onDrag` prop allows for a custom callback function for when a slider handle is being dragged.

```jsx
<Slider 
    facet={controller.store.facets.filter(facet => facet.display === 'slider').pop()} 
    onDrag={(values)=>{ console.log(`low: ${values[0]} high: ${values[1]}`) }}
/>
```
