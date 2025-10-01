# Badges

Badges are self-configured in the Searchspring Management Console

To displays badges the Result card must include the [OverlayBadge](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fmolecules-overlaybadge--default) and [CalloutBadge](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fmolecules-calloutbadge--default) components


## OverlayBadge

The `OverlayBadge` component wraps elements (children) that should have badges overlayed - typically the product image

```jsx
<OverlayBadge controller={controller} result={controller.store.results[0]}>
	<img src='/images/example.png'/>
</OverlayBadge>
```

## CalloutBadge

The `CalloutBadge` component displays badges inline and can be placed in any position in the Result card

```jsx
<CalloutBadge result={controller.store.results[0]} />
```

## Badge Components
The `OverlayBadge` and `CalloutBadge` components are responsible for displaying badges

The default badges available: 

- [BadgePill](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fatoms-badgepill--default)
- [BadgeText](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fatoms-badgetext--default)
- [BadgeRectangle](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fatoms-badgerectangle--default)
- [BadgeImage](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fatoms-badgeimage--default)

Additional custom badge components can be created and synced to the Searchspring Management Console using the Snapfu CLI. See [Custom Badge Templates reference](https://searchspring.github.io/snap/reference-custom-badge-templates)