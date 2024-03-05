/** @jsx jsx */
import { h, Fragment } from 'preact';
import { jsx } from '@emotion/react';
import { observer } from 'mobx-react';
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

	const { ctaSlot, icon, cartStore, onAddToCartClick, addToCartText } = props;

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
						{icon ? (
							<div className="icon">
								<Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon as string } : (icon as Partial<IconProps>))} />
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

					<Button className={'ss__recommendation-bundle__wrapper__cta__button'} onClick={(e) => onAddToCartClick(e)}>
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
	cartStore: CartStore;
	icon?: string | Partial<IconProps> | boolean;
	onAddToCartClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	addToCartText?: string;
}
