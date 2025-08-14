import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { jsx } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { cloneWithProps } from '../../../utilities';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Price, PriceProps } from '../../Atoms/Price';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import type { ComponentProps } from '../../../types';
import type { CartStore } from '@searchspring/snap-store-mobx';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

export const BundledCTA = observer((properties: BundledCTAProps): JSX.Element => {
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

	const { ctaSlot, cartStore, onAddToCart, ctaIcon, ctaButtonText, ctaButtonSuccessText, treePath, classNamePrefix } = props;

	const [addedToCart, setAddedToCart] = useState(false);

	props.addedToCart = addedToCart;

	const subProps: BundleSelectorSubProps = {
		icon: {
			name: 'bundle-cart',
			// default props
			internalClassName: `${classNamePrefix}__wrapper__cta__icon`,
			size: 50,
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		subtotalStrike: {
			// default props
			name: 'bundle-msrp',
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		subtotalPrice: {
			// default props
			name: 'bundle-price',
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		button: {
			// default props
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge({}, props.lang || {});
	const mergedLang = useLang(lang as any, {});
	return (
		<div className={`${classNamePrefix}__wrapper__cta`}>
			{ctaSlot ? (
				cloneWithProps(ctaSlot, props)
			) : (
				<Fragment>
					<div className={`${classNamePrefix}__wrapper__cta__subtotal`} aria-atomic="false" aria-live="polite">
						{ctaIcon ? (
							<div className="icon">
								<Icon {...subProps.icon} {...(typeof ctaIcon == 'string' ? { icon: ctaIcon } : (ctaIcon as Partial<IconProps>))} />
							</div>
						) : (
							<Fragment></Fragment>
						)}
						<span className={`${classNamePrefix}__wrapper__cta__subtotal__title`}>{`Subtotal for ${cartStore.count} items`}</span>
						<div className={`${classNamePrefix}__wrapper__cta__subtotal__prices`}>
							{cartStore.msrp && cartStore.msrp !== cartStore.price ? (
								<label className={`${classNamePrefix}__wrapper__cta__subtotal__strike`}>
									Was <Price {...subProps.subtotalStrike} lineThrough={true} value={cartStore.msrp} />
								</label>
							) : (
								<Fragment></Fragment>
							)}
							<label className={`${classNamePrefix}__wrapper__cta__subtotal__price`}>
								<Price {...subProps.subtotalPrice} value={cartStore.price} />
							</label>
						</div>
					</div>

					<Button
						{...subProps.button}
						internalClassName={classnames(`${classNamePrefix}__wrapper__cta__button`, {
							[`${classNamePrefix}__wrapper__cta__button--added`]: addedToCart,
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
	button: Partial<ButtonProps>;
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
	classNamePrefix?: string;
	lang?: Partial<BundledCTALang>;
}

export interface BundledCTALang {
	ctaButtonSuccessText: Lang<never>;
	ctaButtonText: Lang<never>;
}
