# RecommendationResultTracker

Adds impression, render and click beacon tracking to an individual result. 

## Usage

### controller
The required `controller` prop specifies a reference to a Recommendation Controller object.

```jsx
<RecommendationResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</RecommendationResultTracker>
```

### children
The required `children` prop specifies the contents of the result component. 

```jsx

<RecommendationResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</RecommendationResultTracker>
```

### result
The required `result` prop specifies a reference to a product object from the `results` store array.

```jsx
<RecommendationResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</RecommendationResultTracker>

```
