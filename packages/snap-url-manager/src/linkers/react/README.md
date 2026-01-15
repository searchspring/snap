# React Linker
The `reactLinker` is passed in when instantiating a `UrlManager`. The `reactLinker` provides convenience when using URLs with UI components.

It is typically spread on an anchor tag when used.
```js
<a {...value.url.link}>{ value.label }</a>
```

Type of object returned by `link`:
```js
type linkObject = {
	href: string;
	onClick: (e: Event) => void;
};
```

The `onClick` provided by the `reactLinker` prevents the default behavior of the event and calls the `go()` method of the `UrlManager` that the linker is attached to.