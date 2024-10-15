## Templates

Snap Templates is an alternative method of creating a Searchspring integration. The documentation in this 'Templates' section is only applicable if you are utilizing the `SnapTemplates` export. While there is overlap across other pages in the documentation, this section aims to outline the differences.

```jsx
import { SnapTemplates } from '@searchspring/snap-preact';
```

Snap and Snap Templates offer different approaches to creating a Searchspring integration. While Snap offers more flexibility, Snap Templates provides a streamlined solution for those seeking a faster integration process with pre-designed, customizable templates.

Standard Snap:
  - Provides full control over the configuration and component tree
  - Allows for custom component creation and arrangement
  - Requires more development effort and expertise

Snap Templates:
  - Utilizes pre-built, Searchspring-managed templates and themes
  - Enables rapid integration and customization
  - Leverages Snap's existing [library of components](https://github.com/searchspring/snap/tree/main/packages/snap-preact-components)
  - Requires less development effort, ideal for quick implementations
  - Offers a more guided, configuration-based approach
  - Allows for some customization through theming and overrides