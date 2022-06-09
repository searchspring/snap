## Debugging

## Branch Overrides  

This functionality is only currently possible with Searchspring managed Snap repositories (https://github.com/searchspring-implementations).

While browsing a page that contains a Snap integration, appending the `?branch=[branchname]` query parameter to the URL will stop the execution of the existing script, and load the build from the `[branchname]` branch `https://snapui.searchspring.io/[siteid]/[branchname]/bundle.js`

You will see an interface overlay on the bottom right of the viewport indicating if successful and details of the build.

<img src="https://github.com/searchspring/snap/blob/main/images/branch-override.png?raw=true" />

This will also be persisted across page navigation. To stop previewing a branch build, you must click the `Stop Preview` button in the interface or clear the `ssBranch` cookie. The interface can also be minimized. 


## Development Mode

While browsing a page that contains a Snap integration, appending the `?dev` query parameter to the URL will set the controller's `environment` property to `development`. 

This is commonly used to enable visibility of development logs in the console. 

See [AbstractController](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Abstract) and [@searchspring/snap-logger](https://github.com/searchspring/snap/tree/main/packages/snap-logger)

