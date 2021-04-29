## Autocomplete
Using the Autocomplete Controller,and the Autocomplete Store, returned by the Snapify.autocomplete function, renders a popup instant search, that attaches to the focus event of the input passed into the selector prop. Renders Terms, Facets, Banners, & Results components. HideFacets, hideTerms, & responsive props available for customizing. 


## Additional Info

Most of the actual functionality is handled by the Controller and Store. Note that the Autocomplete does not use the Search Controller or Store, it actually has its own versions. 
Because it uses a different Controller and Store, and needs the input Selector passed in, it uses a different Snapify function as well. Use Snapify.autocomplete instead of Snapify.search in order to get the Autocomplete Controller/Store. 

learn more...  
Autocomplete Controller (https://github.com/searchspring/snap-controller/blob/main/src/Autocomplete/AutocompleteController.ts)  
Autocomplete Store (https://github.com/searchspring/snap-store-mobx/blob/main/src/Autocomplete/AutocompleteStore.ts)

## Components Used
- Facet
- Banner
- Results

## Usage

```jsx
const controller = Snapify.autocomplete({selector: "#searchInput", globals: { siteId: 'scmq7n' } });
<Autocomplete {...args} store={controller?.store} input={controller?.config.selector}/>
```