# Shopify Integration


## Searchspring Management Console Actions

Log into the Searchspring Management Console (SMC) and perform the following actions:

### Add IntelliSuggest Tracking

Shopify sites now add IntelliSuggest tracking through "Web Pixel Tracking". In the SMC, check the [Data Feed page](https://manage.searchspring.net/management/data-feed) and ensure this feature is enabled. If it's not, speak with the Solutions team member who setup the account.

### Update Field Settings

On the [Field Settings page](https://manage.searchspring.net/management/field-settings/display-fields), make sure the following fields are updated:

| Field | Type | Multi-Valued | Display | Display In Recs |
|---|---|:---:|:---:|:---:|
| collection_handle | Text | | ✓ | |
| handle | Text | No | ✓ | ✓ |
| tags | Text | , | ✓ | |
| vendor | Text | No | ✓ | |
| product_type | Text | No | ✓ | |

If settings are changed, perform an [Update Index](https://manage.searchspring.net/management/index/status).

### "All" Collection Page (Optional)

Most if not all Shopify sites have an "All" collection page located at `[domain]/collections/all`. Typically, products are automatically assigned to this collection and then fed back into our data feed. There have been occasions where this is not true and we don't have the `collection_handle` > `all` assignment in our data feed. If this happens, please inquire with Searchspring support to have this added.

## Create a Collection Search Page

To add a search results page, we'll need to create a new collection in Shopify.

**Warning:** Before creating this collection page, ensure that the url does not already exist by going to `https://[domain]/collections/shop`. If the url is active, an alternative path could be `search`.

- Within the Shopify Admin, navigate to Products > Collections > Create collection.
- Set the collection details to the following:

| Option | Value |
|---|---|
| Title | Shop |
| Collection type | Manual |

- You do not need to add products to this collection.
- The initial title value determines the collection handle so starting with "Shop" ensures the url is `/collections/shop`. If you need to use another url path, your "Title" should be different to format the correct collection handle.
- After saving, edit this collection once more and change the "Title" to "Search Results".
- You can preview the collection by going to `https://[domain]/collections/shop`.


## Theme Integration

Next we'll integrate Searchspring into the theme.

- Create a copy of the current theme to integrate on. It is recommended to do so rather than integrating directly on the live theme initially to allow for testing prior to going live.
- Online Store > Themes > Live theme > ... > Duplicate
- To grab a link to the copied theme, click Online Store > Themes > [theme name] > ... > right click Preview > and Copy Link Address.

### Theme Settings

Next, we'll add the Searchspring theme settings. Theme settings are defined to provide an interface for defining variables that are used in liquid code. See [Shopify Setting Types](https://shopify.dev/themes/architecture/settings#setting-types) for more information. These theme settings are then accessed by going to Online Store > Themes > [theme name] > Customize button. Click on "Theme settings" in the lower left navigation and on the right side, there should be a "Searchspring" section.

- Online Store > Themes > [theme name] > ... > Edit code > Config > `settings_schema.json`.
- At the end of the file, find a closing square bracket `]` on the last line.
- Before this closing bracket, add code for Searchspring theme settings. The opening comma is needed if there is another configuration before your code paste.

```json
{
	"name": "Searchspring",
	"settings": [
		{
			"type": "checkbox",
			"id": "ss_enable",
			"label": "Enable Searchspring",
			"default": true
		},			
		{
			"type": "text",
			"id": "ss_site_id",
			"label": "Site ID",
			"default": "xxxxxx"
		},
		{
			"type": "text",
			"id": "ss_collection_handle",
			"label": "Search collection handle",
			"default": "shop"
		},
		{
			"type": "text",
			"id": "ss_branch_name",
			"label": "Branch Name"
		}
	]
}
```

- Replace `xxxxxx` on line 15 with the correct siteId found in the Searchspring Management Console.
- (if applicable) Replace `shop` on line 21 with the search collection handle if it was not `shop`.


## Create a Liquid Template Snippet

Liquid template snippets are used to store code that is used in multiple templates.

Create a new snippet which will be used to store the Searchspring integration script code.

- Online Store > Themes > [theme name] > ... > Edit code > Snippets > Add a new snippet > `ss-script`.

### Search Only

**Note:** If you are only integrating Search page functionality, you can use the following snippet. Otherwise skip this section and continue below to install both search and collections functionality.

```liquid
{%- if settings.ss_branch_name != blank -%}
	{% capture ss_branch_name %}/{{ settings.ss_branch_name }}{% endcapture %}
{%- endif -%}

{%- if customer -%}
	{% capture ss_shopper_config %} 
		shopper = { id: "{{ customer.id }}" };
	{% endcapture %}
{%- endif -%}

{% assign ss_defer_config = ' defer' %}
{%- if collection.handle and template contains 'collection' and collection.handle == settings.ss_collection_handle -%}
	{% assign ss_defer_config = '' %}
{%- endif -%}

{%- if template -%}
	{% capture ss_template_config %}
		template = "{{ template }}";
	{% endcapture -%}
{%- endif -%}

{% capture ss_money_config %}
	format = "{{ shop.money_format }}";
{% endcapture %}

{% comment %}Searchspring Script{% endcomment %}
<script src="https://snapui.searchspring.io/{{ settings.ss_site_id }}{{ ss_branch_name }}/bundle.js" id="searchspring-context"{{ ss_defer_config }}>
	{{ ss_shopper_config }}{{ ss_template_config }}{{ ss_money_config }}
</script>
```

### Search and Collections

```liquid
{%- if settings.ss_branch_name != blank -%}
	{% capture ss_branch_name %}/{{ settings.ss_branch_name }}{% endcapture %}
{%- endif -%}

{%- if customer -%}
	{% capture ss_shopper_config %} 
		shopper = { id: "{{ customer.id }}" };
	{% endcapture %}
{%- endif -%}

{% assign ss_defer_config = ' defer' %}
{%- if collection.handle and template contains 'collection' -%}
	{% assign ss_defer_config = '' %}
	{%- if collection.handle != settings.ss_collection_handle -%}
		{% capture ss_collection_config %} 
			collection = { id: "{{ collection.id }}", name: "{{ collection.title | replace: '"', '&quot;' }}", handle: "{{ collection.handle }}" };
		{% endcapture %}
	{%- endif -%}	
{%- endif -%}

{%- if current_tags -%}
	{% capture ss_tags_config %}
		tags = {{ current_tags | json }};
	{% endcapture %}
{%- endif -%}

{%- if template -%}
	{% capture ss_template_config %}
		template = "{{ template }}";
	{% endcapture -%}
{%- endif -%}

{% capture ss_money_config %}
	format = "{{ shop.money_format }}";
{% endcapture %}

{% comment %}Searchspring Script{% endcomment %}
<script src="https://snapui.searchspring.io/{{ settings.ss_site_id }}{{ ss_branch_name }}/bundle.js" id="searchspring-context"{{ ss_defer_config }}>
	{{ ss_shopper_config }}{{ ss_collection_config }}{{ ss_tags_config }}{{ ss_template_config }}{{ ss_money_config }}
</script>
```

### Snippet Installation

Next, we'll integrate the `ss-script` snippet into the theme. We'll have to add the snippet to the theme.liquid file such that it is included on every page.
It is recommended to install the snippet in the `head` tag so that the script is loaded as soon as possible.

- Online Store > Themes > [theme name] > ... > Edit code > Layout > `theme.liquid`.
- Before the closing `</head>` tag, add the following code:

```liquid
{% if settings.ss_enable %}
	{% render 'ss-script' %}
{% endif %}
```

### Body class name

(Optional) There may be occasions where you need to add a class name to the `body` element on the search page for styling purposes.

If `body` tag has no `class` attribute:

```liquid
<body{% if settings.ss_enable and collection.handle and collection.handle == settings.ss_collection_handle %} class="ss-shop"{% endif %}>
```

If `body` tag has a `class` attribute, ensure to keep the existing class names and append the `ss-shop` class name to the existing list of class names:

```liquid
<body class="shopify-class-name{% if settings.ss_enable and collection.handle and collection.handle == settings.ss_collection_handle %} ss-shop{% endif %}">
```

## Collection Page Edits

Next we'll add our target element(s) to the collection page. This is where the Searchspring elements will be injected into, typically two elements are added for a two-column layout: one for content, and one for facets. 

Targets are defined in your Snap configuration and will only be injected into if they exist on the page.

- Online Store > Themes > [theme name] > ... > Edit code > Templates > `collection.liquid`.
- `collection.liquid` is a standard Shopify template, but this may not be the file to edit depending on your theme. Look for includes which will tell you where to go, for example: `{% section 'collection-main' %}`. This says that there's additional code for the collection page located in the section file that has the name "collection-main".
- Once the correct file is found, ensure that all of your search controller targets are added to the collection template. By using the `ss_enable` condition, we can retain Shopify's default functionality for when Searchspring is disabled via the theme settings.

```liquid
{% if settings.ss_enable %}
	<div id="searchspring-sidebar" style="min-height: 100vh;"></div>
{% else %}
	<!-- existing default filters layout code -->
{% endif %}

{% if settings.ss_enable %}
	<div id="searchspring-content" style="min-height: 100vh;"></div>
{% else %}
	<!-- existing default grid layout code -->
{% endif %}
```

## Autocomplete Form Submission

Next we'll update the search form to submit to the search results collection page (ie. `/shop`) we created.

- Online Store > Themes > [theme name] > ... > Edit code > Layout > `theme.liquid`.
- Check for the search form. It may not be in this file, but check for its approximate location and then look in includes such as snippets or sections for its actual location. Other possible file names might be `form-search.liquid`, `header.liquid`, etc.
- Create a copy of the form which you will edit and comment out the old form. This will allow us to retain Shopify's default functionality for when Searchspring is disabled via the theme settings.

```liquid
{% if settings.ss_enable %}
	<form method="get" action="{{ routes.collections_url }}/{{ settings.ss_collection_handle }}">
		<input id="searchspring-input" type="search" name="q" placeholder="Search" aria-label="Search">
	</form>
{% else %}
	<!-- Original form code from file -->
{% endif %}
```

In your form copy, update the following details:

| Element | Attribute | Value |
|---|---|---|
| form | method | get |
| form | action | `{{ routes.collections_url }}/{{ settings.ss_collection_handle }}` |
| input[type="hidden"] | | remove any hidden inputs |


## Integration Code

Up until this point, we've added the Searchspring integration to the theme and collection page. 

Now we'll ensure our integration code captures the context variables.

```js
// src/index.js
/* context from script tag */
const context = getContext(['collection', 'tags', 'template', 'shopper', 'siteId']);
```

Below this, add code to support background filters on a `search` controller. As a best practice, we use `collection_handle` as this has unique values in comparison to collection name. Certain integrations also use tags to further filter products on collections (for example: `/collections/shirts/red` where `red` is a color tag), which is why we set an additional filter on `tags`. Additionally, this code snippet updates page details so you can use conditionals matching the current page in code.

**Note:** Shopify has default collections to store vendors and types with urls of `/collections/vendors` and `/collections/types` respectively. To show a vendor or type, a query is applied to the url like `/collections/vendors?q=Awesome Brand`. To show results on these pages, in the code below we will take the page title from script context and apply it as a background filter with the `vendor` or `product_type` field.

```js
// src/index.js

/* set up page details config */
let isSearch = Boolean(window.location.href.includes('/shop'));
let page = {
	id: isSearch ? 'shop' : 'other',
	title: isSearch ? 'Search Results' : 'Other Page',
	type: isSearch ? 'search' : 'other',
};

/* background filters */
let backgroundFilters = [];
if (context.collection?.handle) {
	// replace characters on collection name
	const collectionName = context.collection.name.replace(/\&\#39\;/, "'");

	// update page details when on collection
	page = {
		id: context.collection.handle,
		title: collectionName,
		type: 'collection',
	};

	// set background filter
	if (context.collection.handle == 'vendors') {
		backgroundFilters.push({
			field: 'vendor',
			value: collectionName,
			type: 'value',
			background: true,
		});
	} else if (context.collection.handle == 'types') {
		backgroundFilters.push({
			field: 'product_type',
			value: collectionName,
			type: 'value',
			background: true,
		});
	} else {
		backgroundFilters.push({
			field: 'collection_handle',
			value: context.collection.handle,
			type: 'value',
			background: true,
		});
	}

	// handle collection tags (filters)
	if (context.tags && Array.isArray(context.tags)) {
		context.tags.forEach((tag) => {
			backgroundFilters.push({
				field: 'tags',
				value: tag,
				type: 'value',
				background: true,
			});
		});
	}
}
```

To attach the `backgroundFilters` to a `search` controller, they need to be added into a `globals` config.

```js
// src/index.js
import { sharedPlugin } from './plugins/sharedPlugin';
const snap = new Snap({
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
					plugins: [[sharedPlugin, page]],
                    globals: {
                        filters: backgroundFilters,
                    },
                },
                targeters: [
                    {
                        selector: '#searchspring-content',
                        component: async () => {
                            return (await import('./components/Content/Content')).Content;
                        },
                    },
                ],
            },
        ],
    },
});
```

## Update Product URLs

For most Shopify sites, the product url should be updated to include the collection handle in the url path. Within a plugin that is attached to all controllers, add the below code. Adding this code to a "global" plugin makes the function reusable. For example: this function may be needed when clicking on a product swatch or size option to change the url with the collection handle.

See example above to attach the plugin to the `search` controller.

```js
// src/plugins/sharedPlugin.js
export const sharedPlugin = (controller, page) => {
	// set initial custom settings for project
	controller.store.custom = { ...controller.store.custom, page: page };
	// update Shopify product url
	controller.store.custom.updateUrl = (handle) => {
		const { type, store } = controller;
		const page = store.custom.page;

		if (type == 'search') {
			const hasRoute = typeof Shopify == 'object' && typeof Shopify.routes == 'object' && typeof Shopify.routes.root == 'string' ? true : false;
			const routeShopify = hasRoute ? Shopify.routes.root : '/';
			const routeCollection = page.type == 'collection' ? `collections/${page.id}/` : ``;
			return `${routeShopify}${routeCollection}products/${handle}`;
		}
	};

	controller.on('afterStore', async ({ controller }, next) => {
		const page = controller.store.custom.page;
		const { results } = controller.store;

		if (page.type == 'collection' && results && results.length !== 0) {
			results.forEach((result) => {
				if (result.type != 'banner') {
					result.mappings.core.url = controller.store.custom.updateUrl(result.attributes.handle);
				}
			});
		}

		await next();
	});
}
```

**Note:** Both code blocks above use the `page` config, so make sure that is defined.

**Warning:** Only use this function on product results, meaning do not use it if you have content tabs with blog articles. It should also not be run on Autocomplete, as it could result in invalid urls. For example: if you are on a collection page for "shoes" and search "shirts", this would format the url as "/collections/shoes" which could result in invalid urls for the results.


## Additional Targets (Optional)

In addition to having two targets for a two-column layout, you may want to inject content into other sections of the page such above the content and sidebar to display information such as the search query. Note the addition of `ss-shop` class before `searchspring-header` to ensure the content is only injected on the search page.

```js
// src/index.js
targeters: [
	{
		selector: '#searchspring-content',
		component: async () => {
			return (await import('./content/content/Content')).Content;
		},
		hideTarget: true,
	},
	{
		selector: '#searchspring-sidebar',
		component: async () => {
			return (await import('./sidebar/sidebar/Sidebar')).Sidebar;
		},
		hideTarget: true,
	},
	{
		selector: '.ss-shop #searchspring-header',
		component: async () => {
			return (await import('./content/header/Header')).Header;
		},
		hideTarget: true,
	},
],
```

