## Troubleshooting

Here are a few common gotchas. If you do not find what you're looking for here or have a question, we invite you to start a [discussion](https://github.com/searchspring/snap/discussions) or [report an issue](https://github.com/searchspring/snap/issues)

### Target element is not present prior to Snap instantiation.
If you attempt to render a snap component using a DomTargeter before the target element exists on the page, the target will not be found and the rendering inside of the `onTarget` callback will not occur. Re-targetting can be manually invoked in these cases. 

```typescript
searchPageTargeter.retarget();
```

### Some middleware isn't executing at all
Most likely middleware that was attached prior to the one failing to execute failed to call the `await next()` function. This is required to allow other middleware to process the event data.