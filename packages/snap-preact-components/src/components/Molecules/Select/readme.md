## Select

Uses the `<Dropdown/>`, `<Icon/>` & `<Button/>` components to render a cutomizable Select dropdown, or use the native prop to render a native HTML `<select></select>` element. 
Tons of props available to allow any styling or functionality needed. 

## Additional Info

Internal or extenal open state management via startOpen Prop, 

Internal or external initial selection state management via selected prop

## Components Used
- Button
- Dropdown 
- Icon

## Usage

Default
```jsx
<Select
    label='Sort By'
    options={controller?.store?.sorting?.options}
    selected={controller?.store?.sorting?.current}
    onSelect={(e, selectedOption) => {
        selectedOption && selectedOption.url.go();
    }}
/>
```

Native
```jsx
<Select
    label='Sort By'
    native={true}
    options={controller?.store?.sorting?.options}
    selected={controller?.store?.sorting?.current}
    onSelect={(e, selectedOption) => {
        selectedOption && selectedOption.url.go();
    }}
/>
```