## Formatted Number

Utilizes `formatNumber` from [@searchspring/snap-toolbox](https://searchspring.github.io/snap/#/toolbox) to render a `<span>` containing a formatted number.

## Usage

### Value
The `value` prop is required and contains the number to be formatted. 

``` jsx
<FormattedNumber value={99.99} />
'99.990'
```

### Symbol
Format with a custom `symbol`. Typically used with a currency or temperature symbol.

``` jsx
<FormattedNumber value={99} symbol={' °C'} /> 
'99.000 °C'
```

### Decimal Places
The `decimalPlaces` prop specifies how many decimal places to format.

``` jsx
<FormattedNumber value={99} decimalPlaces={2} /> 
'99.00'
```

### Pad Decimal Places
Pad excess decimal places with zeros using the `padDecimalPlaces` prop

``` jsx
<FormattedNumber value={99.99} decimalPlaces={4} padDecimalPlaces={true} /> 
'99.9900'
```

``` jsx
<FormattedNumber value={99.99} decimalPlaces={4} padDecimalPlaces={false}/> 
'99.99'
```


### Thousands Separator
The `thousandsSeparator` prop specifies the thousands separator character.

``` jsx
<FormattedNumber value={10999.99} thousandsSeparator={','} /> 
'10,999.990'
```

### Decimal Separator
The `decimalSeparator` prop specifies the decimal separator character.

``` jsx
<FormattedNumber value={10999.99} decimalSeparator={','} decimalPlaces={2} /> 
'10999,99'
```

### Symbol After
The `symbolAfter` prop specifies if the provided `symbol` prop should be placed after the formatted number.

``` jsx
<FormattedNumber value={10999.99} symbol={'kr'} symbolAfter={true}/> 
'10999.990kr'
```
