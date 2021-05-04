## Price

Renders an Overlay. Typically used to blur the background with a foreground element such as a modal or slideout menu.

## Usage

### active
The required `active` prop specifies when to render the component.

```jsx
<Overlay active={true} />
```

### color
The optional `color` prop specifies the color of the overlay

```jsx
<Overlay active={true} color={'rgba(0,0,0,0.8)'}/>
```

### transitionSpeed
The optional `transitionSpeed` prop specifies animation transition speed.

```jsx
<Overlay active={true} transitionSpeed='0.5s'/>
```

### Events

#### onClick
Callback function when overlay is clicked.

```jsx
<Overlay active={true} onClick={(e)=>{console.log(e)}} />
```
