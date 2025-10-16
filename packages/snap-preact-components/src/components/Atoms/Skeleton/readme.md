# Skeleton

Renders a div with a animation for use when building loading skeletons. 

## Usage
```jsx
import { Skeleton } from '@searchspring/snap-preact-components';
```

### Height
The `height` prop specifies the css height of the skeleton div.

```jsx
<Skeleton height='200px' width='150px'/>
```

### Width

The `width` prop specifies the css width of the skeleton div.

```jsx
<Skeleton height='200px' width='150px'/>
```

### Round

The `round` prop is used for when you are wanting to render a circle instead of a block.

```jsx
<Skeleton height='200px' width='150px' round="true"/>
```

### backgroundColor

The `backgroundColor` prop is used for changing the background color of the skeleton.

```jsx
<Skeleton height='200px' width='150px' backgroundColor='#333333'/>
```

### animatedColor

The `animatedColor` prop is used for changing the color of the moving vertical loading bar.

```jsx
<Skeleton height='200px' width='150px' backgroundColor='#333333' animatedColor="#000000" />
```