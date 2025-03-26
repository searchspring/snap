# Terms

Renders a list of terms for autocomplete. 

## Usage

### Controller

The `controller` prop specifies a reference to the autocomplete controller.

```jsx
<AutocompleteTerms controller={controller} />
```

### Terms

The `terms` prop specifies a reference to an autocomplete term store, if terms are not provided, the terms in the controller store will be used. 

```jsx
<AutocompleteTerms controller={controller} terms={terms}/>
```

### title

The `title` prop is will display the given text above the terms area. The default value is blank. 

```jsx
<AutocompleteTerms controller={controller} title={'Suggestions'}/>
```

### limit

The `limit` prop is used for number of terms to render. Please note that this does not limit the number of terms fetched by the controller.  

```jsx
<AutocompleteTerms controller={controller} limit={4}/>
```

### previewOnHover

The `previewOnFocus` prop will invoke the `term.preview()` method when the value has been hovered over.

```jsx
<AutocompleteTerms controller={controller} previewOnHover={true}/>
```

### emify

The `emify` will automatically wrap non-matching characters within the term with an `<em>` element for different styling purposes. 

```jsx
<AutocompleteTerms controller={controller} emify={true}/>
```

### onTermClick

The `onTermClick` prop allows for a custom callback function for when a term value is clicked. The function is passed the clicked terms reference in the term store. 

```jsx
<AutocompleteTerms controller={controller} onTermClick={(e, term)=>{console.log(e, term)}}/>
```
