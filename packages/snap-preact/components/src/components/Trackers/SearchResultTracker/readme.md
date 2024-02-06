# SearchResultTracker

Adds click beacon tracking to an individual result.

## Usage

### controller
The required `controller` prop specifies a reference to a Controller object.

```jsx
<SearchResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</SearchResultTracker>
```

### children
The required `children` prop specifies the contents of the result component. 

```jsx
<SearchResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</SearchResultTracker>
```

### result
The required `result` prop specifies a reference to a product object from the `results` store array.

```jsx
<SearchResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</SearchResultTracker>
```
