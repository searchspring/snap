# ResultTracker

Adds impression, render and click tracking to an individual result within a controller.

## Usage

### controller
The required `controller` prop specifies a reference to a Controller object.

```jsx
<ResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</ResultTracker>
```

### children
The required `children` prop specifies the contents of the result component (the tracker is a wrapper around this). 

```jsx
<ResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</ResultTracker>
```

### result
The required `result` prop specifies a reference to a product object from the `results` store array. This reference is used when gathering the required data to track.

```jsx
<ResultTracker controller={controller} result={result}>
	<Result result={result}></Result>
</ResultTracker>
```

### track
The `track` prop is an object that allows for the disabling of parts of the tracking functionality. The keys are `render`, `impression` and `click` - setting them to false prevents the tracking event for the result. The following example would disable all events except for the click tracking.

```jsx
<ResultTracker controller={controller} result={result} track={{ render: false, impression: false }}>
	<Result result={result}></Result>
</ResultTracker>
```
