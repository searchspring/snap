# Facet Toggle

Renders a facet option toggle switch

## Usage

### value
The required `value` prop specifies a single facet value to use.

```jsx
<FacetToggle value={facet.values[0]} />
```

### label
The `label` prop specifies the label to render. 

```jsx
<FacetToggle value={facet.values[0]} label={facet.values[0].label} />
```

### round
The `round` prop specifies a boolean to determine if the toggle switch should render round (pill) or square.

```jsx
<FacetToggle value={facet.values[0]} round={true} />
```

### onClick
The `onClick` prop allows for a custom callback function for when the toggle is clicked.

```jsx
<FacetToggle value={facet.values[0]} onClick={(e)=>{console.log(e)}} />
```

### activeColor
The `activeColor` prop specifies the background color of the toggle when active.

```jsx
<FacetToggle value={facet.values[0]} activeColor={'#eeee'} />
```

### inactiveColor
The `inactiveColor` prop specifies the background color of the toggle when inactive.

```jsx
<FacetToggle value={facet.values[0]} inactiveColor={"black"} />
```

### buttonColor
The `buttonColor` prop specifies the color of the toggle button.

```jsx
<FacetToggle value={facet.values[0]} buttonColor={"white"} />
```
