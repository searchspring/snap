## Filter

Uses `<Button/>` & `<Icon />` to create a Selected Filter Button.

## Components Used
- Icon
- Button

## Usage

```jsx
<Filter
    {...args}
    facetLabel={controller?.store?.facets.filter((facet) => facet.type === FacetType.VALUE).shift().label}
    valueLabel={
        controller?.store?.facets
            .filter((facet) => facet.type === FacetType.VALUE)
            .shift()
            .values.shift().value
    }
/>
```

