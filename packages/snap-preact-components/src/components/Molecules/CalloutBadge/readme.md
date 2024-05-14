# CalloutBadge

Renders callout badges configured in the Searchspring Management Console and returned from the API. This component is intended to be used within a `Result` component to display callout badges.

## Usage


### result
The required `result` prop specifies a reference to a product object from the `results` store array.

```jsx
<CalloutBadge tag={'callout'} result={controller.store.results[0]} />
```

### componentMap
The `componentMap` prop allows for custom badge components. This functionallity requires the component and accompanying files to be synced to the Searchspring Management Console using Snapfu.

```jsx
import { CustomOnSale } from './components/Badges/CustomOnSale';
...
<CalloutBadge 
    tag={'callout'} 
    result={controller.store.results[0]} 
    componentMap={{
        'customOnSaleBadge': () => CustomOnSale
    }}
/>
```

The `componentMap` also supports async functions for dynamic importing of badges.

```jsx
<CalloutBadge 
    tag={'callout'} 
    result={controller.store.results[0]} 
    componentMap={{
        'customOnSaleBadge': () => {
            return (await import('./components/Badges/CustomOnSale')).CustomOnSale;
        }
    }}
/>
```

### renderEmpty
By default if there are no badges, the wrapper element will not render. If you need the wrapper element to persist, this prop will cause the wrapper element `ss__callout-badge` to render.

```jsx
<CalloutBadge
    renderEmpty
    tag={'callout'} 
    result={controller.store.results[0]} 
    componentMap={{
        'customOnSaleBadge': () => CustomOnSale
    }}
/>
```

### tag
The `tag` prop specifies the location name of this callout location. 

```jsx
<CalloutBadge tag={'callout'} result={controller.store.results[0]} />
```
