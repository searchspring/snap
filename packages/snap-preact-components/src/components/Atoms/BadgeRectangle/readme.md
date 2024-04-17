# BadgeRectangle

Renders a text badge in the shape of a rectangle. It is expected to be used with `CalloutBadge` and `OverlayBadge` components.

## Usage

### value
The required `value` prop specifies the badge text contents.

```jsx
<BadgeRectangle value={'30% Off'} />
```

### color
The `color` prop specifies the badge background color.

```jsx
<BadgeRectangle color={'rgba(255, 255, 255, 0.5)'} value={'30% Off'} />
```

### colorText
The `colorText` prop specifies the badge text color.

```jsx
<BadgeRectangle colorText={'#000000'} value={'30% Off'} />
```

