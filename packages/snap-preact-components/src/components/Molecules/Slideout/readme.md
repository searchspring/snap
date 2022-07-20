# Slideout

Renders a slideout with a background overlay. Typically used for a mobile menu slideout. 

## Sub-components
- Overlay

## Usage

### children
The children provided to the component will be displayed within the slideout. 

```jsx
<Slideout>
	<span>slideout content (children)</span>
</Slideout>
```
### active
The `active` prop specifies the initial state of the slideout when rendered.

```jsx
<Slideout active={true}>
	<div>Hello World</div>
</Slideout>
```

### buttonContent
The `buttonContent` prop accepts a string or JSX element to render a clickable button that toggles the slideout visibility. 

When using the custom `buttonContent` prop, render the component where you want the button to render. The slideout menu's position is fixed, therefore the location of the component is only for the render location of the button. 

```jsx
<Slideout buttonContent={'Show Filters'}>
	<div>slideout content</div>
</Slideout>
```

### width
The `width` prop is the width of the slideout.

```jsx
<Slideout width={'300px'}>
	<div>slideout content</div>
</Slideout>
```

### displayAt
The `displayAt` prop specifies a CSS media query for when the component will render. By default, the component will always render. 

```jsx
<Slideout displayAt={'(max-width: 600px)'}>
	<div>slideout content</div>
</Slideout>
```

### transitionSpeed
The `transitionSpeed` prop changes the CSS transition speed animation for the slideout and overlay.

```jsx
<Slideout transitionSpeed={'0.5s'}>
	<div>slideout content</div>
</Slideout>
```


### overlayColor
The `overlayColor` prop sets the overlay color.

```jsx
<Slideout overlayColor={'rgba(0,0,0,0.7)'}>
	<div>slideout content</div>
</Slideout>
```


### slideDirection
The `slideDirection` prop sets the direction that the overlay slides in. Defaults to `left`.

```jsx
<Slideout slideDirection={'right'}>
	<div>slideout content</div>
</Slideout>
```

