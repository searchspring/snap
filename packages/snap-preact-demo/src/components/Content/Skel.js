import { h, Fragment, Component } from 'preact';
import { Skeleton } from '@searchspring/snap-preact-components';

export class ContentSkel extends Component {
	render() {
		return (
			<>
				<div className="ss-header-container">
					<Skeleton height={33} width={300} />
				</div>
				<div className="ss-results">
					<div className="toolbar">
						<div style={{ display: 'inline-block', margin: '10px' }}>
							<Skeleton height={33} width={180} />
						</div>
						<div style={{ display: 'inline-block', margin: '10px' }}>
							<Skeleton height={33} width={180} />
						</div>
						<div style={{ float: 'right' }}>
							<Skeleton height={30} width={300} />
						</div>
					</div>
					<div className="ss__results" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'auto', gap: '20px' }}>
						{Array.from({ length: 40 }).map((_, index) => (
							<ResultsSkel key={index} />
						))}
					</div>
				</div>
			</>
		);
	}
}

const ResultsSkel = () => {
	return (
		<div className="ss-result">
			<Skeleton height={320} width={212} />
			<Skeleton height={42} width={212} />
			<Skeleton height={25} width={212} />
			<Skeleton height={30} width={212} />
		</div>
	);
};
