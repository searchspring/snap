# Price

Utilizes `currency` from `@searchspring/snap-toolbox` to render a `<span>` containing a formatted number.

## Usage

The `Price` component utilizes all props from the `FormattedNumber` component with the following additional prop:

### lineThrough
The `lineThrough` prop will style the formatted number with a line-through.

```jsx
<Price value={1099.99} symbol=' €' lineThrough={true} thousandsSeparator='.' decimalSeparator=',' symbolAfter={true} />
```
Formatted output from above properties: ~~`1.099,99 €`~~
