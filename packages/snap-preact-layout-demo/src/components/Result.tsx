import { h, Fragment } from 'preact';
import { Price, Image } from '@searchspring/snap-preact-components';

export const Result: ResultComponent = (props) => {
	const { result } = props;
	const core = result.mappings.core;

	return (
		<article className="ss__result">
			<div className="ss__result__image-wrapper">
				<a href={core.url}>
					<Image src={core.thumbnailImageUrl} alt={core.name} />
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
			</div>
		</article>
	);
};
