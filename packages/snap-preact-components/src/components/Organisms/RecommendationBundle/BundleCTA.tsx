/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { jsx } from '@emotion/react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { cloneWithProps } from '../../../utilities';
import { Button } from '../../Atoms/Button';
import { Price } from '../../Atoms/Price';
import { Theme, useTheme } from '../../../providers';
import { Icon, IconProps } from '../../Atoms/Icon';
import type { ComponentProps } from '../../../types';
import type { CartStore } from '@searchspring/snap-store-mobx';

export const BundledCTA = observer((properties: BundledCTAProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BundledCTAProps = {
		// default props
		// global theme
		...properties,
	};

	props.onAddToCart = (e: any) => {
		setAddedToCart(true);

		properties.onAddToCart(e);

		setTimeout(() => setAddedToCart(false), properties.ctaButtonSuccessTimeout);
	};

	const { ctaSlot, cartStore, onAddToCart, ctaIcon, ctaButtonText, ctaButtonSuccessText } = props;

	const [addedToCart, setAddedToCart] = useState(false);

	props.addedToCart = addedToCart;

	const subProps: BundleSelectorSubProps = {
		icon: {
			// default props
			className: 'ss__recommendation-bundle__wrapper__cta__icon',
			icon: 'bag',
			size: 50,
			// global theme
			...globalTheme?.components?.icon,
			// component theme overrides
			theme: props?.theme,
		},
	};
	return (
		<div className={`ss__recommendation-bundle__wrapper__cta`}>
			{ctaSlot ? (
				cloneWithProps(ctaSlot, props)
			) : (
				<Fragment>
					<div className="ss__recommendation-bundle__wrapper__cta__subtotal">
						{ctaIcon ? (
							<div className="icon">
								<Icon {...subProps.icon} {...(typeof ctaIcon == 'string' ? { icon: ctaIcon as string } : (ctaIcon as Partial<IconProps>))} />
							</div>
						) : (
							<></>
						)}
						<span className="ss__recommendation-bundle__wrapper__cta__subtotal__title">{`Subtotal for ${cartStore.count} items`}</span>
						<div className="ss__recommendation-bundle__wrapper__cta__subtotal__prices">
							{cartStore.msrp && cartStore.msrp !== cartStore.price ? (
								<label className="ss__recommendation-bundle__wrapper__cta__subtotal__strike">
									Was <Price lineThrough={true} value={cartStore.msrp} />
								</label>
							) : (
								<></>
							)}
							<label className="ss__recommendation-bundle__wrapper__cta__subtotal__price">
								<Price value={cartStore.price} />
							</label>
						</div>
					</div>

					<Button
						className={classnames('ss__recommendation-bundle__wrapper__cta__button', {
							addedToCart: 'ss__recommendation-bundle__wrapper__cta__button--added',
						})}
						onClick={(e) => onAddToCart(e)}
						disabled={addedToCart}
					>
						{addedToCart ? ctaButtonSuccessText : ctaButtonText}
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
	cartStore: CartStore;
	onAddToCart: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	ctaIcon?: string | Partial<IconProps> | boolean;
	ctaButtonText?: string;
	ctaButtonSuccessText?: string;
	ctaButtonSuccessTimeout?: number;
}
