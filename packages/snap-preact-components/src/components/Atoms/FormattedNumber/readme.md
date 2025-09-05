# Formatted Number

Utilizes `formatNumber` from [@searchspring/snap-toolbox](https://searchspring.github.io/snap/#/toolbox) to render a `<span>` containing a formatted number.

## Usage
```jsx
import { FormattedNumber } from '@searchspring/snap-preact-components';
```

### value
The required `value` prop specifies the number to be formatted. 

```jsx
<FormattedNumber value={99.99} />
```
Formatted output from above properties: `99.990`

### symbol
The `symbol` prop specifies an optional symbol to be included. Typically used when adding a unit of measure to a number.

```jsx
<FormattedNumber value={99} symbol={' °C'} /> 
```
Formatted output from above properties: `99.000 °C`

### decimalPlaces
The `decimalPlaces` prop specifies how many decimal places to format.

```jsx
<FormattedNumber value={99} decimalPlaces={2} /> 
```
Formatted output from above properties: `99.00`

### padDecimalPlaces
The `padDecimalPlaces` prop pads excess decimal places with zeros.

```jsx
<FormattedNumber value={99.99} decimalPlaces={4} padDecimalPlaces={true} /> 
```
Formatted output from above properties: `99.9900`

```jsx
<FormattedNumber value={99.99} decimalPlaces={4} padDecimalPlaces={false} /> 
```
Formatted output from above properties: `99.99`

### thousandsSeparator
The `thousandsSeparator` prop specifies the thousands separator character.

```jsx
<FormattedNumber value={10999.99} thousandsSeparator={','} /> 
```
Formatted output from above properties: `10,999.990`

### decimalSeparator
The `decimalSeparator` prop specifies the decimal separator character.

```jsx
<FormattedNumber value={10999.99} decimalSeparator={','} decimalPlaces={2} /> 
```
Formatted output from above properties: `10999,99`

### symbolAfter
The `symbolAfter` prop specifies if the provided `symbol` prop should be placed after the formatted `value`.

```jsx
<FormattedNumber value={999.999} symbol={'km'} symbolAfter={true} /> 
```
Formatted output from above properties: `999.999km`