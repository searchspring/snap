/** @jsx jsx */
import { h, Fragment } from 'preact';
import { jsx } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import { cloneWithProps } from '../../../utilities';
import { Button } from '../../Atoms/Button';
import { Price } from '../../Atoms/Price';
import type { Product } from '@searchspring/snap-store-mobx';
import { Theme, useTheme } from '../../../providers';
import { Icon, IconProps } from '../../Atoms/Icon';
import type { ComponentProps } from '../../../types';

export const BundledCTA = observer((properties: BundledCTAProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BundledCTAProps = {
		// default props
		// global theme
		...properties,
	};

	const { ctaSlot, selectedItems, icon, bundlePrice, bundleStrikePrice, onAddToCartClick, addToCartText } = props;

	let totalNumProdsInBundle = 0;

	selectedItems.forEach((item) => {
		totalNumProdsInBundle += item.quantity;
	});

	const subProps: BundleSelectorSubProps = {
		icon: {
			// default props
			className: 'ss__bundled-recommendations__wrapper__cta__icon',
			viewBox: '0 0 512 512',
			path: [
				{
					type: 'path',
					attributes: {
						d: 'm256 122c20 0 40 0 59 0 4 0 5-1 5-5-2-19-8-37-21-52-22-24-56-26-81-4-17 15-24 35-25 57 0 4 2 4 5 4 19 0 39 0 58 0m0 344c19 0 39 0 59 0 20 0 40 0 61 0 15 0 24-7 27-22 1-5 0-10 0-15 0-8-1-15-1-22-1-19-2-37-4-56-1-28-3-57-5-85-2-24-3-48-5-72 0-13-7-21-18-24-3-1-8-2-12-2-68 0-136 0-204 0-3 0-6 1-8 1-11 1-21 10-22 21-1 5-1 11-1 16-2 24-3 48-5 72-1 23-3 46-4 69-2 29-4 58-6 87-1 21 10 32 31 32 39 0 78 0 117 0m-109-343c2-14 3-27 7-39 12-41 37-70 79-81 43-10 79 5 106 41 17 21 25 46 25 74 0 1 0 3 1 4 6 1 12 2 17 4 30 8 50 35 51 67 1 24 3 48 5 73 1 17 2 35 3 52 2 25 3 49 5 74 1 17 2 34 2 50-1 39-32 70-70 70-82 0-163 0-244 0-35 0-64-25-69-61-2-14-1-29 0-44 1-19 2-38 4-57 1-24 3-48 4-72 2-18 2-36 4-55 1-15 1-31 4-46 5-28 30-50 59-53 2-1 5-1 7-1',
					},
				},
			],
			size: 50,
			// global theme
			...globalTheme?.components?.icon,
			// component theme overrides
			theme: props?.theme,
		},
	};
	return (
		<div className={`ss__bundled-recommendations__wrapper__cta`}>
			{ctaSlot ? (
				cloneWithProps(ctaSlot, {
					selectedItems: selectedItems,
					bundlePrice: bundlePrice,
					bundleStrikePrice: bundleStrikePrice,
					onAddToCartClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => onAddToCartClick(e),
				})
			) : (
				<Fragment>
					<div className="ss__bundled-recommendations__wrapper__cta__subtotal">
						{icon ? (
							<div className="icon">
								<Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon as string } : (icon as Partial<IconProps>))} />
							</div>
						) : (
							<></>
						)}
						<span className="ss__bundled-recommendations__wrapper__cta__subtotal__title">{`Subtotal for ${totalNumProdsInBundle} items`}</span>
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

					<Button className={'ss__bundled-recommendations__wrapper__cta__button'} onClick={(e) => onAddToCartClick(e)}>
						{addToCartText}
					</Button>
				</Fragment>
			)}
		</div>
	);
});

export interface BundleSelectorSubProps {
	icon: Partial<IconProps>;
}

interface BundledCTAProps extends ComponentProps {
	ctaSlot?: JSX.Element;
	selectedItems: Product[];
	icon?: string | Partial<IconProps> | boolean;
	bundlePrice: number;
	bundleStrikePrice?: number;
	onAddToCartClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	addToCartText?: string;
}
