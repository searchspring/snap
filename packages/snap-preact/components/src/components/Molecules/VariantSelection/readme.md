# Variant Selection

Renders an variant selection component to be used with a VariantSelection on the searchResultStore.

The variantSelection can be rendered as 3 different types, Dropdown, List, or Swatches.

## Components Used
- Dropdown
- List
- Swatches

## Usage

### selection
The required `selection` prop specifies a reference to the searchResultStores VariantSelection. 

```jsx
<VariantSelection selection={VariantSelection} />
```

### type
The optional `type` prop specifies what type of selection you wish to render. Options are `dropdown`, `list`, or `swatches`, with `dropdown` being the default.

```jsx
<VariantSelection selection={VariantSelection} type={'swatches'} />
```