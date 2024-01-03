/** @jsx jsx */
import { h, Fragment } from 'preact';
import { jsx } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import { cloneWithProps } from '../../../utilities';
import { Button } from '../../Atoms/Button';
import { Price } from '../../Atoms/Price';
import type { selectedItem } from './BundledRecommendation';

export const BundledCTA = observer((properties: BundledCTAProps): JSX.Element => {
	const { ctaSlot, selectedItems, bundlePrice, bundleStrikePrice, onAddToCartClick, addToCartText } = properties;

	let totalNumProdsInBundle = 0;

	selectedItems.forEach((item) => {
		totalNumProdsInBundle += item.quantity;
	});

	return (
		<div className={`ss__bundled-recommendations__wrapper__cta`}>
			{ctaSlot ? (
				cloneWithProps(ctaSlot, {
					selectedItems: selectedItems,
					bundlePrice: bundlePrice,
					bundleStrikePrice: bundleStrikePrice,
					onAddToCartClick: (e: any) => onAddToCartClick(e),
				})
			) : (
				<Fragment>
					<div className="ss__bundled-recommendations__wrapper__cta__subtotal">
						<span className="ss__bundled-recommendations__wrapper__cta__subtotal__title">{`Subtotal for ${totalNumProdsInBundle} items `}</span>
						<div className="ss__bundled-recommendations__wrapper__cta__subtotal__prices">
							{bundleStrikePrice && bundleStrikePrice !== bundlePrice ? (
								<label className="ss__bundled-recommendations__wrapper__cta__subtotal__strike">
									Was <Price lineThrough={true} value={bundleStrikePrice} />
								</label>
							) : (
								<></>
							)}
							<label className="ss__bundled-recommendations__wrapper__cta__subtotal__price">
								<Price value={bundlePrice} />
							</label>
						</div>
					</div>

					<Button onClick={(e) => onAddToCartClick(e)}>{addToCartText}</Button>
				</Fragment>
			)}
		</div>
	);
});

interface BundledCTAProps {
	ctaSlot?: JSX.Element;
	selectedItems: selectedItem[];
	bundlePrice: number;
	bundleStrikePrice?: number;
	onAddToCartClick: (e: any) => void;
	addToCartText?: string;
}
