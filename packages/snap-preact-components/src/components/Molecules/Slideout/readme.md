## Slideout

Designed for mobile menu slide outs, but could be used for anything. Pass your own buttonContent and children. Optional props for color & transition speed for the `<Overlay>` component, as well as displayAt and width to make this component flexible for most situations. 

## Additional Info
When using the custom buttonContent prop, render the slideOut component where you want the button to render. The slide out menu position is fixed, so the location of the component is only for the render location of the open button. 

## Components Used
- Overlay

## Usage

Default
```jsx
<Slideout active={true}>
    <div>Hello World</div>
</Slideout>
```

Custom open button
```jsx
<Slideout active={true} buttonContent={'click me'}>
    <div>Hello World</div>
</Slideout>
```