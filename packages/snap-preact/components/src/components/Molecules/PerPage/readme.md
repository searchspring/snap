# PerPage

Renders a select dropdown or a RadioSelect to be used with the pagination store, for setting the page size.

## Sub-components
- Select
- List
- RadioList

## Usage

### pagination
The `pagination` prop specifies an reference to the SearchPaginationStore.

```jsx
<PerPage pagination={controller.store.pagination} />
```

### controller
The `controller` prop specifies an reference to the Search Controller.

```jsx
<PerPage controller={controller} />
```

### label
The `label` prop specifies an label to render as the title.

```jsx
<PerPage controller={controller} label={'Sort By'}/>
```

### type
The `type` prop specifies which type of PerPage component to render. You can choose from 1 of 3 options - "Dropdown" | "List" | "Radio".
By default "Dropdown" is used. and will render a dropdown using the Select component. "Radio" will render a RadioSelect component, and "List" will render a RadioSelect component with radios disabled.

```jsx
<PerPage controller={controller} type={'Radio'} label={'Sort By'}/>
```


