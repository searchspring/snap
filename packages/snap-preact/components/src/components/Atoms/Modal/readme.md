# Modal

Renders a button and a modal. Clicking the button toggles modal visibility. By default any clicks outside of the modal will hide the content.

## Usage

### content
The `content` prop specifies the modal contents. This can be a string or a JSX element. The Modal component also passes the current open state to the JSX component under the prop showContent: boolean. 

```jsx
<Modal content={"Hello World!"} />
```
 
Or alternatively as children:

```jsx
<Modal>Hello World!</Modal>
```

Note you can only render either the content, or the children, if both are passed in, it will default to the content prop. 


### button
The `button` prop specifies the Modal trigger button. This button toggles the visibility of the modal when clicked. This can be a string or a JSX element.

```jsx
<Modal button={'click me!'}>Hello World!</Modal>
```

or alternatively you can use the `buttonSelector` prop 

### buttonSelector
The `buttonSelector` prop allows you to define a selector that identifies an element to listen for click events, which will trigger the modal to open.

```jsx
<Modal buttonSelector={'#someExistingButton'}>Hello World!</Modal>
```

### open
The `open` prop sets the modal visibility state. 

If specified, external state management is expected. Otherwise if not specified, the component will use its own internal state to toggle the visibility.

```jsx
<Modal open={true}>Hello World!</Modal>
```

### startOpen
The `startOpen` prop sets the modal initial internal state. Cannot be used with the `open` prop.

```jsx
<Modal startOpen>Hello World!</Modal>
```

### disabled
The `disabled` prop will disable the button from toggling the visibility of the modal content, as well as preventing the `onClick` callback from being invoked.

```jsx
<Modal disabled>Hello World!</Modal>
```

### disableA11y
The `disableA11y` prop specifies a boolean to disable the autoset ally properties.

```jsx
<Modal disableA11y>Hello World!</Modal>
```

### disableOverlay
The `disableOverlay` prop will disable the modal contents from being rendered as an overlay. If set to `true`, modal contents will instead be rendered as a block and affect the height of its parent element. Typically used if Modal is intended to act as a header (ie. Facet)

```jsx
<Modal disableOverlay>Hello World!</Modal>
```

### disableClickOutside
The `disableClickOutside` prop by default is `false`. Setting this to `true` will not close the modal if a click event was registered outside the modal content.

```jsx
<Modal disableClickOutside>Hello World!</Modal>
```

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when the modal button is clicked.

```jsx
<Modal onClick={(e)=>{console.log(e)}} >Hello World!</Modal>
```

#### onToggle
The `onToggle` prop allows for a custom callback function for when the modal visibility is toggled. This only applies if using internal state. Cannot be used with the `open` prop.

```jsx
<Modal onToggle={(e)=>{console.log(e)}} >Hello World!</Modal>
```
