# TermsList

Renders a list of terms for autocomplete. 

## Usage

### Controller

The `controller` prop specifies a reference to the autocomplete controller.

```jsx
<TermsList controller={controller} />
```

### modules

The `modules` prop is used to determine which terms render and in what order. Options include 'Trending' | 'Suggestions' | 'History';

```jsx
<TermsList controller={controller} modules={['Trending', 'Suggestions', 'History']}/>
```

### historyTitle

The `historyTitle` prop specifies the title to render above the history terms.

```jsx
<TermsList controller={controller} historyTitle={'History Terms'}/>
```

### suggestionTitle

The `historyTitle` prop specifies the title to render above the history terms.

```jsx
<TermsList controller={controller} suggestionTitle={'Suggested Terms'}/>
```

### trendingTitle

The `trendingTitle` prop specifies the title to render above the trending terms.

```jsx
<TermsList controller={controller} trendingTitle={'Trending Terms'}/>
```


### retainHistory

The `retainHistory` prop will cause the history terms to always render. 

```jsx
<TermsList controller={controller} retainHistory={true}/>
```

### retainTrending

The `retainTrending` prop will cause the Trending terms to always render. 

```jsx
<TermsList controller={controller} retainTrending={true}/>
```

### vertical

The `vertical` prop specifies if the terms should be rendered vertical or not. 

```jsx
<TermsList controller={controller} vertical={true}/>
```
