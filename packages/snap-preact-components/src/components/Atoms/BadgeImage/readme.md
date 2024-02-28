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

### overflow

The `overflow` prop is disabled by default. It allows a large sized badge image to overflow its grid cell position and therefore overlap badges in other overlay position.

```jsx
<BadgeImage overflow={false} src={'/images/example.png'} />
```
