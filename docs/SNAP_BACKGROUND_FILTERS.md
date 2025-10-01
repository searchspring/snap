# Background Filters
Background filters allow a page to be refined without displaying the active filter to the end-user. This is primarily used for category pages, although can also be used for custom functionality such as restricting visibility of products to user groups. The filter value is commonly retrieved from a context variable and applied as a background filter within the Snap config object. Background filters could also be applied to all services by setting `client.globals.filters` in the Snap config instead of on a per-controller basis.

## Background Filter Object

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `field` | string | ✔️ | The field name to filter on (e.g., 'collection_handle', 'category', 'brand') |
| `value` | string \| number \| array | ✔️ | The value(s) to filter by. Can be a single value or array of values (if type is 'range'). For multiple 'value' type filters provide an entry for each value as a new background filter object. |
| `type` | string | ✔️ | Filter type. Common values: 'value', 'range' |
| `background` | boolean | ✔️ | Must be set to `true` to indicate this is a background filter |


In this example, we'll retrieve the `collection` object from the context and apply it as a category background filter for our search controller.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	collection = {
		handle: 'Shirts'
	};
</script>
```

```typescript
import { getContext } from '@searchspring/snap-toolbox';

const context = getContext(['collection']);
const backgroundFilters = [];

if (context.collection?.handle) {
	// set background filter
	if (context.collection.handle != 'all') {
		backgroundFilters.push({
			field: 'collection_handle',
			value: context.collection.handle,
			type: 'value',
			background: true,
		});
	}
}

const config = {
	client: {
		globals: {
			siteId: 'abc123',
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					globals: {
						filters: backgroundFilters,
					},
				},
			},
		],
	},
};

const snap = new Snap(config);
```
