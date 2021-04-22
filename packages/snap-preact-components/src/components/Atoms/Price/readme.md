## Overlay

Renders an span with a formatted number. Essentially a pricing shortcut for the FormattedNumber Component.

## Additional Info

Uses the Currency function from the Snap ToolBox (https://github.com/searchspring/snap-toolbox/blob/main/filters/src/currency.ts) 

## Usage

Default
```jsx
    <Price value={1099.99} />
```

Custom Pricing
```jsx
    <Price value={1099.99} symbol=' €' lineThrough={true} thousandsSeparator='.' decimalSeparator=',' symbolAfter={true}/>
```

