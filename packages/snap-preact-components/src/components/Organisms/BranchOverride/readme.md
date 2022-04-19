# BranchOverride

Renders a popup to show when a branch override is in place.
Executed `onRemoveClick` prop when the remove button is clicked.
Must have `name` and either `details` or `error` props to render.

## Components Used
- Icon

## Usage

### name
The required `name` prop expects a string containing the name of the override branch.

```jsx
<BranchOverride name="testing" />
```

### details
The `details` prop expects an object containing strings for the `url` and `lastModified` date of the override branch bundle.

```jsx
const details = {
	url: 'https://snapui.searchspring.io/y56s6x/next/bundle.js',
	lastModified: '1 Feb 2022 1:02:03 GMT'
};

<BranchOverride name="testing" details={details} />
```

### error
The `error` prop expects an object containing strings for the `message` and `description` of the error.

```jsx
const error = {
	message: 'Branch not found!',
	description: 'Incorrect branch name or branch no longer exists.'
};

<BranchOverride name="next" error={error} />
```

### onRemoveClick
The `onRemoveClick` prop is a function to be called when the 'remove' button is clicked

```jsx
const whenRemoved = (e, name) => {
	console.log(`removed the ${} branch`);
};

<BranchOverride name="testing" url="https://snapui.searchspring.io/siteid/testing/bundle.js" onRemoveClick={whenRemoved} />
```

### darkMode
The `darkMode` prop is used to set the component styling to prefer dark. By default the component will auto detect the browser preference.

```jsx
const details = {
	url: 'https://snapui.searchspring.io/y56s6x/next/bundle.js',
	lastModified: '1 Feb 2022 1:02:03 GMT'
};

<BranchOverride next="testing" details={details} darkMode />
```