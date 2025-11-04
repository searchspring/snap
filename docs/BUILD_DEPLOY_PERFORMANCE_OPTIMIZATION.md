# Performance Optimization

## Script Loading Optimization

### Modern vs Universal Builds

Always serve the build to modern browsers and the universal build only to legacy browsers. Serving universal builds to modern browsers negatively impacts Core Web Vitals:

```html
<!-- Modern browsers - use modern build -->
<script src="https://snapui.searchspring.io/[siteId]/bundle.js"></script>

<!-- Legacy browsers - use universal build -->
<script src="https://snapui.searchspring.io/[siteId]/universal.bundle.js"></script>
```

The modern build is used for projects targeting the latest browsers supporting the latest JavaScript features (ES6 and above). Example modern build files: `bundle.js` & `bundle.chunk.[hash].js`

A browser is considered modern based on the [@searchspring/browserslist-config-snap modern](https://github.com/searchspring/browserslist-config-snap/blob/main/modern/index.js) rules and is included in the preconfigured scaffold.


The universal build is used for projects targeting legacy browsers and will transpile any usage of modern JavaScript to ES5 as well as polyfill any missing browser features. If you are not targeting legacy browsers, you can omit deploying the universal built files that are prefixed with `universal.` - Example: `universal.bundle.js` and `universal.bundle.chunk.[hash].js`

A browser is considered legacy based on the [@searchspring/browserslist-config-snap universal](https://github.com/searchspring/browserslist-config-snap/blob/main/universal/index.js) rules and is included in the preconfigured scaffold.

However, if you are targeting legacy browsers, it is not recommended to always serve the universal build files to all browsers—including modern browsers—as this will impact Core Web Vitals and performance negatively. 

Therefore, you will require a method for switching the front-end script `src` to point to the appropriate version of the build files depending on whether the browser is modern or legacy. This can be done in many ways, including:

- Server-side checking the userAgent and serving the appropriate version of the build files.
- Front-end checking the userAgent and serving the appropriate version of the build files.
- Lambda function serving the appropriate version of the build files based on the userAgent.

The following is an example of a regex that would match the versions of the `browserlist-config-snap@1.0.7` rules:

```js
module.exports = /((CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(14|(1[5-9]|[2-9]\d|\d{3,})|15|(1[6-9]|[2-9]\d|\d{3,}))[_.]\d+(?:[_.]\d+)?)|((?:Chrome).*OPR\/(77|(7[8-9]|[8-9]\d|\d{3,}))\.\d+\.\d+)|(Edge\/(91|(9[2-9]|\d{3,}))(?:\.\d+)?)|((Chromium|Chrome)\/(91|(9[2-9]|\d{3,}))\.\d+(?:\.\d+)?)|(Version\/(14|(1[5-9]|[2-9]\d|\d{3,})|15|(1[6-9]|[2-9]\d|\d{3,}))\.\d+(?:\.\d+)? Safari\/)|(Firefox\/(74|(7[5-9]|[8-9]\d|\d{3,}))\.\d+\.\d+)|(Firefox\/(74|(7[5-9]|[8-9]\d|\d{3,}))\.\d+(pre|[ab]\d+[a-z]*)?)/;
```
(regex generated using [browserslist-useragent-regexp](https://www.npmjs.com/package/browserslist-useragent-regexp))


### Script Placement

Search and Category pages are critical to the initial display of content. Therefore it is recommended to install the Snap script tag in the `<head>` or at the end of `<body>` so that content is fetched and displayed as soon as possible.


### Async/Defer Script Attributes

On Search and Category pages, it is not recommended to use `async` or `defer` attributes on the script tag as these will prevent the Snap script from executing immediately and will further delay the initial display of content. 

For other pages that only contain Recommendations, Autocomplete, or Finders (non-critical content), the `defer` attribute can be added conditionally to improve page load performance.

### Resource Hints

Use link tags with `preconnect` and `dns-prefetch` attributes to establish early connections to Snap CDN and Searchspring API domains:

```html
<head>
  <!-- Preconnect to Snap CDN -->
  <link rel="preconnect" href="https://snapui.searchspring.io">
  <link rel="dns-prefetch" href="https://snapui.searchspring.io">
  
  <!-- Preconnect to Searchspring API -->
  <link rel="preconnect" href="https://[siteId].a.searchspring.io">
  <link rel="dns-prefetch" href="https://[siteId].a.searchspring.io">
</head>
```


## Optimizing Largest Contentful Paint (LCP)

### Lazy Load Recommendations

Use lazy rendering for recommendation components that appear below the fold:

```jsx
import { Recommendation } from '@searchspring/snap-preact-components';

<Recommendation
  lazyRender={{
    enabled: true, // Defaults to true, can be omitted
    offset: '200px' // Default is '10%'. Start loading when component is 200px from viewport
  }}
  // ... other props
/>
```

**Note:** The `lazyRender.enabled` property defaults to `true`, so it can be omitted if you only need to customize the `offset`. The default `offset` is `'10%'`, which accepts any CSS margin value (px, %, etc.).

Lazy rendering uses Intersection Observer to defer loading until the component is near the viewport, improving LCP for above-the-fold content.

### Use Skeleton Components

Implement skeleton loading states to prevent layout shifts while content loads:

```jsx
import { Snap } from '@searchspring/snap-preact';

const config = {
  controllers: {
    search: [{
      config: {
        id: 'search',
      },
      targeters: [{
        selector: '#search-results',
        component: () => import('./Search'),
        skeleton: () => import('./Skeleton'),
      }]
    }]
  }
};
```

### Image Optimization

**Note:** Lazy loading should not be enabled for Result images used in custom Email Messaging Recommendation templates.

For images that are part of the LCP element (above the fold), consider disabling lazy loading.

The [Image](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fatoms-image--default) component has lazy loading enabled by default. 

Otherwise, if you are not using the `Image` component, ensure product images are optimized by setting the `loading` attribute to `lazy`: 

```jsx
<img 
  src={result.imageUrl} 
  alt={result.name}
  loading="lazy"
/>
```

### Prefetch Strategies

Use `prefetch` sparingly and only for components that are likely to be viewed. When `prefetch` is enabled, the controller's search method is called immediately when the targeter is registered, before the target element is found in the DOM:

```jsx
const config = {
  controllers: {
    search: [{
      config: {
        id: 'search',
      },
      targeters: [{
        selector: '#search-results',
        prefetch: true // Triggers search immediately, before target is found
      }]
    }]
  }
};
```

Avoid prefetching when:
- Component is below the fold
- Component might not be needed (conditional rendering)
- Page already has heavy resource usage

## Optimizing Interaction to Next Paint (INP)

### Optimize Event Middleware

Snap's event middleware system allows you to hook into controller lifecycle events. When adding middleware, ensure you're not adding synchronous work that blocks the main thread:

```jsx
// Good: Use async middleware for non-blocking operations
controller.on('beforeSearch', async ({ controller, request }, next) => {
  // Perform async work that doesn't block interaction
  await someAsyncOperation();
  await next();
});

// Avoid: Adding heavy synchronous operations in middleware
// This will delay INP response
controller.on('beforeSearch', ({ controller, request }, next) => {
  // Heavy synchronous computation - blocks INP
  heavyComputation();
  next();
});
```

### Optimize Click Event Handlers

Snap tracks product clicks and add-to-cart interactions. When implementing custom click handlers, use `onMouseDown` for tracking to improve perceived responsiveness or use `requestIdleCallback` to defer non-critical work.

```jsx
// Good: Use onMouseDown for tracking (fires earlier than onClick)
<a 
  href={result.url}
  onMouseDown={(e) => controller.track.product.click(e, result)}
>
  {result.name}
</a>

// Good: Defer non-critical work using requestIdleCallback
<a 
  href={result.url}
  onClick={(e) => {
    // Critical: Immediate navigation
    // Non-critical: Defer analytics
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Analytics tracking that can wait
        trackAnalytics(result);
      });
    }
  }}
>
  {result.name}
</a>
```

## Optimizing Cumulative Layout Shift (CLS)

### Reserve Space for Components

By adding a `min-height` to elements that are being targeted by Snap components, you can always reserve space for Snap components to prevent layout shifts. This is especially important for elements that are above the fold. By default, the `min-height` style will automatically be removed when the component is rendered.

```html
<div class="ss__recs__recently-viewed" style="min-height: 100vh;">
  <!-- Component will render here -->
</div>
```

### Use Skeleton Components

[Skeleton components](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Fatoms-skeleton--default) maintain layout stability during loading:

```jsx
const config = {
  controllers: {
    search: [{
      config: {
        id: 'search',
      },
      targeters: [{
        selector: '#search-results',
        component: () => import('./Search'),
        skeleton: () => import('./Skeleton'), // Prevents CLS
        hideTarget: false // Keep target visible to maintain layout
      }]
    }]
  }
};
```

### Set Image Dimensions

Ensure product images have defined dimensions to prevent layout shifts:

```css
.ss__image img {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1; /* Maintain aspect ratio */
}
```

Or use the `style` prop on Image components:

```jsx
<Image 
  src={result.imageUrl}
  alt={result.name}
  style={{ aspectRatio: '1 / 1' }}
/>
```

