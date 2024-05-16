# BadgeText

Renders a text badge. It is expected to be used with `CalloutBadge` and `OverlayBadge` components.

## Usage

### value
The required `value` prop specifies the badge text contents.

```jsx
<BadgeText value={'30% Off'} />
```

### colorText
The `colorText` prop specifies the badge text color.

```jsx
<BadgeText colorText={'#000000'} value={'30% Off'} />
```

### tag
The `tag` prop specifies the badge location tag and adds an identifying classname.

```jsx
<BadgeText tag={'30-off-promo'} colorText={'#000000'} value={'30% Off'} />
```
