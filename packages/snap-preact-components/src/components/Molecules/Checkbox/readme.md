## Checkbox

Renders an span and an `<Icon />` to create a customizable checkbox. checked, color, disabled, onClick, size and Icon (defaults to 'check-thin') props available. 

## Additional Info

Using the native prop, you can bypass the span and Icon component and just render a native HTML input element with the type checkbox. 

The Checked state can be handled both internally or externally, by using either the checked prop, or the startChecked prop. 
 
## Components Used
- Icon

## Usage

Default
```jsx
    <Checkbox checked={true} disabled={true} />
```

Native
```jsx
    <Checkbox native={true} />
```

