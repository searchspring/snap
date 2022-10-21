## Recommendations

Let's look at how to setup recommendations using the Snapfu CLI. See [Getting Started > Setup](https://searchspring.github.io/snap/#/start-setup) for installing Snapfu.

There are three steps required for adding recommendations:
- Creating the local template files
- Uploading the newly created template to the Searchspring Management Console
- Updating our Snap config


### Creating a new recommendation template
To generate a new template, run the following at the root of the project. This command will prompt you to provide various inputs such as the template name, an optional description, and the path to the component.

```bash
snapfu recs init
```

In this example, we'll create a new template with a name of "DefaultRecommendations"

This will generate three files which should be commited to your repository: 
- The `.json` file (/src/components/Recommendations/DefaultRecommendations.json) contains various meta data for this template and is used when running `snapfu recs sync` to sync this template to Searchspring's Management Console API. See syncing documentation below. 
- The `.jsx` file (/src/components/Recommendations/DefaultRecommendations.jsx) is the template itself containing our component.
- The `.scss` file (/src/components/Recommendations/DefaultRecommendations.scss) is imported by the `.jsx` template file and optional CSS styling can be defined here.

At this point, you can customize the `.jsx` template to your requirements. By default it will utilize our [Recommendation](https://searchspring.github.io/snap/#/components-preact?params=%3Fpath%3D%2Fstory%2Forganisms-recommendation--default) component. 

### Syncing Templates

Syncing templates to Searchspring's Management Console is required before they can be used. This is due to the recommendations API that returns the template's component name defined for the profile we set in the `.json` file above. 

Templates also support branching. For production-ready templates, please ensure you are on the repository's default branch (typically `production`) before running `snapfu recs sync`

If you are using Snap's Github action, merges into the `production` branch will execute the sync command within the action to ensure your templates are always synced. See [Getting Started > Github Setup](https://searchspring.github.io/snap/#/start-github) for Github Actions usage. 

To sync templates, run the follow at the root of the project.

```bash
snapfu recs sync
```

#### Syncing to multiple accounts
To sync the template(s) to multiple accounts, multiple siteIds must be defined in the project's package.json file

See [Getting Started > Github Setup](https://searchspring.github.io/snap/#/start-github)


### Updating instantiator config
The instantiators config provides a reference to our template component so that it can be imported at run time.

As noted above, recommendation templates support branching. If you plan to utilize template branching, `instantiators.recommendation.config.branch` must define the current git branch name. Otherwise, a fallback value with the repository default branch name (typically `production`) should be defined.

```typescript
const config: SnapConfig = {
    ...
    instantiators: {
		recommendation: {
			components: {
				DefaultRecommendations: async () => {
					return (await import('./components/Recommendations/DefaultRecommendations/DefaultRecommendations')).DefaultRecommendations;
				},
			},

			config: {
				branch: BRANCHNAME || 'production',
			},
		},
	},
}
```

The `BRANCHNAME` can be defined at runtime via webpack's `DefinePlugin`

```javascript
const webpack = require('webpack');
const childProcess = require('child_process');
const branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
module.exports = {
    ...
    plugins: [
		new webpack.DefinePlugin({
			BRANCHNAME: `"${branchName}"`,
		}),
	],
}
```