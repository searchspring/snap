import { h, Component } from 'preact';
import { observer } from 'mobx-react';

import { BundledRecommendation, BundledRecommendationProps } from '@searchspring/snap-preact-components';

type RecsProps = {
	controller?: RecommendationController;
};

@observer
export class Bundles extends Component<RecsProps> {
	constructor(props: RecsProps) {
		super();

		const controller = props.controller;

		if (!controller.store.profile) {
			controller.init();
			controller.search();
		}
	}
	render() {
		const controller = this.props.controller;
		const store = controller?.store;

		// const CTASlot = (props) => {
		// 	return (
		// 		<>
		// 			<p>
		// 				{`custom total for ${props.selectedItems.length} items `}
		// 				<label>{`$${props.bundlePrice}`}</label>
		// 				<label>{`was - $${props.strikePrice}`}</label>
		// 			</p>

		// 			<Button onClick={() => props.onclick()}>custom button here</Button>
		// 		</>
		// 	)
		// };

		// const ResultSlot = (props) => {
		// 	console.log(props)

		// 	return (
		// 		<div className={`ss__bundle-selector ${props.seed ? 'ss__bundle-selector--seed' : ''} `}>

		// 			<div style={props.seed ? {border: "1px solid gray"} : {}} className='ss__bundle-selector__result-wrapper'>
		// 				<Checkbox onClick={() => props.onCheckboxClick(props.result)} checked={props.selected}/>
		// 				{/* {props.seed && <div className={'ss__bundle-selector__seed-badge'}>Seed Product WOOO</div>} */}

		// 				<Result result={props.result}/>

		// 				<div className="ss__bundle-selector__qty">
		// 					QTY
		// 					<input className="ss__bundle-selector__qty__input" onChange={(e:any) => props.result.setQuantity(e.target.value)} aria-label="Product Quantity" type="number" min="0" placeholder="QTY #" value={props.result.quantity} />

		// 				</div>
		// 			</div>
		// 		</div>
		// 	)
		// };

		const props: BundledRecommendationProps = {
			// preselectedCount: 0,
			// seedChecked: false,
			controller: controller,
			// seedIconOnly: true,
			// seperatorIcon: false,
			// seperatorIcon: "plus",
			// seedInCarousel: true,
			seedText: 'Seed Product WOOO2',
			title: 'Bundle 4 You',
			// peekabooEnableAt: '(min-width: 650px)',
			// peekabooEnableAt: true,
			quantityPicker: true,
			results: store.results,
			// showCheckboxes: false,
			// seedInCarousel: false,
			onAddToCart: (props) => console.log(props),
			// ctaSlot: <CTASlot />,
			// resultComponent: <ResultSlot />
		};

		return (
			<div>
				<hr style={{ margin: '20px 0' }} />
				<BundledRecommendation {...props} />
			</div>
		);
	}
}
