import { h, Fragment } from 'preact';
import { Price, Image, OverlayBadge, CalloutBadge } from '@searchspring/snap-preact/components';
import { Product } from '@searchspring/snap-store-mobx';

export const CustomResult = (props: { result: Product; controller: SearchController }) => {
	const { result, controller } = props;
	const core = result.mappings.core;

	return (
		<article className="ss__custom-result">
			<div className="ss__custom-result__image-wrapper">
				<a href={core.url}>
					<OverlayBadge controller={controller as SearchController} result={result}>
						<Image src={core.thumbnailImageUrl} alt={core.name} />
					</OverlayBadge>
				</a>
			</div>
			<div className="ss__custom-result__details">
				<div className="ss__custom-result__details__title">
					<a
						href={core.url}
						dangerouslySetInnerHTML={{
							__html: core.name,
						}}
					/>
				</div>

				<div className="ss__custom-result__details__pricing">
					{core.price < core.msrp ? (
						<Fragment>
							<Price value={core.msrp} lineThrough={true} />
							<Price value={core.price} />
						</Fragment>
					) : (
						<Price value={core.price} />
					)}
				</div>

				<CalloutBadge result={result}></CalloutBadge>
			</div>
		</article>
	);
};

export const CustomResultSecondary = (props) => {
	const { result, controller } = props;
	const core = result.mappings.core;

	return (
		<article className="ss__custom-result-secondary">
			<div className="ss__custom-result-secondary__details">
				<div className="ss__custom-result-secondary__details__title">
					<a
						href={core.url}
						dangerouslySetInnerHTML={{
							__html: core.name,
						}}
					/>
				</div>

				<div className="ss__custom-result-secondary__details__pricing">
					{core.price < core.msrp ? (
						<Fragment>
							<Price value={core.msrp} lineThrough={true} />
							<Price value={core.price} />
						</Fragment>
					) : (
						<Price value={core.price} />
					)}
				</div>
				<CalloutBadge result={result}></CalloutBadge>
			</div>
			<div className="ss__custom-result-secondary__image-wrapper">
				<a href={core.url}>
					<OverlayBadge controller={controller as SearchController} result={result}>
						<Image src={core.thumbnailImageUrl} alt={core.name} />
					</OverlayBadge>
				</a>
			</div>
		</article>
	);
};
