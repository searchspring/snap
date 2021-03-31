import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

@observer
export class Loading extends Component {
	render() {
		const loading = this.props.store.loading;

		return (
			<div class={`ss-results-loading ${loading ? 'ss-active' : ''}`}>
				<div class="ss-results-loading-bar"></div>
			</div>
		);
	}
}
