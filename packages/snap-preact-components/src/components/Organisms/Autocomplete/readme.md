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

### responsive
The `responsive` prop specifiesan object that is passed to the `<Results />` sub-component.

See `<Results />` component documentation for further details.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} responsive={responsive} />
```
