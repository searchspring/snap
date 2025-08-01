# Breadcrumbs

Renders a list of breadcrumbs. 

## Usage

### data
The `data` prop specifies an array of breadcrumb objects, or a function that returns an array of breadcrumb objects. The function is passed the controller if available.

#### breadcrumb object 

`label` - required, the breadcrumb label
 
`url` - optional, the URL of this breadcrumb

```typescript
const breadcrumbs = [
	{ url: '/', label: 'Home' },
	{ url: '/', label: 'Collections' },
	{ url: '/', label: 'Appliances' },
	{ label: 'Fridge' }
]

or 

const breadcrumbsFunction = (controller) => {
	const term = (controller as SearchController).store?.search?.query?.string;
	return [
		{ url: '/', label: 'Home' },
		{ url: '/', label: 'Search' },
		{ label: term }
	]
}

```

```jsx
<Breadcrumbs separator={'/'} data={breadcrumbs} />
```

### separator
The `separator` prop spcifies a custom delimiter between each breadcrumb. The default separator is `'/'`. This can be a string or a JSX element.

```jsx
<Breadcrumbs separator={'>'} data={breadcrumbs} />
```
