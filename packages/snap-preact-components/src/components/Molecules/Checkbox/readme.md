## Checkbox

Renders a native or custom checkbox.

Custom checkbox renders consists of a span with an `Icon` sub component to create a customizable checkbox.


## Sub Components
- Icon: only if `native={false}`


## Usage

### native
The `native` prop will render an `<input type='checkbox'>` element.

```jsx
<Checkbox native={true} />
```

### checked
The `checked` prop allows for external state management. Otherwise if not provided, component will use its own internal state.

```jsx
<Checkbox checked={true} />
```

### startChecked
The `startChecked` prop will set checkbox to checked on initial render. Must use internal state by not using `checked` prop

```jsx
<Checkbox startChecked={true} />
```

### disabled
The `disabled` prop will disable the checkbox from being toggled or invoking the `onClick` callback

```jsx
<Checkbox disabled={true} />
```

### size
The `size` prop will set the custom checkbox size.

```jsx
<Checkbox size={'16px'} />
```

### color
The `color` prop sets the checkbox border color and the icon color if `iconColor` is not set

```jsx
<Checkbox color={'#ffff00'} />
```

### iconColor
The `iconColor` prop sets the icon color and overwrites `color` prop. Will not affect checkbox border color.

```jsx
<Checkbox iconColor={'#ffff00'} />
```
### icon
The `icon` prop contains an object with `Icon` component props. This only applies if using a custom checkbox `native={false}`


### Events

#### onClick
Callback function when checkbox is clicked.

```jsx
<Checkbox onClick={(e)=>{console.log(e)}} />
```
