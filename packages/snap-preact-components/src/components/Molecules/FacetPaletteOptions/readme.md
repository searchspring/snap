## Facet Palette Options

Renders a list of facet color Palette options. Simply renders a `<div>` with background color of the options value. Adjustable columns and gap size. Props to hideLabel or hideIcon. 

## Additional Info
Image support for color swatchs coming soon...

## Components Used
- Icon

## Usage

Default
```jsx
    <FacetPaletteOptions values={sizeFacet.values} />
```

Custom
```jsx
    <FacetPaletteOptions values={sizeFacet.values} hideLabel={true} hideIcon={true} columns={6} gapSize='10px'/>
```
