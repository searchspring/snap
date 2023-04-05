import { h, Component } from 'preact';
import { Skeleton } from '@searchspring/snap-preact-components';

export class ContentSkel extends Component {
	render() {
		return (
			<>
				<div className="ss-header-container">
					<Skeleton height="33px" width="300px" />
				</div>
				<div className="ss-results">
					<div className="toolbar">
						<div style={{ display: 'inline-block', margin: '10px 20px 10px 0' }}>
							<Skeleton height="33px" width="180px" />
						</div>
						<div style={{ display: 'inline-block', margin: '10px 20px 10px 0' }}>
							<Skeleton height="33px" width="180px" />
						</div>
						<div style={{ float: 'right' }}>
							<Skeleton height="30px" width="150px" />
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
			<Skeleton height="320px" width="212px" />
			<Skeleton height="42px" width="212px" />
			<Skeleton height="25px" width="212px" />
			<Skeleton height="30px" width="212px" />
		</div>
	);
};
