# Dropdown

Renders a button and content. Clicking the button toggles content visibility. Typically used as an alternative to a `<select>` dropdown or to collapse content. By default any clicks outside of the element will hide the content.

## Usage

### content
The `content` prop specifies the dropdown contents. This can be a string or a JSX element.

```jsx
<Dropdown content={"Hello World!"} />
```
 
Or alternatively as children:

```jsx
<Dropdown>Hello World!</Dropdown>
```

### button
The `button` prop specifies the dropdown button. This button toggles the visibility of the content when clicked. This can be a string or a JSX element.

```jsx
<Dropdown button={'click me!'}>Hello World!</Dropdown>
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

#### onToggle
The `onToggle` prop allows for a custom callback function for when the dropdown visibility is toggled. This only applies if using internal state. Cannot be used with the `open` prop.

```jsx
<Dropdown onToggle={(e)=>{console.log(e)}} >Hello World!</Dropdown>
```
