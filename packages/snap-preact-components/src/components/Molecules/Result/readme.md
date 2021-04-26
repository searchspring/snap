## Result

Renders a single product card. Highly customizable between all the optional props, and sub components used.  

## Components Used
- Badge
- Price
- Image

## Usage

Default
```jsx
    <Result result={controller?.store?.results[0]}  />
```

List View
```jsx
    <Result result={controller?.store?.results[0]} layout='list' />
```

Hide Sections 

```jsx 
    <Result result={controller?.store?.results[0]} hideBadge={true} hideTitle={true} hidePricing={true}/>
```