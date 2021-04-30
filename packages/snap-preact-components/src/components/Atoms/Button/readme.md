## Button

Render as unstyled native button, or a div styled like a button based on the optional `native` prop. can take `content` or `children`, styling props available, has the ability to change the `onClick` functionality. 

## Usage

### Content
Button contents can be provided in the `content` prop. This can be a string or a JSX element.

``` jsx
<Button content={"click me!"} />
```
 
Or alternatively as children:

``` jsx
<Button>click me!</Button>
```

### Disabled
The `disabled` prop will disable a button from being clickable

``` jsx
<Button content={"click me!"} disabled={true}/>
```

### Native
The `native` prop will use a native html `<button>` element instead of the default custom styled button utilizing a `<div>` element

``` jsx
<Button content={"click me!"} native={true}/>
```

### Events

#### onClick
The `onClick` prop allows for a custom callback function

``` jsx
<Button content={"click me!"} onClick={(e)=>{console.log(e)}} />
```

## Styling
In addition to global and component level styling available for all components (see Theme documentation), this component has the following props:

### backgroundColor
Button background color

```jsx
<Button content={"click me!"} backgroundColor={'#eeeeee'}/>
```

### borderColor
Button border color

```jsx
<Button content={"click me!"} borderColor={'#cccccc'}/>
```
### color
Button text color

```jsx
<Button content={"click me!"} color={'#222222'}/>
```
