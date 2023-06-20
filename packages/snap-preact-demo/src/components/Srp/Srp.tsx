import { h, Component } from 'preact';
import { observer } from 'mobx-react';
// import { useState } from 'preact/hooks';

import { Srp as LibrarySrp } from '@searchspring/snap-preact-components';
import { config } from '../../config';

type _Props = {
	controller: SearchController;
};

@observer
export class SRP extends Component<_Props> {
	render() {
		// const [_config, setConfig] = useState({...config});

		// const func = () => {
		// 	const newConfig = {..._config, filterSummaryLayout: "vertical"};
		// 	//@ts-ignore
		// 	setConfig(newConfig);
		// }

		// setTimeout(() => func(), 3000);

		return <LibrarySrp {...this.props} {...config} />;
	}
}
