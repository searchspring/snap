Welcome to the Snap React Component Library! 
This collection of ecommerce components allows you to quickly build and theme a layout for use with Searchspring's Snap SDK.


### Installation

```sh
npm install --save @searchspring/snap-preact-components
```

## Atomic Design Methodology
Snap components follow the Atomic design methodology. Components are organized into three levels:

### Atoms
Atom level components are the basic building blocks of an ecommerce layout. This includes components such as Badge, Button, and Icon.

Like atoms in nature they’re fairly abstract and often not terribly useful on their own. However, they’re good as a reference in the context of a pattern library as you can see all your global styles laid out at a glance.

### Molecules
Molecule level components utilize one or more atom components to start building the contents of a layout. This includes components such as Pagination, Select, and Slider.

Things start getting more interesting and tangible when we start combining atoms together. Molecules are groups of atoms bonded together and are the smallest fundamental units of a compound. These molecules take on their own properties and serve as the backbone of our design systems.

### Organisms
Organisms level components utilize one or more molecule components to start building complex sections of a layout. This includes components such as Autocomplete, Facets, and Results.

Molecules give us some building blocks to work with, and we can now combine them together to form organisms. Organisms are groups of molecules joined together to form a relatively complex, distinct section of an interface.