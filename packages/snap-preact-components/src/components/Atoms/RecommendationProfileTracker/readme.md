# RecommendationProfileTracker

Adds impression, render and click beacon tracking to the profile. NOTE this is intended to be used with the RecommendationProfileTracker. See examples below. 

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
		{controller.store.map((result) => (
			<RecommendationResultTracker controller={controller} result={result}>
				<Result result={result}></Result>
			</RecommendationResultTracker>
		))} 
	</div>
</RecommendationProfileTracker>
```

### results
The optional `results` prop is used when using a result set that differs from the entire result set in the store. results prop is passed to the track.render function for tracking product renders. 

```jsx
<RecommendationProfileTracker controller={recommendationController} results={trimmedResults}>
	{trimmedResults.map((result) => (
		<RecommendationResultTracker controller={controller} result={result}>
			<Result result={result}></Result>
		</RecommendationResultTracker>
	))} 
</RecommendationProfileTracker>

```
