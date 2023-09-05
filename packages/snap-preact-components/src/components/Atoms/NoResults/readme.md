# NoResults

Renders no results verbiage. 

## Usage

### controller
The optional `controller` prop specifies a reference to the `Search Controller`. This is mainly used for the 'did you mean' section. 

```jsx
<NoResults controller={controller} />
```

### hideContact
The `hideContact` prop will prevent the contact list and title from rendering.

```jsx
<NoResults hideContact={true} />
```

### staticSlot
The `staticSlot` prop provides a slot to override the entire inner content of the component. 

```jsx
const slot = <div>Nothing found..</div>

<NoResults staticSlot={slot} />
```

### dymText
The `dymText` prop overrides the `did you mean` text that shows when the search store contains a `didYouMean` term. Note the `did you mean` section requires a search controller in order to render. 

```jsx
<NoResults controller={controller} dymText={'no results found'} />
```

### suggestionsTitleText
The `suggestionsTitleText` prop allows you to set the inner text of the suggestions title.

```jsx
<NoResults suggestionsTitleText={'suggestions'} />
```

### contactsTitleText
The `contactsTitleText` prop allows you to set the inner text contacts title.

```jsx
<NoResults contactsTitleText={'contacts'} />
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
