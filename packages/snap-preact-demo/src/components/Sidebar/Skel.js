import { h, Fragment, Component } from 'preact';
import { Skeleton } from '@searchspring/snap-preact-components';

export class SidebarSkel extends Component {
	render() {
		return (
			<div className="ss-sidebar-container" style={{ flex: '0 1 auto', width: '250px', margin: '0 40px 0 0', overflow: 'hidden' }}>
				<div className="ss__facets">
					{Array.from({ length: 5 }).map((_, index) => (
						<FacetSkel key={index} />
					))}
				</div>
			</div>
		);
	}
}

const FacetSkel = () => {
	return (
		<div className="ss-facet">
			<div className="ss__facet__header" style={{ margin: '10px 0px' }}>
				<Skeleton height="35px" width="250px" />
			</div>
			<div className="ss__facet__options">
				{Array.from({ length: 5 }).map((_, index) => (
					<div class="ss__facet-list-options__option" style={{ display: 'flex' }}>
						<Skeleton height="33px" width="33px" key={index} />
						<div style={{ marginLeft: '8px' }}>
							<Skeleton height="33px" width="250px" key={index} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
