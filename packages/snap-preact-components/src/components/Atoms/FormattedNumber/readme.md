## Formatted Number

Utilizes `formatNumber` from [@searchspring/snap-toolbox](https://searchspring.github.io/snap/#/toolbox) to render a `<span>` containing a formatted number.

## Usage

### value
The required `value` prop specifies the number to be formatted. 

``` jsx
<FormattedNumber value={99.99} />
'99.990'
```

### symbol
The `symbol` prop specifies an optional symbol to be included. Typically used when formatting currency or temperature.

``` jsx
<FormattedNumber value={99} symbol={' °C'} /> 
'99.000 °C'
```

### decimalPlaces
The `decimalPlaces` prop specifies how many decimal places to format.

``` jsx
<FormattedNumber value={99} decimalPlaces={2} /> 
'99.00'
```

### padDecimalPlaces
The `padDecimalPlaces` prop pads excess decimal places with zeros.

``` jsx
<FormattedNumber value={99.99} decimalPlaces={4} padDecimalPlaces={true} /> 
'99.9900'
```

``` jsx
<FormattedNumber value={99.99} decimalPlaces={4} padDecimalPlaces={false} /> 
'99.99'
```

### thousandsSeparator
The `thousandsSeparator` prop specifies the thousands separator character.

``` jsx
<FormattedNumber value={10999.99} thousandsSeparator={','} /> 
'10,999.990'
```

### decimalSeparator
The `decimalSeparator` prop specifies the decimal separator character.

``` jsx
<FormattedNumber value={10999.99} decimalSeparator={','} decimalPlaces={2} /> 
'10999,99'
```

### symbolAfter
The `symbolAfter` prop specifies if the provided `symbol` prop should be placed after the formatted `value`.

``` jsx
<FormattedNumber value={10999.99} symbol={'kr'} symbolAfter={true} /> 
'10999.990kr'
```
