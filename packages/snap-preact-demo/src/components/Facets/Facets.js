import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';
import { withStore } from '../../services/providers';

import { Profile } from '../Profile/Profile';
import { Facet } from '@searchspring/snap-preact-components';

@withStore
@observer
export class Facets extends Component {
	render() {
		const facets = this.props.store.facets;
		const controller = this.props.store.controller;

		return (
			<Profile name="facets" controller={controller}>
				<div class="ss-facets">
					{facets.map((facet) => {
						return <Facet facet={facet}></Facet>;
					})}
				</div>
			</Profile>
		);
	}
}
