import { h, Component } from 'preact';
import { observer } from 'mobx-react';

import { Result } from '@searchspring/snap-preact-components';

type EmailProps = {
	controller?: RecommendationController;
};

@observer
export class Email extends Component<EmailProps> {
	render() {
		const controller = this.props.controller;
		const store = controller?.store;
		const theme = {
			components: {
				image: {
					lazy: false,
				},
			},
		};
		return (
			<div>
				{store.results.map((result, idx) => (
					//****** IMPORTANT  *******//
					// THIS OUTER "ss-emailrec" WRAPPER IS REQUIRED FOR EMAIL RECS TO WORK PROPERLY.
					// DO NOT REMOVE OR EDIT IT
					<div key={idx} id={`ss-emailrec${idx}`} className="ss-emailrec" style={{ display: 'block', width: '240px' }}>
						{/* make your result changes here  */}
						<Result result={result} theme={theme}></Result>
					</div>
				))}
			</div>
		);
	}
}
