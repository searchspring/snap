## Checkbox

Renders a native or custom checkbox.

## Sub-components
- Icon

## Usage

### native
The `native` prop will render an `<input type='checkbox'>` element.

```jsx
<Checkbox native={true} />
```

### checked
The `checked` prop allows for external state management. Otherwise if not provided, the component will use its own internal state.

```jsx
<Checkbox checked={true} />
```

### startChecked
The `startChecked` prop sets the checkbox to be checked on the initial render. Must use internal state by not using the `checked` prop.

```jsx
<Checkbox startChecked={true} />
```

### disabled
The `disabled` prop disables the checkbox from being toggled or invoking the `onClick` callback.

```jsx
<Checkbox disabled={true} />
```

### size
The `size` prop will set the custom checkbox size.

```jsx
<Checkbox size={'16px'} />
```

### color
The `color` prop sets the checkbox border color and the icon color if the `iconColor` prop is not set.

```jsx
<Checkbox color={'#ffff00'} />
```

### iconColor
The `iconColor` prop sets the icon color and overwrites the `color` prop. It will not affect checkbox border color.

```jsx
<Checkbox iconColor={'#ffff00'} />
```
### icon
The `icon` prop specifies an object with `Icon` component props. This only applies if using a custom checkbox `native={false}`.


### Events

#### onClick
The `onClick` prop allows for a custom callback function for when the checkbox is clicked.

```jsx
<Checkbox onClick={(e)=>{console.log(e)}} />
```
