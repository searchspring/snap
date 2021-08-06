## Troubleshooting

Here are a few common gotchas. If you do not find what you're looking for here or have a question, we invite you to start a [discussion](https://github.com/searchspring/snap/discussions) or [report an issue](https://github.com/searchspring/snap/issues)

### Target element is not present while invoking `init`
If you attempt to initialize a snap component before the target element exists on the page, it may not be fully initialized. We recommend calling init after the DOMContentLoaded event has been invoked. 

```typescript
window.addEventListener('DOMContentLoaded', () => {
	autocomplete.init();
});

window.addEventListener('DOMContentLoaded', () => {
		searchPageTarget.retarget();
		contentTarget.retarget();
		sidebarTarget.retarget();
});
```

### Some middleware isn't executing at all
Most likely middleware that was attached prior to the one failing to execute failed to call the `await next()` function. This is required to allow other middleware to process the event data.

### Some middleware isn't executing when it should be
Most likely middleware that was attached is not using `async` functions, or failing to `await` the `next()` function.