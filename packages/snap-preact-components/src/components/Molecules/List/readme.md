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

### hideLabels
The `hideLabels` prop will disable the option label elements from rendering.

```jsx
<List options={store.options} hideLabels={true} />
```

### hideIcons
The `hideIcons` prop will disable the option icon elements from rendering.

```jsx
<List options={store.options} hideIcons={true} />
```

### requireSelection
The `requireSelection` prop will enable/disable the ability to have no options selected.

```jsx
<List options={store.options} requireSelection={false} />
```

### multiSelect
The `multiSelect` prop will enable/disable the ability to select more than one option at a time.

```jsx
<List options={store.options} multiSelect={true} />
```

### horizontal
The `horizontal` prop will render the list options horizontally.

```jsx
<List options={store.options} horizontal={true} />
```

### native
The `native` prop is a boolean to render unstyled native checkbox elements

```jsx
<List options={store.options} native={true} />
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

### clickableDisabledOptions
The `clickableDisabledOptions` prop will enable the ability to select disabled options.

```jsx
<List options={store.options} clickableDisabledOptions={true} />

### selected
The `selected` prop specifies the currently selected Option object. 

```jsx
<List options={store.pagination.pageSizeOptions} selected={store.pagination.pageSize} />
```

### Events

#### onSelect
The `onSelect` prop allows for a custom callback function for when a selection has been made.

```jsx
<List options={store.sorting.options} onSelect={(e, option)=>{console.log(e, option)}} />
```