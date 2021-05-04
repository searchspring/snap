## Dropdown

Renders a button and content. Clicking the button toggles content visibility. Typically used as an alternative to a `<select>` dropdown or to collapse content.

## Usage

### Content
Dropdown contents can be provided in the `content` prop. This can be a string or a JSX element.

``` jsx
<Dropdown content={"Hello World!"} />
```
 
Or alternatively as children:

``` jsx
<Dropdown>Hello World!</Dropdown>
```

### Button
The dropdown will render a button to toggle the visibility of the content. The `button` prop allows for a string or a JSX Element

``` jsx
<Dropdown button={'click me!'}>Hello World!</Dropdown>
```

### Open
If the `open` prop is provided, it is expected that you will be managing the state of the dropdown. Otherwise if not present, the component will use its own state to toggle the visibility of the dropdown content.

``` jsx
<Dropdown open={true}>Hello World!</Dropdown>
```

### startOpen
The `startOpen` prop sets the dropdown initial internal state. Cannot be used with the `open` prop.

``` jsx
<Dropdown startOpen={true}>Hello World!</Dropdown>
```

### Disabled
The `disabled` prop will disable the button from toggling the visibility of the dropdown content, as well as preventing the `onClick` callback from being invoked.

``` jsx
<Dropdown disabled={true}>Hello World!</Dropdown>
```

### disableClickOutside
The `disableClickOutside` prop by default is `false`. Setting this to `true` will not close the dropdown if a click event was registered outside the dropdown content.

``` jsx
<Dropdown disableClickOutside={true}>Hello World!</Dropdown>
```

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when the dropdown button is clicked

``` jsx
<Dropdown onClick={(e)=>{console.log(e)}} >Hello World!</Dropdown>
```
#### onToggle
The `onToggle` prop allows for a custom callback function for when the dropdown visibility is toggled. This only applies if using internal state. Cannot be used with the `open` prop.

``` jsx
<Dropdown onToggle={(e)=>{console.log(e)}} >Hello World!</Dropdown>
```
