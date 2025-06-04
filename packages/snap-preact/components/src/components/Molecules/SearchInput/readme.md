# SearchInput

Renders an input element

## Sub-components
- Icon

## Usage

```jsx
<SearchInput onChange={handleChange} placeholderText={"placeholder text"}/>
```

### placeholderText
The `placeholderText` prop sets the input placeholder text. 

```jsx
<SearchInput placeholderText={"placeholder text"} />
```

### inputName
The `inputName` prop sets the input name attribute value. 

```jsx
<SearchInput inputName={"query"} />
```

### onChange
The `onChange` prop is invoked when the input's value has been changed. 

```jsx
<SearchInput onChange={handleChange} />
```

### onKeyUp
The `onKeyUp` prop is invoked on keyUp on the input. 

```jsx
<SearchInput onKeyUp={handleChange} />
```

### onKeyDown
The `onKeyDown` prop is invoked keyDown on the input

```jsx
<SearchInput onKeyDown={handleChange} />
```

## onClick
The `onClick` prop is invoked on click of anything in the component. Wrapper, input or icon. 

```jsx
<SearchInput onClick={handleChange} />
```

### icon
The `icon` prop specifies a path within the `Icon` component paths (see Icon Gallery).

```jsx
<SearchInput icon={'search'} />
```

### inputRef
The `inputRef` prop specifies a ref to set on the input element. To be accessed in a parent component.

```jsx
const renderedInputRef = useRef(null);
useEffect(() => {
    console.log(renderedInputRef)
},[])

<SearchInput inputRef={renderedInputRef} />
```
