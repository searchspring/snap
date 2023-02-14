# Slideout

Renders a slideout with a background overlay. Typically used for a mobile menu slideout. 

## Sub-components
- Overlay

## Usage

### buttonContent
The `buttonContent` prop accepts a string or JSX element to render a clickable button that toggles the slideout visibility. 

When using the `buttonContent` prop, render the component where you want the button to render. The slideout content position is fixed, therefore, the location of the component is only for the render location of the button itself. 

```jsx
<Slideout buttonContent={'click me'}>
	<div>slideout content</div>
</Slideout>
```

### children
The children provided to the component will be displayed within the slideout - the slideout content. When using a component here, it will be passed additional props (`active` and `toggleActive`) from the slideout component which can be used for referencing and toggling of the `active` state.

```jsx
<Slideout buttonContent={'click me'}>
	<span>slideout content (children)</span>
</Slideout>
```

```jsx
const SlideoutContent = (props) => {
	return (
		<div>
			<button onClick={() => props.toggleActive()}>close slideout</button>
			<div>the slideout is { props.active ? 'open' : 'closed' }</div>
		</div>
	)
}

<Slideout buttonContent={'click me'}>
	<SlideoutContent />
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
The `slideDirection` prop sets the direction that the overlay slides in. Defaults to `left`. Available values are `left`, `right`, `top`, & `bottom`.

```jsx
<Slideout slideDirection={'right'}>
	<div>slideout content</div>
</Slideout>
```

### noButtonWrapper
The `noButtonWrapper` prop prevents the button wrapper div with className of `ss__slideout__button` from rendering. This element normally wraps `buttonContent` and handles toggling the `active` state via an onClick handler. By utilizing this prop, toggling of the `active` state must instead happen within the component passed into `buttonContent`. The `buttonContent` component will be passed additional props (`active` and `toggleActive`) from the slideout component which can be used for referencing and toggling of the `active` state.

```jsx

const ButtonComponent = (props) => {
	return (
		<div onClick={() => props.toggleActive()}>
			Button to Toggle the Slideout
		</div>
	)
}

<Slideout buttonContent={<ButtonComponent/>} noButtonWrapper>
	<div>slideout content</div>
</Slideout>
```

### active
The `active` prop is an optional way to specify the initial state of the slideout when rendered. It is recommended to let the component manage its own state internally by not using this prop.

```jsx
<Slideout active={true}>
	<div>Hello World</div>
</Slideout>
```