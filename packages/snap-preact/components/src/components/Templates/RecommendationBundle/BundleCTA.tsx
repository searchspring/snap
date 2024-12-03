import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { jsx } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { cloneWithProps } from '../../../utilities';
import { Button } from '../../Atoms/Button';
import { Price, PriceProps } from '../../Atoms/Price';
import { Theme, useTheme } from '../../../providers';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import type { ComponentProps } from '../../../types';
import type { CartStore } from '@searchspring/snap-store-mobx';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

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

	const { ctaSlot, cartStore, onAddToCart, ctaIcon, ctaButtonText, ctaButtonSuccessText, treePath } = props;

	const [addedToCart, setAddedToCart] = useState(false);

	props.addedToCart = addedToCart;

	const subProps: BundleSelectorSubProps = {
		icon: {
			name: 'bundle-cart',
			// default props
			className: 'ss__recommendation-bundle__wrapper__cta__icon',
			size: 50,
			// global theme
			...globalTheme?.components?.icon,
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		subtotalStrike: {
			// default props
			// global theme
			...globalTheme?.components?.icon,
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		subtotalPrice: {
			// default props
			// global theme
			...globalTheme?.components?.icon,
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge({}, props.lang || {});
	const mergedLang = useLang(lang as any, {});
	return (
		<div className={`ss__recommendation-bundle__wrapper__cta`}>
			{ctaSlot ? (
				cloneWithProps(ctaSlot, props)
			) : (
				<Fragment>
					<div className="ss__recommendation-bundle__wrapper__cta__subtotal" aria-atomic="false" aria-live="polite">
						{ctaIcon ? (
							<div className="icon">
								<Icon {...subProps.icon} {...(typeof ctaIcon == 'string' ? { icon: ctaIcon } : (ctaIcon as Partial<IconProps>))} />
							</div>
						) : (
							<Fragment></Fragment>
						)}
						<span className="ss__recommendation-bundle__wrapper__cta__subtotal__title">{`Subtotal for ${cartStore.count} items`}</span>
						<div className="ss__recommendation-bundle__wrapper__cta__subtotal__prices">
							{cartStore.msrp && cartStore.msrp !== cartStore.price ? (
								<label className="ss__recommendation-bundle__wrapper__cta__subtotal__strike">
									Was <Price {...subProps.subtotalStrike} lineThrough={true} value={cartStore.msrp} />
								</label>
							) : (
								<Fragment></Fragment>
							)}
							<label className="ss__recommendation-bundle__wrapper__cta__subtotal__price">
								<Price {...subProps.subtotalPrice} value={cartStore.price} />
							</label>
						</div>
					</div>

					<Button
						className={classnames('ss__recommendation-bundle__wrapper__cta__button', {
							'ss__recommendation-bundle__wrapper__cta__button--added': addedToCart,
						})}
						aria-live={addedToCart}
						onClick={(e) => onAddToCart(e)}
						{...(addedToCart ? mergedLang.ctaButtonSuccessText?.all : mergedLang.ctaButtonText?.all)}
					>
						{addedToCart ? ctaButtonSuccessText : ctaButtonText}
					</Button>
				</Fragment>
			)}
		</div>
	);
});

export interface BundleSelectorSubProps {
	subtotalStrike: Partial<PriceProps>;
	subtotalPrice: Partial<PriceProps>;
	icon: Partial<IconProps>;
}

export interface BundledCTAProps extends ComponentProps {
	ctaSlot?: JSX.Element | React.FunctionComponent<BundledCTAProps>;
	cartStore: CartStore;
	onAddToCart: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	ctaIcon?: IconType | Partial<IconProps> | false;
	ctaButtonText?: string;
	ctaButtonSuccessText?: string;
	ctaButtonSuccessTimeout?: number;
	addedToCart?: boolean;
	lang?: Partial<BundledCTALang>;
}

export interface BundledCTALang {
	ctaButtonSuccessText: Lang<never>;
	ctaButtonText: Lang<never>;
}
