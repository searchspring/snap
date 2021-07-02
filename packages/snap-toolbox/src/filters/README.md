## Filters
Contains a collection of methods used to transform strings or numbers into common variations.

```typescript
import { filters } from '@searchspring/snap-toolbox';
```

## `formatNumber` method
Take a number and returns a string that has been formatted with the following format number options: 

`symbol` - currency symbol, default is `''`

`decimalPlaces` - number of decimal places, default is `3`

`thousandsSeparator` - thousands separator, default is `''`

`decimalSeparator` - decimal separator, default is `'.'`

`padDecimalPlaces` - pad decimal places, default is `true`

`symbolAfter` - place currency symbol after value, default is `false`

```typescript
const value = 12999.99;
const formattedPrice = filters.formatNumber(value);
console.log(formattedPrice); // '12999.990'
```

```typescript
const value = 12999.99;
const formattedPrice = filters.formatNumber(value, {
	symbol: ' kr',
	decimalPlaces: 2,
	padDecimalPlaces: true,
	thousandsSeparator: ',',
	decimalSeparator: ',',
	symbolAfter: true,
});
// '12,999,99 kr'
```

### `currency` method
The `currency` method is a wrapper for the `formatNumber` method with the following altered default options:

```typescript
{
	symbol: '$',
	thousandsSeparator: ',',
	decimalPlaces: 2,
}
```

```typescript
const value = 12999.99;
const formattedPrice = filters.currency(value);
// '$12,999.99'
```

```typescript
const value = 12999.99;
const formattedPrice = filters.currency(value, {
	symbol: '£ '
}); 
// '£ 12,999.99'
```


### `handleize` method
Given a string, returns a string that has been converted to lower case, without any symbols and special characters, and spaces - these are replaced with with `'-'`.

Typical usage would be for generating URL-safe parameters.

```typescript
const value = "Hello World!!";
const handled = filters.handleize(value);
// 'hello-world'
```

### `stripHTML` method
Given a string containing HTML, returns a string that does not contain any HTML tags.

```typescript
const value = "<p class='text'>Hello World!!</p>";
const handled = filters.stripHTML(value);
// 'Hello World!!'
```

### `truncate` method
Truncate a string to a specific length and optionally append additional string to the end. The function will not break words, but will always ensure the limit is smaller than the value length.

```typescript
const value = "Searchspring";
const limit = 7;
const append = '...';
const truncated = filters.truncate(value, limit, append);
// 'Search...'
```