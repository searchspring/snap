# SearchInput

Renders an input element

## Sub-components
- Icon

## Usage
```jsx
import { SearchInput } from '@searchspring/snap-preact-components';
```

```jsx
<SearchInput onChange={handleChange} placeholder={"placeholder text"}/>
```

### placeholder
The `placeholder` prop sets the input placeholder text. 

```jsx
<SearchInput placeholder={"placeholder text"} />
```

### onChange
The `onChange` prop is invoked when the input's value has been changed. 

```jsx
<SearchInput onChange={handleChange} />
```

### hideIcon
The `hideIcon` prop determines if the icon should be hidden or not. 

```jsx
<SearchInput hideIcon={true} />
```
