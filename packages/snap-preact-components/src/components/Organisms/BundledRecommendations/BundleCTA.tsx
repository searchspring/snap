/** @jsx jsx */
import { h, Fragment } from 'preact';
import { jsx } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import { cloneWithProps } from '../../../utilities';
import { Button } from '../../Atoms/Button';
import { Price } from '../../Atoms/Price';
import type { selectedItem } from './BundledRecommendations';

export const BundledCTA = observer((properties: BundledCTAProps): JSX.Element => {
	const { ctaSlot, selectedItems, bundlePrice, bundleStrikePrice, addToCartFunc, addToCartText } = properties;

	let totalNumProdsInBundle = 0;

	selectedItems.forEach((item) => {
		totalNumProdsInBundle += item.quantity;
	});

	return (
		<div className={`ss__bundled-recommendations__product-wrapper__cta`}>
			{ctaSlot ? (
				cloneWithProps(ctaSlot, {
					selectedItems: selectedItems,
					bundlePrice: bundlePrice,
					strikePrice: bundleStrikePrice,
					onclick: (e: any) => addToCartFunc(e),
				})
			) : (
				<Fragment>
					<p className="ss__bundled-recommendations__product-wrapper__cta__subtotal">
						{`Subtotal for ${totalNumProdsInBundle} items `}
						<div className="ss__bundled-recommendations__product-wrapper__cta__subtotal__prices">
							{bundleStrikePrice && bundleStrikePrice !== bundlePrice && (
								<label className="ss__bundled-recommendations__product-wrapper__cta__subtotal__strike">
									Was <Price lineThrough={true} value={bundleStrikePrice} />
								</label>
							)}
							<label className="ss__bundled-recommendations__product-wrapper__cta__subtotal__price">
								<Price value={bundlePrice} />
							</label>
						</div>
					</p>

					<Button onClick={(e) => addToCartFunc(e)}>{addToCartText}</Button>
				</Fragment>
			)}
		</div>
	);
});

interface BundledCTAProps {
	isMobile: boolean;
	ctaSlot?: JSX.Element;
	selectedItems: selectedItem[];
	bundlePrice: number;
	bundleStrikePrice?: number;
	addToCartFunc: (e: any) => void;
	addToCartText?: string;
}
