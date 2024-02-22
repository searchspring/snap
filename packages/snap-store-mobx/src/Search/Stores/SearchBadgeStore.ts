import { MetaResponseModel } from '@searchspring/snapi-types';
import { Product } from './SearchResultStore';
import type { MetaBadges, ResultBadge, OverlayResultBadge } from '../../types';

export class SearchBadgeStore {
	private meta: MetaResponseModel & { badges: MetaBadges };

	constructor(meta: MetaResponseModel & { badges: MetaBadges }) {
		this.meta = meta;
	}

	getCalloutBadge(result: Product, name: string): ResultBadge | undefined {
		const resultBadges = result.badges;
		const callouts = this.meta?.badges?.locations?.callouts;

		if (!resultBadges?.length || !callouts) {
			return;
		}

		return resultBadges.find((badge) => {
			return callouts?.some((callout) => callout.name === badge.location) && badge.location === name;
		});
	}

	getOverlayBadges(result: Product): OverlayResultBadge[] | undefined {
		const resultBadges = result.badges;
		const overlay = this.meta.badges?.locations?.overlay;

		if (!resultBadges?.length || !overlay) {
			return;
		}

		return resultBadges
			?.map((badge) => {
				// add overlayLocation and overlayLocationOptions properties to be used in styling
				const isRightOverlay = overlay.right.some((rightOverlays) => rightOverlays.name === badge.location);
				const isLeftOverlay = overlay.left.some((leftOverlays) => leftOverlays.name === badge.location);
				const overlayLocation = isRightOverlay ? 'right' : isLeftOverlay ? 'left' : '';

				return {
					...badge,
					overlayLocation,
					overlayLocationOptions: overlay[overlayLocation as keyof typeof overlay],
				};
			})
			.filter((badge) => {
				// filter out badges that are not overlay badges
				return badge.overlayLocation;
			});
	}
}
