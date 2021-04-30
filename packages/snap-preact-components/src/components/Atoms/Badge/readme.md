## Badge

Renders an absolute-positioned badge. It is expected that the parent element contains `position: relative`

## Usage

### Content
Badge contents can be provided in the `content` prop
```jsx
<div style="position: relative;">
    <Badge content="Sale"/>
</div>
```

Or alternatively as children:

```jsx    
<Badge>
    <img src="//cdn.searchspring.net/ajax_search/img/star-badge-new-blue.png" />
</Badge>
```

### Position
Badge position by default is top left. This can be changed using the `position` prop.

In this example, the badge will be 2px from the top and 2px from the right:

```jsx    
<Badge position={{ "top": 2, "right": 2 }}>
    <img src="//cdn.searchspring.net/ajax_search/img/star-badge-new-blue.png" />
</Badge>
```
