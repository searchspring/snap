# Magento2 Integration

## Searchspring Management Console Actions

### Update Field Settings

On the [Field Settings page](https://manage.searchspring.net/management/field-settings/display-fields), make sure the following fields are updated:

**For Search Only Integration:**

| Field | Type | Multi-Valued | Display |
|---|---|:---:|:---:|
| visibility | Text | , | ✓ |

**For Search and Category Integration:**

| Field | Type | Multi-Valued | Display |
|---|---|:---:|:---:|
| visibility | Text | , | ✓ |
| category_hierarchy | Text | \| | ✓ |

If settings are changed, perform an [Update Index](https://manage.searchspring.net/management/index/status).

## Add IntelliSuggest Tracking

Have the client install the following IntelliSuggest tracking module: [github.com/SearchSpring/magento2-searchspring-tracking](https://github.com/SearchSpring/magento2-searchspring-tracking).

Notify the client which site id to use for the section "How to Install", step 4, point iii.

## Create a Category Search Page

**Warning:** Before creating this category page, ensure that the url does not already exist by going to `https://[domain]/shop.html`. If the url is active, alternative paths would be `search` or `ssearch`.

**Note:** If this is a re-mockup (and sometimes even a re-platform), it is recommended to keep the same search page url (and query parameter) so customers do not need to create redirects. If the site was previously integrated using CMS page rather than a category search page, you should be able to proceed with the below methods. This is because CMS and category page urls can be formatted the same way.

- Magento 2 Admin > Left Navigation > Catalog > Categories > Add Subcategory.
- The category should be created wherever most categories are in the current view, which means usually you wouldn't use the "Add Root Category" button. Set the details to the following:

| Section | Option | Value |
|---|---|---|
| Currently Active | Enable Category | Yes |
| Include in Menu | No | |
| Category Name | Search Results | |
| Search Engine Optimization | Url Key | shop |
| Search Engine Optimization | Meta Title | Search Results |
| Design | Layout | 2 columns with left bar or 2 columns with right bar (but could be full width) |

- You do not need to add products to this category.
- You can preview the category by going to `https://[domain]/shop.html`.
- Go back to Magento 2 Admin > Left Navigation > Catalog > Categories. Click on the search category link to bring up the details. At the top of the page, it should say "Search Results (ID: 000000)". Note the id number as we will use it later.

## Theme Integration

Next we'll integrate Searchspring into the theme.

**Note:** If possible, have the site owner enable Template Path Hints. This will make it easier to find which files need to be changed.

### Root.phtml Edits

- FTP > app > design > frontend > [theme vendor] > [theme name] > Magento_Theme > templates > root.phtml.

**Caution:** If this file doesn't exist, find the root file of the same, make a copy, and upload it to the path above. Try looking in: vendor > magento > magento-theme > view > frontend > templates > root.phtml. Do not edit the root files directly because if the client updates Magento, this could erase the changes and break the integration.

- Add the below code at the end of the file.

#### Search Only

**Note:** If you are only integrating Search page functionality, you can use the following snippet. Otherwise skip this section and continue below to install both search and category functionality.

- Replace `REPLACE_WITH_YOUR_SITE_ID` with the correct site id.
- Replace `000000` with the search category id that was noted when creating the category page.

```php
<?php
	// Searchspring script flags
	$ss_enable = true;
	
	// Initial attributes values for Searchspring script tag
	$ss_site_id = 'REPLACE_WITH_YOUR_SITE_ID';
	$ss_defer_config = ' defer';

	// Get data from objectManager
	$ss_object_manager = \Magento\Framework\App\ObjectManager::getInstance();
	$ss_category = $ss_object_manager->get('Magento\Framework\Registry')->registry('current_category');

	// Update defer if on search category
	if (isset($ss_category) && $ss_category->getId() == 000000) {
		$ss_defer_config = '';
	}
?>
<?php if ( $ss_enable ) : ?>
	<script src="https://snapui.searchspring.io/<?php echo $ss_site_id; ?>/bundle.js" id="searchspring-context"<?php echo $ss_defer_config; ?>></script>
<?php endif; ?>
```

#### Search and Category

- Replace `REPLACE_WITH_YOUR_SITE_ID` with the correct site id.
- Replace `000000` with the search category id that was noted when creating the category page.
- (Optional) If the category path attribute has a parent level you want to exclude, add to the `$ss_category_exclude` array.

```php
<?php
	// Searchspring script flags
	$ss_enable = true;
	$ss_find = '"';
	$ss_replace = '&quot;';
	
	// Initial attributes values for Searchspring script tag
	$ss_site_id = 'REPLACE_WITH_YOUR_SITE_ID';
	$ss_defer_config = ' defer';
	$ss_category_config = '';

	// Get data from objectManager
	$ss_object_manager = \Magento\Framework\App\ObjectManager::getInstance();
	$ss_category = $ss_object_manager->get('Magento\Framework\Registry')->registry('current_category');

	// Update details if on category
	if (isset($ss_category)) {
		$ss_category_id = $ss_category->getId();
		$ss_category_name = str_replace($ss_find, $ss_replace, $ss_category->getName());
		$ss_category_copy = $ss_category;
		$ss_category_array = array();
		$ss_category_exclude = array('Default Category', 'Root Catalog');

		// Build category path and trim characters
		while (!in_array($ss_category_copy->getName(), $ss_category_exclude)) {
			$ss_category_array[] = trim(htmlspecialchars($ss_category_copy->getName()));
			$ss_category_copy = $ss_category_copy->getParentCategory();
		}
		$ss_category_join = implode('>', array_reverse($ss_category_array));
		$ss_category_path = str_replace($ss_find, $ss_replace, $ss_category_join);

		// Update defer if on category
		$ss_defer_config = '';

		// Add category filter (but not on search category)
		if ($ss_category_id != 000000) {
			$ss_category_config = 'category = { id : "' . $ss_category_id . '", name : "' . $ss_category_name . '", path : "' . $ss_category_path . '" };';
		}
	}
?>
<?php if ( $ss_enable ) : ?>
	<script src="https://snapui.searchspring.io/<?php echo $ss_site_id; ?>/bundle.js" id="searchspring-context"<?php echo $ss_defer_config; ?>>
		<?php echo $ss_category_config; ?>
	</script>
<?php endif; ?>
```

### Body Class Name

Magento automatically adds a class based on the name of the page to the body, so there is no additional code needed to generate `category-shop` class. This class can be used for styling purposes or to target elements specifically on the search page.

## Category Page Edits

Next we'll add our target element(s) to the category page. This is where the Searchspring elements will be injected into, typically two elements are added for a two-column layout: one for content, and one for facets.

Targets are defined in your Snap configuration and will only be injected into if they exist on the page.

### Category Listing

- FTP > app > design > frontend > [theme vendor] > [theme name] > Magento_Catalog > templates > product > list.phtml.

**Caution:** If this file doesn't exist, find the root file of the same, make a copy, and upload it to the path above. Try looking in: vendor > magento > magento-catalog > view > frontend > templates > list.phtml. Do not edit the root files directly because if the client updates Magento, this could erase the changes and break the integration.

- Once the correct file is found, ensure that all of your search controller targets are added to the category listing.
- Some category templates will only display sidebar or results content if products are assigned to the category. Look for conditions that may be checking for product count and adjust as needed (likely altering the product count conditional).

```php
<div id="searchspring-content" style="min-height: 100vh;"></div>
```

### Category Sidebar

- FTP > app > design > frontend > [theme vendor] > [theme name] > Magento_LayeredNavigation > templates > layer > view.phtml.

**Caution:** If this file doesn't exist, find the root file of the same, make a copy, and upload it to the path above. Try looking in: vendor > magento > magento-layerednavigation > view > frontend > templates > view.phtml. Do not edit the root files directly because if the client updates Magento, this could erase the changes and break the integration.

- Once the correct file is found, ensure that all of your search controller targets are added to the category sidebar.

```php
<div id="searchspring-sidebar" style="min-height: 100vh;"></div>
```

## Search Form Updates

Next we'll update the search form to submit to the search results category page (ie. `/shop.html`) we created.

- FTP > app > design > frontend > [theme vendor] > [theme name] > Magento_Search > templates > form.mini.phtml.

**Caution:** If this file doesn't exist, find the root file of the same, make a copy, and upload it to the path above. Try looking in: vendor > magento > magento-search > view > frontend > templates > form.mini.phtml. Do not edit the root files directly because if the client updates Magento, this could erase the changes and break the integration.

- Above the form, add a php flag to enable and disable Searchspring:

```php
<?php $ss_enable = true; ?>
```

- Create a copy of the form which you will edit and comment out the old form. This will allow us to retain Magento's default functionality for when Searchspring is disabled.

```php
<?php if ( $ss_enable ) : ?>
	<!-- Altered form code -->
<?php else : ?>
	<!-- Untouched form code -->
<?php endif; ?>
```

In your form copy, update the following details:

| Element | Attribute | Value |
|---|---|---|
| form | method | get |
| form | action | /shop.html |
| input[type="text"] or input[type="search"] | data-mage-init | remove attribute |
| input[type="hidden"] | | remove any hidden inputs |
| search_autocomplete | | remove element |

## Integration Code

Up until this point, we've added the Searchspring integration to the theme and category page.

Now we'll ensure our integration code captures the context variables and sets up the necessary configuration.

### Create Magento2 Plugin

In the `src/scripts` folder, create a plugin called `magento2.js` and add the below code. This snippet will provide tracking for shopper id; setting form key and uenc; and a few common pieces of Magento 2 logic used in results display.

```js
// src/scripts/magento2.js
import { cookies } from '@searchspring/snap-toolbox';

export const magento2 = (controller) => {
	// get shopper id from magento cache
	const mageCacheStorage = JSON.parse(localStorage.getItem('mage-cache-storage'));
	let shopperId = (mageCacheStorage?.customer?.data_id) ? mageCacheStorage.customer.data_id : false;

	// track shopperId
	if (shopperId) {
		controller.tracker.track.shopper.login({
			id: shopperId
		});
	}

	// magento2 configs
	controller.store.custom.m2 = {
		domain: window.location.hostname,
		formKey: cookies.get('form_key'),
		uenc: typeof btoa == 'function' ? btoa(window.location.href) : '',
	};
	
	controller.on('afterStore', async ({ controller }, next) => {
		const store = controller.store;
		const { pagination, results } = store;
		const customM2 = store.custom.m2;
		customM2.uenc = typeof btoa == 'function' ? btoa(window.location.href) : '';

		if (pagination.totalResults) {
			results.forEach((result) => {
				const core = result.mappings.core;
				const custom = result.custom;

				// shared magento2 action config
				const sharedData = {
					data: {
						product: core.uid,
						uenc: customM2.uenc,
					},
				};

				// magento2 wishlist action
				let wishlistData = sharedData;
				wishlistData.action = '//' + customM2.domain + '/wishlist/index/add/';
				custom.wishlist = JSON.stringify(wishlistData).replace(/\//g, '\\/');

				// magento2 compare action
				let compareData = sharedData;
				compareData.action = '//' + customM2.domain + '/catalog/product_compare/add/';
				custom.compare = JSON.stringify(compareData).replace(/\//g, '\\/');

				// magento2 Add to Cart action
				custom.addToCart = '//' + customM2.domain + '/checkout/cart/add/uenc/' + customM2.uenc + '/product/' + core.uid + '/';
			});
		}

		await next();
	});
};
```

### Search Only Integration

If you are only integrating Search page functionality, follow these steps. Otherwise skip this section and continue below to install both search and category functionality.

Add code to set a visibility filter on search pages:

```js
// src/index.js

/* visibility filters */
let visibilityFilters = [];
visibilityFilters.push({
	field: 'visibility',
	value: 'Search',
	type: 'value',
	background: true,
});
```

In the search controller config object, add the magento2 plugin and filters:

```js
// src/index.js
import { magento2 } from './scripts/magento2';
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
					plugins: [[magento2]],
					settings: {
						redirects: {
							singleResult: true,
						},
					},
					globals: {
						filters: visibilityFilters,
					},
				},
				targeters: [
					{
						selector: '#searchspring-content',
						component: async () => {
							return (await import('./components/Content')).Content;
						},
					},
				],
			},
		],
		autocomplete: [
			{
				config: {
					id: 'autocomplete',
					plugins: [[magento2]],
					globals: {
						filters: visibilityFilters,
						search: {
							query: {
								spellCorrection: true,
							},
						},
						pagination: {
							pageSize: 6,
						},
					},
				},
			},
		],
	},
});
```

### Search and Category Integration

If integrating on search and category pages, follow these steps.

Back in `src/index.js`, adjust context to grab additional values for category integration:

```js
// src/index.js
/* context from script tag */
import { getContext } from '@searchspring/snap-toolbox';
const context = getContext(['category']);
```

Below this, add code to support background filters on a `search` controller. As a best practice, we use `category_hierarchy` as it contains a unique, hierarchal path for the category.

**Caution:** The background filter will almost always be `category_hierarchy`, but there are times when we create a custom field such as `ss_category` or `ss_category_hierarchy`. The background filter should match the category facet if there is one set. If you do need to update, be sure to change the below code to set the background filter on that field instead.

```js
// src/index.js

/* background filters */
let backgroundFilters = [];
let visibilityFilters = [];

if (context.category?.path) {
	// set background filter
	backgroundFilters.push({
		field: 'category_hierarchy',
		value: context.category.path.replace(/\&quot\;/g, '"'),
		type: 'value',
		background: true,
	});

	// add visibility filters for category
	visibilityFilters.push({
		field: 'visibility',
		value: 'Catalog',
		type: 'value',
		background: true,
	});
} else {
	// add visibility filters for search
	visibilityFilters.push({
		field: 'visibility',
		value: 'Search',
		type: 'value',
		background: true,
	});
}
```

To attach the `backgroundFilters` and `visibilityFilters` to a `search` controller, they need to be added into a `globals` config:

```js
// src/index.js
import { magento2 } from './scripts/magento2';
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
					plugins: [[magento2]],
					settings: {
						redirects: {
							singleResult: true,
						},
					},
					globals: {
						filters: visibilityFilters.concat(backgroundFilters),
					},
				},
				targeters: [
					{
						selector: '#searchspring-content',
						component: async () => {
							return (await import('./components/Content')).Content;
						},
					},
				],
			},
		],
		autocomplete: [
			{
				config: {
					id: 'autocomplete',
					plugins: [[magento2]],
					globals: {
						filters: visibilityFilters,
						search: {
							query: {
								spellCorrection: true,
							},
						},
						pagination: {
							pageSize: 6,
						},
					},
				},
			},
		],
	},
});
```

**Note:** In the above code, we concat `visibilityFilters` and `backgroundFilters` to the search controller. The autocomplete controller only needs a background filter on visibility.

## Additional Targets (Optional)

In addition to having two targets for a two-column layout, you may want to inject content into other sections of the page such above the content and sidebar to display information such as the search query. Note the addition of `category-shop` class before `searchspring-header` to ensure the content is only injected on the search page.

```js
// src/index.js
targeters: [
	{
		selector: '#searchspring-content',
		component: async () => {
			return (await import('./components/Content')).Content;
		},
		hideTarget: true,
	},
	{
		selector: '#searchspring-sidebar',
		component: async () => {
			return (await import('./components/Sidebar')).Sidebar;
		},
		hideTarget: true,
	},
	{
		selector: '.category-shop #searchspring-header',
		component: async () => {
			return (await import('./content/header/Header')).Header;
		},
		hideTarget: true,
	},
],
```
