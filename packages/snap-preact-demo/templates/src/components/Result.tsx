import { h, Fragment } from 'preact';
import { Price, Image, OverlayBadge, CalloutBadge } from '@searchspring/snap-preact/components';

export const Result = (props) => {
	const { result, controller } = props;
	const core = result.mappings.core;

	return (
		<article className="ss__result">
			Result
			<div className="ss__result__image-wrapper">
				<a href={core.url}>
					<OverlayBadge controller={controller as SearchController} result={result}>
						<Image src={core.thumbnailImageUrl} alt={core.name} />
					</OverlayBadge>
				</a>
			</div>
			<div className="ss__result__details">
				<div className="ss__result__details__title">
					<a
						href={core.url}
						dangerouslySetInnerHTML={{
							__html: core.name,
						}}
					/>
				</div>

				<div className="ss__result__details__pricing">
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

export const Result2 = (props) => {
	const { result, controller } = props;
	const core = result.mappings.core;

	return (
		<article className="ss__result">
			Result2
			<div className="ss__result__image-wrapper">
				<a href={core.url}>
					<OverlayBadge controller={controller as SearchController} result={result}>
						<Image src={core.thumbnailImageUrl} alt={core.name} />
					</OverlayBadge>
				</a>
			</div>
			<div className="ss__result__details">
				<div className="ss__result__details__title">
					<a
						href={core.url}
						dangerouslySetInnerHTML={{
							__html: core.name,
						}}
					/>
				</div>

				<div className="ss__result__details__pricing">
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
