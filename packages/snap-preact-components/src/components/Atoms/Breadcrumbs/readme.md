## Breadcrumbs

Renders a list of breadcrumbs. 

## Usage

### data
An array of crumbs. Each crumb contains a `label` and an optional `url`

```typescript
const breadcrumbs = [
    {url: '/',label: 'Home'},
    {url: '/',label: 'Collections'},
    {url: '/',label: 'Appliances'},
    {label: 'Fridge'}
]
```

```jsx
<Breadcrumbs separator='/' data={breadcrumbs} />
```

### separator
Breadcrumbs can be separated by a custom separator using the `separator` prop. The default separator is `'/'`. This can be a string or a JSX element.

```jsx
<Breadcrumbs separator='>' data={breadcrumbs} />
```

