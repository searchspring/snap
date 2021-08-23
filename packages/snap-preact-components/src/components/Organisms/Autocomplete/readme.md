# Autocomplete

Renders an autocomplete popup that binds to an `<input>` element.

The autocomplete layout renders terms, facets, banners, and results.

## Components Used
- Facet
- Banner
- Results

## Usage

### input
The required `input` prop expects either:

- a string CSS selector that targets `<input>` element(s) to bind to

- an `<input>` element to bind to

```jsx
<Autocomplete controller={controller} input={'#searchInput'} />
```

### controller
The required `controller` prop specifies a reference to the autocomplete controller.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} />
```

### width
The `width` prop specifies a width for the overall component. The default value is '100%'.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} width="800px" />
```

### hideFacets
The `hideFacets` prop specifies if the facets within autocomplete should be rendered.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} hideFacets={true} />
```

### hideTerms
The `hideTerms` prop specifies if the terms within autocomplete should be rendered.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} hideTerms={true} />
```

### breakpoints
The `breakpoints` prop contains a breakpoints object that is passed to the `<Results />` sub-component.

Default Autocomplete `breakpoints` object:

```typescript
const breakpoints = {
    0: {
        columns: 2,
        rows: 1,
    },
    540: {
        columns: 3,
        rows: 1,
    },
    768: {
        columns: 4,
        rows: 1,
    },
    991: {
        columns: 2,
        rows: 2,
    },
};
```

See `<Results />` component documentation for further details.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} breakpoints={breakpoints} />
```
