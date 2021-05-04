## Slideout

Renders a slideout with a background overlay. Typically used for a mobile menu slideout. 

## Sub Components
- Overlay

## Usage

### active
The required `active` prop contains the state of when the slideout is rendered.

```jsx
<Slideout active={true}>
    <div>Hello World</div>
</Slideout>
```

### children
The children provided to the component is what will be displayed within the slideout. 

```jsx
<Slideout active={true}>
    <div>slideout content</div>
</Slideout>
```

### buttonContent
The `buttonContent` prop accepts a string or JSX element to render a clickable button that toggles the slideout visibility. 

When using the custom `buttonContent` prop, render the component where you want the button to render. The slideout menu's position is fixed, therefore the location of the component is only for the render location of the button. 

```jsx
<Slideout active={true} buttonContent={'Show Filters'}>
    <div>slideout content</div>
</Slideout>
```

### width
The `width` prop is the width of the slideout.

```jsx
<Slideout active={true} width={'300px'}>
    <div>slideout content</div>
</Slideout>
```

### displayAt
The `displayAt` prop contains a CSS media query for when the component will render. By default the component will always render. 

```jsx
<Slideout active={true} displayAt={'(max-width: 600px)'}>
    <div>slideout content</div>
</Slideout>
```

### transitionSpeed
The `transitionSpeed` prop changes the CSS transition speed animation for the slideout and overlay.

```jsx
<Slideout active={true} transitionSpeed={'0.5s'}>
    <div>slideout content</div>
</Slideout>
```


### overlayColor
The `overlayColor` prop sets the overlay color.

```jsx
<Slideout active={true} overlayColor={'rgba(0,0,0,0.7)'}>
    <div>slideout content</div>
</Slideout>
```
