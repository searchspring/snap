import { UrlManager } from '../../UrlManager/UrlManager';

export function reactLinker(urlManager: UrlManager): linkObject {
	return {
		href: urlManager.href,
		onClick: (ev: Event) => {
			if (!urlManager?.detached) {
				ev?.preventDefault();
			}
			urlManager.go();
		},
	};
}

type linkObject = {
	href: string;
	onClick: (e: Event) => void;
};
