# Banner

Renders a merchandising banner. Banner Types include `header`, `footer`, `left`, and `banner`. 

This `Banner` component does not support inline banners. See `InlineBanner` component below.

## Usage
```jsx
import { Banner } from '@searchspring/snap-preact-components';
```

### content
The required `content` prop specifies an object of banners returned from the Searchspring API.

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'header'} />
```

### type
The required `type` prop specifies the banner type to render from the `content` object.

Banner Types include `header`, `footer`, `left`, and `banner`. 

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'header'} />
```

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'footer'} />
```

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'left'} />
```

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'banner'} />
```