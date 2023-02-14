# RecommendationProfileTracker

Adds impression, render and click beacon tracking to the profile.

NOTE: This is intended to be used with the RecommendationResultTracker. See examples below. 

## Usage

### controller
The required `controller` prop specifies a reference to a Recommendation Controller object.

```jsx
<RecommendationProfileTracker controller={recommendationController} />
```

### children
The required `children` prop specifies the contents of the Recommendation profile. 

```jsx
<RecommendationProfileTracker controller={controller}>
	<h2>title</h2>
	<div>
		{controller.store.results.map((result) => (
			<RecommendationResultTracker controller={controller} result={result}>
				<Result result={result}></Result>
			</RecommendationResultTracker>
		))} 
	</div>
</RecommendationProfileTracker>
```
