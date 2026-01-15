# Breadcrumbs

Renders a list of breadcrumbs. 

## Usage
```jsx
import { Breadcrumbs } from '@searchspring/snap-preact-components';
```

### data
The `data` prop specifies an array of breadcrumb objects. 

#### breadcrumb object 

`label` - required, the breadcrumb label
 
`url` - optional, the URL of this breadcrumb

```js
const breadcrumbs = [
	{ url: '/', label: 'Home' },
	{ url: '/', label: 'Collections' },
	{ url: '/', label: 'Appliances' },
	{ label: 'Fridge' }
]
```

```jsx
<Breadcrumbs separator={'/'} data={breadcrumbs} />
```

### separator
The `separator` prop spcifies a custom delimiter between each breadcrumb. The default separator is `'/'`. This can be a string or a JSX element.

```jsx
<Breadcrumbs separator={'>'} data={breadcrumbs} />
```
