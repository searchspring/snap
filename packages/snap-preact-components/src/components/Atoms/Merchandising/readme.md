## Banner

Renders a merchandising banner. Banner Types include header,footer,left & banner. 

## Additional Info

Inline banners actually use an entirely seperate component from the rest of the banners, and can be passed layout and width props, just like the results components in order to maintain the same styling. 


## Usage

Header
```jsx
    <Banner content={controller?.store?.merchandising?.content} type={'header'}/>
```

Footer
```jsx
    <Banner content={controller?.store?.merchandising?.content} type={'footer'}/>
```

Inline 
```jsx
    <InlineBanner banner={controller?.store?.merchandising?.content.inline[0]} layout="grid"/>
```
