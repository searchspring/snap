# NoResults

Renders no results verbiage. Props that accept strings in this component will render HTML contained within them.

## Usage

### contentSlot
The `contentSlot` prop provides a slot to provide custom content. This can be JSX, string, or stringified HTML. 

```jsx
const slot = <div>Nothing found..</div>

<NoResults contentSlot={slot} />
```

### hideSuggestions
The `hideSuggestions` prop will prevent the suggestions list and title from rendering.

```jsx
<NoResults hideSuggestions={true} />
```

### hideContactsTitleText
The `hideContactsTitleText` prop allows you to hide the contacts title.

```jsx
<NoResults hideContactsTitleText={true} />
```

### suggestionsTitleText
The `suggestionsTitleText` prop allows you to set the inner text of the suggestions title.

```jsx
<NoResults suggestionsTitleText={'suggestions'} />
```

### hideSuggestionsTitleText
The `hideSuggestionsTitleText` prop allows you to hide the suggestions title.

```jsx
<NoResults hideSuggestionsTitleText={true} />
```

### suggestionsList
The `suggestionsList` prop takes an array of strings to render as suggestions 

```jsx
const list = [
	`Check for misspellings.`,
	`Remove possible redundant keywords (ie. "products").`,
	`Use other words to describe what you are searching for.`,
],

<NoResults suggestionsList={list} />
```

### hideContact
The `hideContact` prop will prevent the contact list and title from rendering.

```jsx
<NoResults hideContact={true} />
```

### contactsTitleText
The `contactsTitleText` prop allows you to set the inner text contacts title.

```jsx
<NoResults contactsTitleText={'contacts'} />
```

### templates
The `templates` prop allows you to configure and display product recommendations when no search results are found. This prop accepts an object with a recommendation key, which can enable or customize the recommendation module.

Example usage:


```jsx
const templatesConfig = {
    recommendation: {
      enabled: true,
      component: 'Recommendation', // (optional) custom recommendation component name
      resultComponent: 'Result',   // (optional) custom result component name
      config: {                    // (optional) additional configuration for recommendations
        id: 'my-recs-id',
        tag: 'no-results',
      },
    },
  }

<NoResults templates={templatesConfig} />
```

### contactsList
The `contactsList` prop takes an array of contact objects to render in the contact section. each object takes a title, and content.

```jsx
const list = [
			{
				title: `Address`,
				content: `123 Street Address<br />City, State, Zipcode`,
			},
			{
				title: `Hours`,
				content: `Monday - Saturday, 00:00am - 00:00pm<br />Sunday, 00:00am - 00:00pm`,
			},
			{
				title: `Phone`,
				content: `<a href="tel:1234567890">123-456-7890</a>`,
			},
			{
				title: `Email`,
				content: `<a href="mailto:email@site.com">email@site.com</a>`,
			},
		],

<NoResults contactsList={list} />
```
