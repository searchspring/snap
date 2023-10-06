# SortBy

Renders a Select dropdown or a RadioSelect, to be used with the SearchSortingStore for setting the current sorting. 

## Sub-components
- Select
- RadioSelect

## Usage

### sorting
The `sorting` prop specifies an reference to the SearchSortingStore.

```jsx
<SortBy sorting={controller.store.sorting} />
```

### controller
The `controller` prop specifies an reference to the Search Controller.

```jsx
<SortBy controller={controller} />
```

### label
The `label` prop specifies an label to render as the title.

```jsx
<SortBy controller={controller} label={'Sort By'}/>
```

### type
The `type` prop specifies which type of SortBy component to render. You can choose from 1 of 3 options - "Dropdown" | "List" | "Radio".
By default "Dropdown" is used. and will render a dropdown using the Select component. "Radio" will render a RadioSelect component, and "List" will render a RadioSelect component with radios disabled.

```jsx
<SortBy controller={controller} type={'Radio'} label={'Sort By'}/>
```
