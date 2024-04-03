# CalloutBadge

Renders callout badges configured in the Searchspring Management Console and returned from the API. This component is intended to be used within a `Result` component to display callout badges.

## Usage

### name
The required `name` prop specifies the name of the callout badge to display. 

```jsx
<CalloutBadge name={'callout'} result={controller.store.results[0]} />
```

### result
The required `result` prop specifies a reference to a product object from the `results` store array.

```jsx
<CalloutBadge name={'callout'} result={controller.store.results[0]} />
```

### componentMap
The `componentMap` prop allows for custom badge components. This functionallity requires the component and accompanying files to be synced to the Searchspring Management Console using Snapfu.

```jsx
import { CustomOnSale } from './components/Badges/CustomOnSale';
...
<CalloutBadge 
    name={'callout'} 
    result={controller.store.results[0]} 
    componentMap={{
        'customOnSaleBadge': () => CustomOnSale
    }}
/>
```

The `componentMap` also supports async functions for dynamic importing of badges.

```jsx
<CalloutBadge 
    name={'callout'} 
    result={controller.store.results[0]} 
    componentMap={{
        'customOnSaleBadge': () => {
            return (await import('./components/Badges/CustomOnSale')).CustomOnSale;
        }
    }}
/>
```

