import UrlManager from '../UrlManager';

export default function link(urlManager: UrlManager): linkObject {
	return {
		href: urlManager.href,
		onClick: (ev: Event) => {
			ev.preventDefault();

			urlManager.go();
		},
	};
}

type linkObject = {
	href: string;
	onClick: (e: Event) => void;
};
