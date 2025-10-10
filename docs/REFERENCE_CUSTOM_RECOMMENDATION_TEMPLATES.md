# Custom Templates

Let's look at how to setup a custom recommendation template using the Snapfu CLI. See [Getting Started > Setup](https://searchspring.github.io/snap/snap-setup) for installing Snapfu.

There are three steps required for adding recommendations:
- Creating the local template files
- Syncing the template to the Searchspring Management Console
- Updating our Snap config (see instantiator config above)

### Creating a new recommendation template
To generate a new template, run the following at the root of the project. This command will prompt you to provide various inputs such as the template type, template name, an optional description, and the path to the component.

```bash
snapfu recs init
```

In this example, we'll create a new template with a name of "DefaultRecommendations"

This will generate three files which should be committed to your repository: 
- The `.jsx` file (/src/components/Recommendations/Default.jsx) is the template itself containing our component.
- The `.scss` file (/src/components/Recommendations/DefaultRecommendations.scss) is imported by the `.jsx` template file and optional CSS styling can be defined here.
- The `.json` file (/src/components/Recommendations/DefaultRecommendations.json) contains various meta data for this template and is used when running `snapfu recs sync` to sync this template to Searchspring's Management Console API. See syncing documentation below. 

#### `.json` file parameters
The `.json` file allows template parameters to be specified. Template parameters are returned in the Recommendations API and accessible in your recommendation components via `controller.store.profile.display.templateParameters`. Template parameters can be set in the Searchspring Management Console after the template has been synced. 

Example:
```json
{
    "type": "snap/recommendation/default",
    "name": "defaultrecommendations",
    "label": "DefaultRecommendations",
    "description": "DefaultRecommendations custom template",
    "component": "DefaultRecommendations",
    "orientation": "horizontal",
    "parameters": [
        {
            "name": "title",
            "label": "Title",
            "description": "text used for the heading",
            "defaultValue": "Recommended Products"
        }
    ]
}
```

At this point, you can customize the `.jsx` template to your requirements. By default it will utilize our [Recommendation](https://searchspring.github.io/snap/preact-components?params=%3Fpath%3D%2Fstory%2Forganisms-recommendation--default) component. 

### Syncing Templates

Syncing custom templates to Searchspring's Management Console is required before they can be used. This is due to the recommendations API that returns the template's component name defined for the profile we set in the `.json` file above. 

Templates also support branching. For production-ready templates, please ensure you are on the repository's default branch (typically `production`) before running `snapfu recs sync`

If you are using Snap's Github action, merges into the `production` branch will execute the sync command within the action to ensure your templates are always synced. See [Reference > Build & Deploy > Github Action](https://searchspring.github.io/snap/build-deploy#github-action) for Github Actions usage. 

To sync templates, run the follow at the root of the project.

```bash
snapfu recs sync
```

#### Syncing to multiple accounts
To sync the template(s) to multiple accounts, multiple siteIds must be defined in the project's package.json file

See [Reference > Build & Deploy > Project package.json configuration](https://searchspring.github.io/snap/build-deploy#project-packagejson-configuration)