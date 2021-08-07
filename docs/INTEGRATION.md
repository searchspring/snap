## Integration

When development has concluded the bundle is ready to be placed on a development or production site.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js"></script>
```

The bundle should be included in the `<head>` tag, ideally near the top of the node, and should not have a 'defer' or 'async' attribute. This is important for to start fetching results as soon as possible and to hide targeted elements that contain content - this prevents a flash of content replacement.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js"></script>
</head>
<body>
	<div id="searchspring-content">content that would show</div>
</body>
</html>

```