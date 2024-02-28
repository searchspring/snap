# BadgeText

Renders a text badge. It is expected to be used with `CalloutBadge` and `OverlayBadge` components.

## Usage

### label
The requires `label` prop specifies the badge text contents.

```jsx
<BadgeText label={'30% Off'} />
```

### color
The `color` prop specifies the badge background color.

```jsx
<BadgeText color={'rgba(255, 255, 255, 0.5)'} label={'30% Off'} />
```

### colorText
The `colorText` prop specifies the badge text color.

```jsx
<BadgeText colorText={'#000000'} label={'30% Off'} />
```

### overflow

The `overflow` prop is enabled by default. It allows a badge with long text content to overflow its grid cell position and therefore overlap badges in other overlay position.

```jsx
<BadgeText overflow={true} label={'30% Off'} />
```
