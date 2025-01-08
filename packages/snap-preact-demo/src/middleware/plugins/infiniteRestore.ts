type PositionData = {
	first?: {
		elem: Element;
		offset: number;
	};
	last?: {
		elem: Element;
		offset: number;
	};
	// offset: number;
	page?: number;
};

type PositionDataStore = {
	[controllerId: string]: PositionData;
};

export function infiniteRestore(controller: AbstractController) {
	controller.on('afterSearch', infiniteStorePosition);
	controller.on('restorePosition', infiniteReStorePosition);
}

const previousPositionData: PositionDataStore = {};

async function infiniteStorePosition({ controller }, next: Next) {
	await next();

	const resultElems = document.querySelectorAll('.ss__result');
	const firstResultElem = resultElems[0];
	const lastResultElem = resultElems[resultElems.length - 1];
	const pagination = controller.store.pagination;

	if (firstResultElem && lastResultElem) {
		// store details
		const firstOffset = firstResultElem.getBoundingClientRect().top;
		const lastOffset = lastResultElem.getBoundingClientRect().top;
		const nextPositionData = {
			first: { elem: firstResultElem, offset: firstOffset },
			last: { elem: lastResultElem, offset: lastOffset },
			page: pagination.page,
		};
		console.log('storing things...', nextPositionData);
		previousPositionData[controller.id] = nextPositionData;
	}
}

async function infiniteReStorePosition({ controller, element }, next: Next) {
	const previousPosition = previousPositionData[controller.id];

	if (!element && previousPosition) {
		const pagination = controller.store.pagination;
		const position = pagination.page > previousPosition.page ? 'last' : 'first';
		const { elem, offset } = previousPosition[position];
		controller.log.debug(`restoring ${position} scrolling position!!!`, elem, offset);

		elem.scrollIntoView();

		// do offset scrolling (to eliminate some jank)
		window.scrollBy(0, -offset);
	}

	await next();
}
