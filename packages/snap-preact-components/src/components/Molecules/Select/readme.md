## Select

Renders a native or custom select dropdown.

## Sub-components
- Button
- Dropdown 
- Icon

## Usage

### options
The required `options` prop specifiesan array of Option Objects to be rendered.

```jsx
<Select options={controller.store.sorting.options} native={true} />
```

#### Option object

```typescript
{
    label: 'Price',
    value: 'asc'
}
```

### native
The `native` prop will use a native html `<select>` element.

```jsx
<Select options={controller.store.sorting.options} native={true} />
```

### disabled
The `disabled` prop will disable the select from being toggled or invoking the `onSelect` callback.

```jsx
<Select options={controller.store.sorting.options} disabled={true} />
```

### label
The `label` prop specifiesthe label for this select. This can be a string or JSX element.

```jsx
<Select options={controller.store.sorting.options} label={'Sort By'} />
```

### separator
The `separator` prop is rendered between the `label` prop and the select dropdown. This can be a string or JSX element.

```jsx
<Select options={controller.store.sorting.options} label={'Sort By'} separator={': '} />
```

### selected
The `selected` prop specifiesthe currently selected Option object. Specifying this prop relies on external state management.

```jsx
<Select options={controller.store.sorting.options} selected={controller.store.sorting.options[0]} />
```

### startOpen
The `startOpen` prop will render the dropdown in an open state on the initial render.

```jsx
<Select options={controller.store.sorting.options} startOpen={true} />
```

### stayOpenOnSelection
The `stayOpenOnSelection` prop will not close the dropdown upon making a selection.

```jsx
<Select options={controller.store.sorting.options} stayOpenOnSelection={true} />
```

### hideLabelOnSelection
The `hideLabelOnSelection` prop will prevent the `label` and `separator` from being rendered upon making a selection.

```jsx
<Select options={controller.store.sorting.options} label={'Sort By'} separator={': '} hideLabelOnSelection={true} />
```

### clearSelection
The `clearSelection` prop accepts a string value to display as the option that will clear the current selection.

```jsx
<Select options={controller.store.sorting.options} clearSelection={'clear'} />
```

### disableClickOutside
The `disableClickOutside` prop by default is `false`. Setting this to `true` will not close the dropdown if a click event was registered outside the dropdown content.

```jsx
<Select options={controller.store.sorting.options} disableClickOutside={true} />
```

### color
The `color` prop sets the dropdown border, text, button, and icon colors.

```jsx
<Select options={controller.store.sorting.options} color={'#222222'} />
```

### borderColor
The `borderColor` prop overwrites the `color` prop for the dropdown and button border color.

```jsx
<Select options={controller.store.sorting.options} color={'#222222'} borderColor={'#cccccc'} />
```

### backgroundColor
The `backgroundColor` prop sets the background color of the dropdown and button.

```jsx
<Select options={controller.store.sorting.options} backgroundColor={'#ffffff'} />
```

### iconColor
The `iconColor` prop sets the icon color and overwrites the `color` prop.

```jsx
<Select options={controller.store.sorting.options} iconColor={'#222222'} />
```

### iconClose
The `iconClose` prop is the name of the icon to render when the dropdown is in its open state.

```jsx
<Select options={controller.store.sorting.options} iconClose={'angle-down'} />
```

### iconOpen
The `iconOpen` prop is the name of the icon to render when the dropdown is in its closed state.

```jsx
<Select options={controller.store.sorting.options} iconOpen={'angle-up'} />
```

### Events

#### onSelect
The `onSelect` prop allows for a custom callback function for when a selection has been made.

```jsx
<Select options={controller.store.sorting.options} onSelect={(e)=>{console.log(e)}} />
```
