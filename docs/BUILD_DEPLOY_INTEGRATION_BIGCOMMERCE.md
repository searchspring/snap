# BigCommerce Integration

## Searchspring Management Console Actions

### Update Field Settings

On the [Field Settings page](https://manage.searchspring.net/management/field-settings/display-fields), make sure the following fields are updated:

| Field | Type | Multi-Valued | Display |
|---|---|:---:|:---:|
| categories_hierarchy | Text | | ✓ |
| brand | Text | No | ✓ |

If settings are changed, perform an [Update Index](https://manage.searchspring.net/management/index/status).

## Add IntelliSuggest Tracking

See [IntelliSuggest Tracking for BigCommerce Stencil](https://searchspring.zendesk.com/hc/en-us/articles/360056186252-IntelliSuggest-Tracking-for-BigCommerce-Stencil).

## Create a Category Search Page

**Warning:** Before creating this category page, ensure that the url does not already exist by going to `https://[domain]/shop`. If the url is active, alternative paths would be `search` or `ssearch`.

- Products > Product Categories and click "Create a Category".
- Set the category details to the following:

| Option | Value |
|---|---|
| Name | Searchspring |
| URL | /searchspring/ |
| Parent Category | -- No Parent Category -- |
| Template Layout File | Default (aka category.html) |
| Search Engine Optimization > Page Title | (leave blank) |

- On the "Product Categories" listing, set the "Searchspring" category to Visible in Menu > No ("x" icon).
- On the "Product Categories" listing, click Actions > New Sub Category to the right of the "Searchspring" row.
- Set the category details to the following:

| Option | Value |
|---|---|
| Name | Search Results |
| URL | /shop/ |
| Parent Category | Searchspring |
| Template Layout File | Default (aka category.html) |
| Search Engine Optimization > Page Title | Search Results |

- Leave the "shop" page as Visible in Menu > Yes ("check" icon).
- You do not need to add products to these categories.
- You can preview the category by going to `https://[domain]/shop`.

**Caution:** If you are not seeing your category page, it may be because the page is locked down (by default) to certain customer groups. Go to Customers > Customer Groups > "..." under Actions > Edit > Group Details > Group Access.

## Theme Integration

Next we'll integrate Searchspring into the theme.

- Create a copy of the current theme to integrate on. It is recommended to do so rather than integrating directly on the live theme initially to allow for testing prior to going live.
- Storefront > My Themes > Live theme > Advanced > Make a Copy.
- Rename the duplicated theme to something like "Theme Name - Searchspring".
- Previewing an unpublished theme copy is not particularly easy with BigCommerce as there is no preview theme link. First, right click on "My Themes" in the left navigation and open this in a new tab. An extra tab is needed so you can go back through the BigCommerce admin and edit code. On either tab, next to the copy of your theme there should be an icon that looks like three dots "...". Click this then "Customize". If asked which theme style you want to view, pick the option that looks like the site (typically the first) and "Continue". This tab will now be used to preview the theme.

### Base.html Edits

- Storefront > My Themes > [theme name] > "..." icon > Edit Theme Files > templates > layout > base.html.
- Before the closing `</head>` tag, add the integration snippet.

#### Search Only

**Note:** If you are only integrating Search page functionality, you can use the following snippet. Otherwise skip this section and continue below to install both search, category, and brand functionality.

- Update `REPLACE_WITH_YOUR_SITE_ID` with the correct site id.
- If your search page url was not `/shop/`, update this as needed.

```handlebars
{{!-- START: Searchspring Integration code --}}

{{!-- define initial variables --}}
{{assignVar 'ss_site_id' 'REPLACE_WITH_YOUR_SITE_ID'}}
{{assignVar 'ss_search_url' '/shop/'}}
{{assignVar 'ss_page_type' 'other'}}

{{!-- check if on search page --}}
{{#if category}}
	{{#contains category.url (getVar 'ss_search_url')}}{{assignVar 'ss_page_type' 'search'}}{{else}}{{assignVar 'ss_page_type' 'category'}}{{/contains}}
{{else if brand}}
	{{assignVar 'ss_page_type' 'brand'}}
{{/if}}

{{!-- create integration script --}}
<script type="text/javascript" src="https://snapui.searchspring.io/{{getVar 'ss_site_id'}}/bundle.js" id="searchspring-context"{{#if (getVar 'ss_page_type') '==' 'search'}} defer{{/if}}>
	{{#if customer}}
		shopper = { id : "{{ customer.id }}", group : "{{ customer.customer_group_id }}" };
	{{/if}}
</script>

{{!-- END: Searchspring Integration code --}}
```

#### Search, Category, and Brand

- Update `REPLACE_WITH_YOUR_SITE_ID` with the correct site id.
- If your search page url was not `/shop/`, update this as needed.
- Replace the `>` character in the breadcrumb trail if the data is using a different delimiter.

```handlebars
{{!-- START: Searchspring Integration code --}}

{{!-- define initial variables --}}
{{assignVar 'ss_site_id' 'REPLACE_WITH_YOUR_SITE_ID'}}
{{assignVar 'ss_search_url' '/shop/'}}
{{assignVar 'ss_page_type' 'other'}}
{{assignVar 'ss_is_loaded' 'false'}}

{{!-- check if results should load --}}
{{#or category brand}}
	{{assignVar 'ss_is_loaded' 'true'}}
{{/or}}

{{!-- check if on search page --}}
{{#if category}}
	{{#contains category.url (getVar 'ss_search_url')}}{{assignVar 'ss_page_type' 'search'}}{{else}}{{assignVar 'ss_page_type' 'category'}}{{/contains}}
{{else if brand}}
	{{assignVar 'ss_page_type' 'brand'}}
{{/if}}

{{!-- create integration script --}}
<script type="text/javascript" src="https://snapui.searchspring.io/{{getVar 'ss_site_id'}}/bundle.js" id="searchspring-context"{{#if (getVar 'ss_is_loaded') '==' 'false'}} defer{{/if}}>
	{{#if customer}}
		shopper = { id : "{{ customer.id }}", group : "{{ customer.customer_group_id }}" };
	{{/if}}
	{{#if (getVar 'ss_page_type') '==' 'category'}}
		category = { id : "{{ category.id }}", name : "{{#replace '"' category.name}}&quot;{{else}}{{category.name}}{{/replace}}", path : "{{#each breadcrumbs}}{{#unless @first}}{{#replace '"' name}}&quot;{{else}}{{name}}{{/replace}}{{#unless @last}}>{{/unless}}{{/unless}}{{/each}}" };
	{{else if (getVar 'ss_page_type') '==' 'brand'}}
		brand = { name: "{{#replace '"' brand.name}}&quot;{{else}}{{brand.name}}{{/replace}}" };
	{{/if}}
</script>

{{!-- END: Searchspring Integration code --}}
```

### Body Class Name

(Optional) There may be occasions where you need to add a class name to the `body` element on the search page for styling purposes.

If `body` tag has no `class` attribute:

```handlebars
<body{{#if (getVar 'ss_page_type') '==' 'search'}} class="ss-shop"{{/if}}>
```

If `body` tag has a `class` attribute, ensure to keep the existing class names and append the `ss-shop` class name to the existing list of class names:

```handlebars
<body class="bigcommerce-class-name{{#if (getVar 'ss_page_type') '==' 'search'}} ss-shop{{/if}}">
```

## Category and Brand Page Edits

Next we'll add our target element(s) to the category and brand pages. This is where the Searchspring elements will be injected into, typically two elements are added for a two-column layout: one for content, and one for facets.

Targets are defined in your Snap configuration and will only be injected into if they exist on the page.

### Category Page Edits

- Storefront > My Themes > [theme name] > "..." icon > Edit Theme Files > templates > pages > category.html.
- `category.html` is a standard BigCommerce template, but this may not be the file to edit. Look for includes which will tell you where to go, for example: `{{> thing/parent/child}}`. This says that there's additional code for the category page located in another file that has the name "child".
- Once the correct file is found, ensure that all of your search controller targets are added to the category template. Use theme comments to hide the store's default product grid, thus speeding up load time for Searchspring.

```handlebars
<div id="searchspring-sidebar" style="min-height: 100vh;"></div>
{{!-- 
	<!-- default filters layout -->
--}}

<div id="searchspring-content" style="min-height: 100vh;"></div>
{{!-- 
	<!-- default grid layout -->
--}}
```

- Sidebar elements may be within a separate file. Typically this is found in Storefront > My Themes > [theme name] > "..." icon > Edit Theme Files > templates > components > category > sidebar.html, which is the sidebar layout specifically for category pages.
- Some category templates will only display sidebar or results content if products are assigned to the category. You can make these elements show on the category search page with additional checks where required.

Show an element only when on the `shop` category:

- If your search page url was not `/shop/`, update this as needed.

```handlebars
{{#contains category.url '/shop/'}}
	<!-- add logic -->
{{/contains}}
```

### Brand Page Edits

- Storefront > My Themes > [theme name] > "..." icon > Edit Theme Files > templates > pages > brand.html.
- Make sure you are within `brand.html` as `brands.html` file contains the listing of all brands.
- `brand.html` is a standard BigCommerce template, but this may not be the file to edit. Look for includes which will tell you where to go, for example: `{{> thing/parent/child}}`. This says that there's additional code for the brand page located in another file that has the name "child".
- Once the correct file is found, ensure that all of your search controller targets are added to the brand template. Use theme comments to hide the store's default product grid, thus speeding up load time for Searchspring.

```handlebars
<div id="searchspring-sidebar" style="min-height: 100vh;"></div>
{{!-- 
	<!-- default filters layout -->
--}}

<div id="searchspring-content" style="min-height: 100vh;"></div>
{{!-- 
	<!-- default grid layout -->
--}}
```

- Sidebar elements may be within a separate file. Typically this is found in Storefront > My Themes > [theme name] > "..." icon > Edit Theme Files > templates > components > brand > sidebar.html, which is the sidebar layout specifically for brand pages.

## Search Form Updates

Next we'll update the search form to submit to the search results category page (ie. `/shop/`) we created.

- Storefront > My Themes > [theme name] > "..." icon > Edit Theme Files > components > common > header.html.
- If you do not see the search form in the header, it might be in another snippet. For example: Often in the header file you'll find the following line of code `{{> components/common/quick-search}}`. This means the search form is in quick-search.html.
- Alternate locations:
  - Storefront > My Themes > [theme name] > "..." icon > Edit Theme Files > components > common > quick-search.html
  - Storefront > My Themes > [theme name] > "..." icon > Edit Theme Files > components > common > search-box.html
- Create a copy of the form which you will edit and comment out the old form. This will allow us to retain BigCommerce's default functionality.

```handlebars
{{!-- 
	<!-- Untouched form code -->
--}}
<!-- Altered form code -->
```

In your form copy, update the following details:

| Element | Attribute | Value |
|---|---|---|
| form | method | get |
| form | action | /shop/ |
| input | | remove any `data-search-quick` attribute |
| input[type="hidden"] | | remove any hidden inputs |
| div | | remove any `quickSearchResults` div |

## Integration Code

Up until this point, we've added the Searchspring integration to the theme and category/brand pages.

Now we'll ensure our integration code captures the context variables and sets up the necessary configuration.

### Check Shopper and Site ID Code

For tracking shopper data used in personalization features, we need to include code in `src/index.js`. Shopper code should be in `index.js` by default, but if not, follow the below steps. `siteId` context should also be included, but adding it will allow for the implementation of multi-site integrations later.

```js
// src/index.js
/* searchspring imports */
import { Snap } from '@searchspring/snap-preact';
import { getContext } from '@searchspring/snap-toolbox';

/* context from script tag */
const context = getContext(['shopper', 'siteId']);
```

### Add Site and Page Objects

Still within `index.js`, add objects to setup a `site` and `page` config. This may already be present depending on what Snap templates you are using.

**Note:** Update `REPLACE_WITH_YOUR_SITE_ID` with the correct, default site id.

**Note:** If the default query parameter is something other than "search_query", update the parameter.

**Warning:** Due to certain issues with BigCommerce integrations, these sites should always change the pagination parameter to not match the default. "p" as the page parameter is usually our default for this platform.

```js
// src/index.js

/* set up site details config */
let site = {
	id: context?.siteId ? context.siteId : 'REPLACE_WITH_YOUR_SITE_ID',
	currency: 'usd',
	lang: 'en',
	parameters: {
		query: 'search_query',
		page: 'p',
	},
	features: {
		integratedSpellCorrection: {
			enabled: true,
		},
	},
};

/* set up page details config */
let isSearch = window.location.href.includes('/shop') || window.location.href.includes('/mockup') || window.location.href.includes('/lighthouse') ? true : false;
let page = {
	id: isSearch ? 'shop' : 'other',
	title: isSearch ? 'Search Results' : 'Other Page',
	type: isSearch ? 'search' : 'other',
};
```

Pass these configs into a plugin and set on `store.custom`:

```js
// src/plugins/sharedPlugin.js
export const sharedPlugin = (controller, site, page) => {
	// set initial custom settings for project
	controller.store.custom = { ...controller.store.custom, site: site, page: page };
};
```

For a fuller example, please see the template repo [here](https://github.com/searchspring/snapfu-template-preact-implementations/tree/production/src).

### Category and Brand Integration (Optional)

If integrating on category and brand pages, follow these steps. If not, skip this section.

Back in `src/index.js`, adjust context to grab additional values for category and brand integration.

```js
// src/index.js
/* context from script tag */
const context = getContext(['category', 'brand', 'shopper', 'siteId']);
```

Below this, add code to support background filters on a `search` controller. As a best practice, for category pages we use `categories_hierarchy` as it contains a unique, hierarchal path for the category. On brand, the `brand` data should contain the brand name.

```js
// src/index.js

/* background filters */
let backgroundFilters = [];

if (context.category?.path) {
	const categoryPath = replaceCharacters(context.category.path);
	const categoryName = replaceCharacters(context.category.name);

	// update page details when on category
	page = {
		id: categoryPath,
		title: categoryName,
		type: 'category',
	};

	// set category background filter
	backgroundFilters.push({
		field: 'categories_hierarchy',
		value: categoryPath,
		type: 'value',
		background: true,
	});
} else if (context.brand?.name) {
	const brandName = replaceCharacters(context.brand.name);

	// update page details when on brand
	page = {
		id: brandName,
		title: brandName,
		type: 'brand',
	};

	// set brand background filter
	backgroundFilters.push({
		field: 'brand',
		value: brandName,
		type: 'value',
		background: true,
	});
}

/* replace special characters in values */
function replaceCharacters(value) {
	if (value) {
		return value.replace(/\&amp\;/g, '&').replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>').replace(/\&quot\;/g, '"').replace(/\&#039\;/g, "'").replace(/\&#x27\;/g, "'").trim();
	} else {
		return '';
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
            siteId: 'REPLACE_WITH_YOUR_SITE_ID',
        },
    },
    controllers: {
        search: [
            {
                config: {
                    id: 'search',
					plugins: [[sharedPlugin, site, page], [contentPlugin]],
                    settings: {
						redirects: {
							singleResult: true,
						},
						facets: {
							pinFiltered: true,
						},
					},
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

**Note:** Typically, you should complete the brand integration even if brand pages are not visible. This gives the client the option to show brand integration later. You can find brand pages by going to `https://[domain]/brands` then click on one of the brands in the listing.

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
