## Badge

Renders an absolute-positioned badge. It is expected that the parent element contains `position: relative`.

## Usage

### content
The `content` prop specifies the badge.

```jsx
<div style="position: relative;">
    <Badge content="Sale" />
</div>
```

Or alternatively using children:

```jsx    
<div style="position: relative;">
    <Badge>Sale</Badge>
</div>
```

### position
The `position` prop specifies an object with CSS `top`, `bottom`, `left`, and `right` attributes. The default position is top left `{ top: 0, left: 0 }`.

In this example, the badge will be 2px from the top and 2px from the right:

```jsx    
<Badge position={{ "top": 2, "right": 2 }}>Sale</Badge>
```
