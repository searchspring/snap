## Integration

When development has concluded the bundle is ready to be placed on a development or production site.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	// contexet variables go here
</script>
```

The bundle should be included in the `<head>` tag, ideally near the top of the node, and should not have a 'defer' or 'async' attribute. This location is important in order to start fetching results and as soon as possible. This placement prior to any body elements also serves to allow for the hiding of targeted elements that contain content - this preventing a flash when the contents change upon injection.

Context variables should be placed inside the script tag, see the documentation for [context variables](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION_CONTEXT.md) for more details.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Snap Integration Example</title>

	<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
		// contexet variables go here
	</script>
</head>
<body>
	<div id="searchspring-content"><!-- an element that will be injected into --></div>
</body>
</html>

```