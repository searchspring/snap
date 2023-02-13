# RecommendationResultTracker

Adds impression, render and click beacon tracking to an individual result within a profile.

NOTE: This is intended to be used with the RecommendationProfileTracker. See examples below. 

## Usage

### controller
The required `controller` prop specifies a reference to a Recommendation Controller object.

```jsx
<RecommendationProfileTracker controller={controller}>
	<RecommendationResultTracker controller={controller} result={result}>
		<Result result={result}></Result>
	</RecommendationResultTracker>
</RecommendationProfileTracker>
```

### children
The required `children` prop specifies the contents of the result component. 

```jsx
<RecommendationProfileTracker controller={controller}>
	<RecommendationResultTracker controller={controller} result={result}>
		<Result result={result}></Result>
	</RecommendationResultTracker>
</RecommendationProfileTracker>
```

### result
The required `result` prop specifies a reference to a product object from the `results` store array.

```jsx
<RecommendationProfileTracker controller={controller}>
	<RecommendationResultTracker controller={controller} result={result}>
		<Result result={result}></Result>
	</RecommendationResultTracker>
</RecommendationProfileTracker>
```
