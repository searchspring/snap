# AbstractController

The `AbstractController` is used as the base class for all Snap controllers. As it is an abstract class, it must be extended by a subclass and cannot be instantiated.

## AbstractControllerConfig
The required configuration for all controllers is an `id`. This identifier should be unique to identify various instantiated controllers from each other.

| option | description | default value | required | 
|---|---|---|---|
| id | unique identifier for this controller | ➖ | ✔️ |

<br>

```typescript
const abstractConfig = {
	id: 'abstract',
};
```
## Instantiate
`AbstractController` cannot be instantiated and must be extended by a subclass.

## Search
This is an abstract method that must be defined in the subclass.

## Events

### init
- Called with `eventData` = { controller }
- Always invoked by a call to the `init` controller method