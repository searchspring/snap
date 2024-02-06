## Snap Themes for Layouts
A proposed solution for providing themes that style any combination of custom layouts. Snap Layouts are provided with a selected theme that then overlays a set of style scripts on top of the Snap library components.

### What is a Snap Layout theme?
A Snap Layout theme is a customizable styling overlay used in Snap Layouts that alters the look and feel of the layout. By keeping the layout independent of the theme we can easily swap out any theme regardless of the current or future site layout.

A theme consists of a collection of:
1. theme variables
2. ui configurations
3. style scripts

### What are layouts and layout collections?
Layouts are configuration based descriptors outlining how Snap library components are composed together. The intention is to prevent custom components altogether and require the use of the library components only. A layout can be either a functional layout that returns a layout, or a static layout that can be serialized (more work to do here for logic). A collection is a re-usable layout artifact that can be composed into other layouts or containers.

Breakpoints are available on all "root" Snap Layouts to provide the ability to use a different layout on responsive designs.

### What are theme configurations?
Theme configurations are theme specific variables that get passed into the style scripts used for tweaking commonly

### What are ui configurations?
These are currently known in our Preact components as the 'theme' prop - which contains component/sub-component configuration.

### What are style scripts?
Style scripts are CSS in JS that get passed certain props that can be used to conditionally render CSS inside of Snap components. Each component that can be used in Snap Layouts will have a style script in the theme. The styles created are meant to be self contained and should consider the composition of sub-components that already have their own style scripts.

### What is dynamic theming?
The ability to switch theme configurations and potentially entire themes at run time.