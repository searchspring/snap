## Github Setup

If you would like your final bundle and assets to reside on Searchspring's CDN (ie. `https://snapui.searchspring.io/siteid/bundle.js`), the repository must be in Searchspring's Github organization and an invitation can be requested for collaboration.

Although it is not required to use Searchspring's organization nor Github for your version control, Snap utilizes Github Actions as part of our continuous integration and deployment. 

### Repository Configuration

#### Default Branch

The expected default branch name should be set to `production` instead of `main` or `master`

#### Action Secrets

For each Searchspring's Management Console account associated with the Snap repository, the following Action secret should be added as a repository secret. This page can be found at `https://github.com/[owner]/[repository]/settings/secrets/actions`

- Secret Key Name: `WEBSITE_SECRET_KEY_[SITEID]`

Where `[SITEID]` should be replaced with the siteId found in the Searchspring Management Console. For example: `WEBSITE_SECRET_KEY_ABC123`

- Value: `secretKey` located adjacent to the siteId in the Searchspring Management Console


### Github Action

The [snap-action](https://github.com/searchspring/snap-action/) can be used by creating a new github workflow file (ie. `.github/workflows/deploy.yml`)

The Snap Action requires additional parameters not shown in the example below. See [snap-action](https://github.com/searchspring/snap-action/) for additional documentation.

```yml
on: [push, pull_request]

jobs:
  Publish:
    runs-on: ubuntu-latest
    name: Snap Action
    steps:
      - name: Checkout action
        uses: actions/checkout@v2
        with:
          repository: searchspring/snap-action
      - name: Run @searchspring/snap-action
        uses: ./
```

### Project configuration

#### package.json

The package.json file must contain all siteIds associated with this project.

Single siteId example: 

```json
{
    ...
    "searchspring": {
        "siteId": {
            "abc123": {
                "name": "site1.com"
            }
        },
    }
}
```

Multi siteId example: 

```json
{
    ...
    "searchspring": {
        "siteId": {
            "abc123": {
                "name": "site1.com"
            },
            "def456": {
                "name": "site1.com.au"
            }
        },
    }
}
```