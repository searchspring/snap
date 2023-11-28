# Toggle

Renders a toggle switch

## Usage

### toggled
The `toggled` prop specifies whether the toggle is selected or not.

```jsx
<Toggle toggled={true} />
```

### label
The `label` prop specifies the label to render. 

```jsx
<Toggle label={'on sale'} />
```

### round
The `round` prop specifies whether the toggle should render as pill or rectangle. 

```jsx
<Toggle round={true} />
```

### onClick
The `onClick` prop allows for a custom callback function for when the toggle is clicked.

```jsx
<Toggle onClick={(e)=>{console.log(e)}} />
```

### activeColor
The `activeColor` prop specifies the background color of the toggle when active.

```jsx
<Toggle activeColor={'#eeee'} />
```

### inactiveColor
The `inactiveColor` prop specifies the background color of the toggle when inactive.

```jsx
<Toggle inactiveColor={"black"} />
```

### buttonColor
The `buttonColor` prop specifies the color of the toggle button.

```jsx
<Toggle buttonColor={"white"} />
```

### size
The `size` prop specifies the size of the toggle switch.

```jsx
<Toggle size={"20px"} />
```

### disabled
The `disabled` prop will disable the toggle switch. 

```jsx
<Toggle disabled={true} />
```