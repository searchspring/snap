# QA Checklist

## Integration Code Checklist

- [Background Filters](./snap-background-filters) are being read from script context and applied as client globals to handle Category pages.

- (If applicable) [Foreground Filters](./snap-background-filters) are added as client globals to handle custom filtering (ie. only show results in stock)

- Merchandising [Banner](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fatoms-banner--footer) components have been added for all banner locations: `header`, `banner`, `footer`, `left`. See [Search > Search Store Merchandising](./snap-search#searchcontrollerstoremerchandising)

- [InlineBanner](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fatoms-inlinebanner--default) component is conditionally rendered in your Results component. See [Search > Search Store Results](./snap-search#searchcontrollerstoreresults)

- [Result impression tracking](./snap-tracking#impressions) has been added. Confirm via browser dev tools network tab that beacon impression events are being sent for results in Search, Category, Autocomplete, and Recommendations

- [Result click tracking](./snap-tracking#product-click) has been added. (not required if using `withTracking` or `ResultTracker` as this functionallity is handled by those components)

- [Result add to cart tracking](./snap-tracking#product-add-to-cart) has been added. Confirm via browser dev tools network tab that beacon add to cart events are being sent for results in Search, Category, Autocomplete, and Recommendations

- (If enabled) Self-configured [Badges](./snap-badges) are added to your Result component

- No Results component text has been personalized for your store (ie. contains support contact and storefront address information)

## Platform Integration Checklist

- [Shopper Login tracking](./snap-tracking#shopper-login) has been added. Confirm via browser dev tools network tab that beacon shopper login events are being sent only when a shopper is logged in

- [Currency tracking](./snap-tracking#currency) has been added. Confirm via browser dev tools network tab that beacon events contain currency code in data payload for any event. If using a single currency, this is not required.

- [Product view tracking](./snap-tracking#product-view). Confirm via browser dev tools that last viewed products cookie is being updated when a product is viewed.

- [Order transaction tracking](./snap-tracking#order-transaction) has been added. Confirm via browser dev tools network tab that beacon order transaction events are being sent only when an order is completed.

- [Cart contents tracking](./snap-tracking#cart-contents) has been added. Confirm via browser dev tools network tab that beacon cart add and remove events are being sent when cart contents change.

- (If applicable) Realtime recommendations requires [Cart Attribute Tracking](./snap-tracking#cart-attribute-tracking)
