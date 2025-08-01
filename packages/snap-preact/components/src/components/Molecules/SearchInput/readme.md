# SearchInput

Renders an input element

## Sub-components
- Button

## Usage

```jsx
<SearchInput onChange={handleChange} placeholderText={"placeholder text"}/>
```

### value
The `value` prop sets the input value if externally managed.

```jsx
<SearchInput value={'dress'} placeholderText={"placeholder text"} />
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

### onClick
The `onClick` prop is invoked on click of anything in the component. Wrapper, input or icon. 

```jsx
<SearchInput onClick={handleChange} />
```

### submitSearchButton
The `submitSearchButton` prop specifies props to pass to the submit search button component. Takes any `Button` component props. 

```jsx

const buttonProps = {
    icon: 'search',
    onClick: () => func
};

<SearchInput submitSearchButton={buttonProps} />
```

### clearSearchButton
The `clearSearchButton` prop specifies props to pass to the clear search button component. Takes any `Button` component props. Note this button only renders if there is a value to clear. 

```jsx

const buttonProps = {
    icon: 'close-thin',
    onClick: () => func
};

<SearchInput clearSearchButton={buttonProps} />
```

### closeSearchButton
The `closeSearchButton` prop specifies props to pass to the close search button component. Takes any `Button` component props. 

```jsx

const buttonProps = {
    icon: 'angle-left',
    onClick: () => func
};

<SearchInput closeSearchButton={buttonProps} />
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
