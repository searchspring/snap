# Element

Renders an HTML element of your choice. This component can be used for adding basic strings to your layouts, or for adding specific elements for third parties to target and inject into. 

## Usage

### type
The required `type` prop specifies the element type. This can be any of the supported element types - `div`, `span`, `p` or `label`. 

```jsx
<Element type={"div"} />
```
 
### content
The `content` prop specifies the content to be rendered within the element. This only accepts a string.

```jsx
<Element type={"span"} content={"Hello World!"} />
```

### attributes
The `attributes` prop specifies additional attributes to be spread onto the element. This can be any attribute/value you may need, however `onClick` attributes are <b>not</b> supported. 

```jsx

const attributes = {
    sku: '1234',
    id: 'someRatingWidgetID',
    ['data-name']: "product1234",
}

<Element type={'div'} content={"3rd party ratings append here!"} attributes={attributes}/>
```
