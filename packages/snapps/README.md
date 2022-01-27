# Snapps Co-Development
Clone existing snap implementations here and test and develop the ecosystem with it.

### Usage

After cloning project run `npm run clean && npm install` from the main directory to install the implementation dependencies.

:warning: Snap package versions must line up for this to work as expected. Update the projects Snap package versions (found in `snapps/project/package.json`) to match the version of the Snap mono repo (see `/lerna.json`) versioning.

### Advanced Usage

Multiple snapps may conflict with ip addresses when running `npm run dev`. This may require port configuration changes to work as expected.

To test transpilation for universal bundles, `path.resolve(__dirname, '../../')` will need to be added to the Webpack Babel loader `includes` configuration (in `snapps/project/webpack.universal.js`):

```
target: 'browserslist:universal',
module: {
	rules: [
		{
			test: /\.(js|jsx)$/,
			include: [/node_modules\/@searchspring/, path.resolve(__dirname, 'src'), path.resolve(__dirname, '../../')],
```