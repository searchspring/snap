# Dropdown

Renders a button and content. Clicking the button toggles content visibility. Typically used as an alternative to a `<select>` dropdown or to collapse content. By default any clicks outside of the element will hide the content.

## Usage

### content
The `content` prop specifies the dropdown contents. This can be a string or a JSX element. The Dropdown component also passes the current open state to the JSX component under the prop showContent: boolean. 

```jsx
<Dropdown content={"Hello World!"} />
```
 
Or alternatively as children:

```jsx
<Dropdown>Hello World!</Dropdown>
```

Note you can only render either the content, or the children, if both are passed in, it will default to the content prop. 


### button
The `button` prop specifies the dropdown button. This button toggles the visibility of the content when clicked. This can be a string or a JSX element.

```jsx
<Dropdown button={'click me!'}>Hello World!</Dropdown>
```

### toggleOnHover
The `toggleOnHover` prop controls if hover events (onMouseEnter and onMouseLeave) will toggle the dropdown. This is disabled by default.

```jsx
<Dropdown button={'click me!'} toggleOnHover>Hello World!</Dropdown>
```

### open
The `open` prop sets the dropdown visibility state. 

If specified, external state management is expected. Otherwise if not specified, the component will use its own internal state to toggle the visibility.

```jsx
<Dropdown open={true}>Hello World!</Dropdown>
```

### startOpen
The `startOpen` prop sets the dropdown initial internal state. Cannot be used with the `open` prop.

```jsx
<Dropdown startOpen>Hello World!</Dropdown>
```

### disabled
The `disabled` prop will disable the button from toggling the visibility of the dropdown content, as well as preventing the `onClick` callback from being invoked.

```jsx
<Dropdown disabled>Hello World!</Dropdown>
```

### disableClick
The `disableClick` prop specifies a boolean which will disable the default click behavior; this is useful if you want to only allow for hovering to toggle the state. Be aware that this will cause the dropdown to not work as expected in mobile (where touch events are used).

```jsx
<Dropdown disableClick>Hello World!</Dropdown>
```

### disableA11y
The `disableA11y` prop specifies a boolean to disable the autoset ally properties.

```jsx
<Dropdown disableA11y>Hello World!</Dropdown>
```

### disableOverlay
The `disableOverlay` prop will disable the dropdown contents from being rendered as an overlay. If set to `true`, dropdown contents will instead be rendered as a block and affect the height of its parent element. Typically used if Dropdown is intended to act as a header (ie. Facet)

```jsx
<Dropdown disableOverlay>Hello World!</Dropdown>
```

### disableClickOutside
The `disableClickOutside` prop by default is `false`. Setting this to `true` will not close the dropdown if a click event was registered outside the dropdown content.

```jsx
<Dropdown disableClickOutside>Hello World!</Dropdown>
```

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when the dropdown button is clicked.

```jsx
<Dropdown onClick={(e)=>{console.log(e)}} >Hello World!</Dropdown>
```

#### onMouseEnter
The `onMouseEnter` prop allows for a custom callback function for when the dropdown has been hovered.

```jsx
<Dropdown onMouseEnter={(e)=>{console.log(e)}} >Hello World!</Dropdown>
```

#### onMouseLeave
The `onMouseLeave` prop allows for a custom callback function for when the dropdown has been un-hovered.

```jsx
<Dropdown onMouseLeave={(e)=>{console.log(e)}} >Hello World!</Dropdown>
```

#### onToggle
The `onToggle` prop allows for a custom callback function for when the dropdown visibility is toggled. This only applies if using internal state. Cannot be used with the `open` prop.

```jsx
<Dropdown onToggle={(e)=>{console.log(e)}} >Hello World!</Dropdown>
```
