# BadgeImage

Renders an image badge. It is expected to be used with `CalloutBadge` and `OverlayBadge` components.

## Usage

### url
The required `url` prop specifies the badge image `src` attribute.

```jsx
<BadgeImage src={'/images/example.png'} />
```


### label
The `label` prop specifies the badge image `alt` attribute. 

```jsx
<BadgeImage label={'example badge'} src={'/images/example.png'} />
```
