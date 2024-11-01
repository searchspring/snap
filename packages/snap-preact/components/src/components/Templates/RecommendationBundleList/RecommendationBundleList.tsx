import { h } from 'preact';
import { css } from '@emotion/react';
import { observer } from 'mobx-react';

import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { RecommendationBundle, RecommendationBundleProps } from '../RecommendationBundle';
import { Price } from '../../Atoms/Price';
import { Button } from '../../Atoms/Button';
import { Icon } from '../../Atoms/Icon';
import { Image } from '../../Atoms/Image';
import { Result } from '../../Molecules/Result';
import { BundledCTAProps } from '../RecommendationBundle/BundleCTA';

const defaultStyles: StyleScript<RecommendationBundleListProps> = () => {
	return css({
		'.ss__recommendation-bundle__wrapper__selector__result-wrapper': {
			display: 'flex',
			'.ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox': {
				position: 'relative',
				minWidth: '20px',
			},

			'.ss__result__details': {
				textAlign: 'left',
			},
		},

		'.ss__recommendation-profile-tracker': {
			display: 'flex',
			flexDirection: 'column',
		},

		'.ss__recommendation-bundle__wrapper': {
			order: '3',
		},

		'.ss__recommendation-bundle__wrapper__cta': {
			order: '2',

			'.ss__button': {
				cursor: 'pointer',
				border: '1px solid black',
			},
			'.cta__inner_images': {
				display: 'flex',
				flexDirection: 'row',
			},

			'.cta__inner__image-wrapper .ss__icon': {
				top: '50%',
				position: 'absolute',
				right: '-0.5em',
			},

			'.cta__inner__image-wrapper:last-of-type .ss__icon': {
				display: 'none',
			},

			'.cta__inner__image-wrapper': {
				padding: '0px 15px',
				position: 'relative',
			},
		},
	});
};

export const RecommendationBundleList = observer((properties: RecommendationBundleListProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RecommendationBundleListProps> = {};

	const props = mergeProps('recommendationBundleList', globalTheme, defaultProps, properties);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { treePath, styleScript, theme, style, disableStyles, ...additionalProps } = props;

	const subProps: RecommendationBundleListSubProps = {
		recommendationBundle: {
			// default props
			className: 'ss__recommendation-bundle-list',
			seedText: '',
			ctaInline: false,
			limit: 5,
			preselectedCount: 2,
			carousel: {
				enabled: false,
				seedInCarousel: true,
			},
			ctaSlot: (props) => <CTASlot {...props} />,
			resultComponent: (props) => <Result hideImage={true} {...props} />,
			vertical: true,
			separatorIcon: false,

			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme oveRides
			theme: props?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<RecommendationBundleListProps>(props, defaultStyles);

	return <RecommendationBundle {...styling} {...subProps.recommendationBundle} {...additionalProps} />;
});

export type RecommendationBundleListProps = Omit<
	RecommendationBundleProps,
	'seedText' | 'vertical' | 'ctaInline' | 'ctaIcon' | 'vertical' | 'slidesPerView'
> &
	ComponentProps;

interface RecommendationBundleListSubProps {
	recommendationBundle: Partial<RecommendationBundleProps>;
}

const CTASlot = observer((props: BundledCTAProps): JSX.Element => {
	const cartStore = props.cartStore;
	return (
		<div className="cta">
			<div className="cta__inner">
				<div className="cta__inner_images">
					{cartStore.items.map((item: any) => {
						const core = item.display.mappings.core;
						return (
							<div className="cta__inner__image-wrapper">
								<Image src={core.thumbnailImageUrl} alt={core.name} lazy={false} />
								<Icon icon={'plus'} size={12} />
							</div>
						);
					})}
				</div>
				<div>{`${cartStore.count} item${cartStore.count != 1 ? 's' : ''} `}</div>

				<div className="cta__inner__price">
					<div className="cta__inner__price__title">Total Price</div>
					<div className="cta__inner__price__wrapper">
						{cartStore.msrp > cartStore.price && (
							<span className="cta__inner__price__msrp">
								<s>
									<Price value={cartStore.msrp} /> USD
								</s>
							</span>
						)}
						<span className="cta__inner__price__msrp">
							<Price value={cartStore.price} /> USD
						</span>
					</div>
				</div>
			</div>
			<div>
				<Button
					disabled={cartStore.items.length == 0}
					disableStyles
					className={`cta__add-button ${props.addedToCart ? 'cta__add-button--thanks' : ''}`}
					onClick={(e) => props.onAddToCart(e)}
				>
					{props.addedToCart ? props.ctaButtonSuccessText : props.ctaButtonText}
				</Button>
			</div>
		</div>
	);
});
