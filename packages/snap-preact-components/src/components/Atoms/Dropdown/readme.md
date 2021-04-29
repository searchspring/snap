## Dropdown

Renders a drop down and a button. 

## Specific Callouts

- onToggle prop executes when the internal state changes, gets passed the event and the internal state - used with internal state only

- startOpen prop sets the dropdown open state on initial render - used with internal state only',

- use the Open prop to pass a value to control the state externally


## Usage

Using content prop

``` jsx
<Dropdown button='button text' content='content text' />
```

Using children

``` jsx
<Dropdown button='button text'>
       content text
</Dropdown>
```

