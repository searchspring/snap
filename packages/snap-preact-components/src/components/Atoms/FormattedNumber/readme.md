## Formatted Number

Renders a span that calls the formatNumber function in the Snap Toolbox. Has tons of props to allow you to format the number for all scenarios. price, strike price, Temperature, length, weight. 

## Additional Info

Uses the formatNumber function in the Snap Toolbox (https://github.com/searchspring/snap-toolbox/blob/main/filters/src/formatNumber.ts)

## Usage

 Default

``` jsx
<FormattedNumber value={1099.99} />
```
 Using custom symbol and setting decimal places

``` jsx
<FormattedNumber value={100} symbol={' °C'} decimalPlaces={2} />
```

