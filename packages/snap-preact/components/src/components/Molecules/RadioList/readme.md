# RadioList

Renders a list of options with radio inputs.

## Sub-components
- Radio

## Usage

### options
The required `options` prop specifies an array of Option Objects to be rendered.

```jsx
<RadioList options={store.options} />
```

### native
The `native` prop will use native html `<input type='radio'>` elements.

```jsx
<RadioList options={store.options} native={true} />
```

### hideRadios
The `hideRadios` prop will disable the option radio elements from rendering.

```jsx
<RadioList options={store.options} hideRadios={true} />
```

### hideLabels
The `hideLabels` prop will disable the option label elements from rendering.

```jsx
<RadioList options={store.options} hideLabels={true} />
```

### hideIcons
The `hideIcons` prop will disable the option icon elements from rendering.

```jsx
<RadioList options={store.options} hideIcons={true} />
```

### titleText
The `titleText` prop is will render a title element

```jsx
<RadioList options={store.options} titleText={'Per Page'} />
```

### hideTitleText
The `hideTitleText` prop is will hide the title text.

```jsx
<RadioList options={store.options} titleText={'Per Page'} hideTitleText={true} />
```

### disabled
The `disabled` prop will put the inputs in a disabled state.

```jsx
<RadioList options={store.options} disabled={true} />
```

### selected
The `selected` prop specifies the currently selected Option object. 

```jsx
<RadioList options={store.pagination.pageSizeOptions} selected={store.pagination.pageSize} />
```

### Events

#### onSelect
The `onSelect` prop allows for a custom callback function for when a selection has been made.

```jsx
<RadioList options={store.sorting.options} onSelect={(e, option)=>{console.log(e, option)}} />
```
