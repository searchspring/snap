# OverlayBadge

Renders overlay badges configured in the Searchspring Management Console and returned from the API. This component is intended to be used within a `Result` component to wrap elements (children) that should have overlay badges.

## Usage

### children
The required children provided to the component will be wrapped and rendered in a relative div to allow badges to be positioned absolutely. 

```jsx
<OverlayBadge controller={controller} result={controller.store.results[0]}>
    <div>
        <img src='/images/example.png'/>
    </div>
</OverlayBadge>
```

### controller
The required `controller` prop specifies a reference to the controller.

```jsx
<OverlayBadge controller={controller} result={controller.store.results[0]}>
    <div>
        <img src='/images/example.png'/>
    </div>
</OverlayBadge>
```

### result
The required `result` prop specifies a reference to a product object from the `results` store array.

```jsx
<OverlayBadge controller={controller} result={controller.store.results[0]}>
    <div>
        <img src='/images/example.png'/>
    </div>
</OverlayBadge>
```

### componentMap
The `componentMap` prop allows for custom badge components. This functionallity requires the component and accompanying files to be synced to the Searchspring Management Console using Snapfu.

```jsx
<OverlayBadge 
    controller={controller} 
    result={controller.store.results[0]}
    componentMap={{
        'customOnSaleBadge': () => <div>On Sale</div>
    }}
>
    <div>
        <img src='/images/example.png'/>
    </div>
</OverlayBadge>
```


