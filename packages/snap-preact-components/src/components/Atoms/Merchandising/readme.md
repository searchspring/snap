## Banner

Renders an inline merchandising banner. Banner Types include `header`, `footer`, `left` and `banner`. 

This `Banner` component does not support inline banners. See `InlineBanner` component below.

## Usage

### content
The required `content` prop contains an object of banners returned from the Searchspring API.

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'header'}/>
```

### type
The required `type` prop contains the banner type to render from the `content` object

Banner Types include `header`, `footer`, `left` and `banner`. 

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'header'}/>
```

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'footer'}/>
```

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'left'}/>
```

```jsx
<Banner content={controller?.store?.merchandising?.content} type={'banner'}/>
```

## InlineBanner

## Usage

### banner
The `banner` prop contains a reference to an inline banner object from the `content` object

```jsx
<InlineBanner banner={controller?.store?.merchandising?.content.inline[0]}/>
```

### width
The `width` prop specifies the width of the inline banner

```jsx
<InlineBanner banner={controller?.store?.merchandising?.content.inline[0]} width={'300px'} />
```

### layout
The `layout` prop specifies the if this banner will be rendered in a `grid` or `list` layout

```jsx
<InlineBanner banner={controller?.store?.merchandising?.content.inline[0]} layout={'grid'} />
```
