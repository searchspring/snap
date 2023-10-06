# RadioSelect

Renders a list of options with radio inputs.

## Sub-components
- Icon

## Usage

### options
The required `options` prop specifies an array of Option Objects to be rendered.

```jsx
<RadioSelect options={store.options} />
```

### native
The `native` prop will use native html `<input type='radio'>` elements.

```jsx
<RadioSelect options={store.options} native={true} />
```

### hideRadios
The `hideRadios` prop will disable the radio elements from rendering.

```jsx
<RadioSelect options={store.options} hideRadios={true} />
```

### titleText
The `titleText` prop is will render a title element

```jsx
<RadioSelect options={store.options} titleText={'Per Page'} />
```

### disabled
The `disabled` prop will put the inputs in a disabled state.

```jsx
<RadioSelect options={store.options} disabled={true} />
```

### selected
The `selected` prop specifies the currently selected Option object. 

```jsx
<RadioSelect options={store.options} selected={store.pagination.pageSize} />
```

### Events

#### onSelect
The `onSelect` prop allows for a custom callback function for when a selection has been made.

```jsx
<RadioSelect options={store.sorting.options} onSelect={(e, option)=>{console.log(e, option)}} />
```
