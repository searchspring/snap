# Button

Renders a native or custom button.

## Usage
```jsx
import { Button } from '@searchspring/snap-preact-components';
```

### content
The `content` prop specifies the button text. This can be a string or a JSX element.

```jsx
<Button content={"click me!"} />
```
 
Or alternatively as children:

```jsx
<Button>click me!</Button>
```

### disabled
The `disabled` prop will disable the button from being clickable.

```jsx
<Button content={"click me!"} disabled />
```

### native
The `native` prop will use a native html `<button>` element.

```jsx
<Button content={"click me!"} native />
```

### backgroundColor
The `backgroundColor` prop specifies the button background color.

```jsx
<Button content={"click me!"} backgroundColor={'#eeeeee'} />
```

### borderColor
The `borderColor` prop specifies the button border color.

```jsx
<Button content={"click me!"} borderColor={'#cccccc'} />
```
### color
The `color` prop specifies the button text color.

```jsx
<Button content={"click me!"} color={'#222222'} />
```

### disableA11y
The `disableA11y` prop specifies a boolean to disable the autoset ally properties.

```jsx
<Button content={"click me!"} disableA11y />
```

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when the button is clicked.

```jsx
<Button content={"click me!"} onClick={(e)=>{console.log(e)}} />
```
