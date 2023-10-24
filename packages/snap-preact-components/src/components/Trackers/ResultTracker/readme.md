# ResultTracker

Adds click beacon tracking to an individual result.

## Usage

### controller
The required `controller` prop specifies a reference to a Controller object.

```jsx
<ResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</ResultTracker>
```

### children
The required `children` prop specifies the contents of the result component. 

```jsx
<ResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</ResultTracker>
```

### result
The required `result` prop specifies a reference to a product object from the `results` store array.

```jsx
<ResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</ResultTracker>
```
