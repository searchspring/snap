# List

Renders a list of options.

## Sub-components
- Checkbox

## Usage

### options
The required `options` prop specifies an array of Option Objects to be rendered.

```jsx
<List options={store.options} />
```

### hideCheckbox
The `hideCheckbox` prop will disable the checkbox elements from rendering.

```jsx
<List options={store.options} hideCheckbox={true} />
```

### titleText
The `titleText` prop is will render a title element

```jsx
<List options={store.options} titleText={'Per Page'} />
```

### disabled
The `disabled` prop will put the inputs in a disabled state.

```jsx
<List options={store.options} disabled={true} />
```

### selected
The `selected` prop specifies the currently selected Option object. 

```jsx
<List options={store.options} selected={store.pagination.pageSize} />
```

### Events

#### onSelect
The `onSelect` prop allows for a custom callback function for when a selection has been made.

```jsx
<List options={store.sorting.options} onSelect={(e, option)=>{console.log(e, option)}} />
```
