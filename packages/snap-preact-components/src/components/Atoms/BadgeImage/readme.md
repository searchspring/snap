# BadgeImage

Renders an image badge. It is expected to be used with `CalloutBadge` and `OverlayBadge` components.

## Usage

### url
The required `url` prop specifies the badge image `src` attribute.

```jsx
<BadgeImage url={'/images/example.png'}/>
```

### tag
The `tag` prop specifies the badge location tag and adds an identifying classname.

```jsx
<BadgeImage tag={'30-off-promo'} url={'/images/example.png'}/>
```

### label
The `label` prop specifies the badge image `alt` attribute. 

```jsx
<BadgeImage label={'example badge'} url={'/images/example.png'} />
```
