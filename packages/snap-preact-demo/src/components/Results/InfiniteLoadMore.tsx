import { h } from 'preact';
import { useRef, useState, useEffect, useLayoutEffect } from 'preact/hooks';

import { useIntersection } from '@searchspring/snap-preact-components';

function useScrollPosition(elem) {
	const [scrollPosition, setScrollPosition] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const offset = elem.getBoundingClientRect().top;
			setScrollPosition(offset);
		};

		if (elem) {
			window.addEventListener('scroll', handleScroll);
		} else {
			setScrollPosition(0);
		}

		return () => window.removeEventListener('scroll', handleScroll);
	}, [elem]);

	return scrollPosition;
}

export const InfiniteLoadMore = (props) => {
	const autoFetch = props.autoFetch || false;
	const restoreScroll = props.restoreScroll || false;
	const infiniteInitialLoadTime = props.initialLoadTime || 2100;
	const infiniteLoadTime = props.loadTime || 700;
	const infiniteDelayTime = props.delayTime || 300;
	const infiniteTriggerOffset = props.triggerOffset || '100%';

	const position = props.position;
	const controller = props.controller;
	const infinite = controller.config.settings.infinite;
	const { loaded, loading, pagination } = controller.store;

	if (!controller || controller.type != 'search' || !infinite) return;
	// if (position != 'previous' || position != 'next') return;

	/*
		?page=30

		initial loads pages 28, 29, 30
		scroll DOWN

		?page=31
		29, 30, 31
		reload page 29, 30, 31



		SCROLL UP PROBLEM

		?page=30&infinite=down

		initial loads pages 28, 29, 30
		scroll UP

		?page=27&infinite=up
		27, 28, 29
		reload page 27, 28, 29

	*/

	const infiniteRef = useRef(null);
	const infiniteReached = useIntersection(infiniteRef);
	const infiniteApproaching = autoFetch && useIntersection(infiniteRef, infiniteTriggerOffset);
	const [infiniteButtonVisible, setInfiniteButtonVisible] = useState(false);
	const [infiniteReady, setInfiniteReady] = useState(false);
	const [infiniteTimeout, setInfiniteTimeout] = useState(null);
	const [infiniteRestoreElem, setinfiniteRestoreElem] = useState(null);

	console.log('Load more initialized..........', position);

	console.log('infiniteReady', infiniteReady);
	console.log('infiniteReached', infiniteReached);
	console.log('infiniteApproaching', infiniteApproaching);
	console.log('infiniteButtonVisible', infiniteButtonVisible);

	// do once to prevent triggering on initial load
	useEffect(() => {
		console.log('LOOOOOOAAAAAADDDDDIIIINGGGGG???????????');
		clearTimeout(infiniteTimeout);
		const timeout = setTimeout(() => setInfiniteReady(true), infiniteReady ? infiniteLoadTime : infiniteInitialLoadTime);
		setInfiniteReady(false);
		return () => clearTimeout(timeout);
	}, [pagination.page]);

	// const updatedOffset = useMemo(() => {
	//   // Perform calculations or side effects here
	// 	if (infiniteRestoreElem) {
	// 		const elem = infiniteRestoreElem.elem;
	// 		const offset = elem.getBoundingClientRect().top;

	// 		return { elem, offset };
	// 	}
	// }, [infiniteRestoreElem]);

	const updatedOffset = useScrollPosition(infiniteRestoreElem?.elem);

	controller.log.debug(`Getting UPDATED ${position} positioning data!`, updatedOffset);

	useLayoutEffect(() => {
		// restore the scroll position
		if (restoreScroll && infiniteRestoreElem) {
			const { elem, offset } = infiniteRestoreElem;

			setinfiniteRestoreElem(null);
			controller.log.debug(`Restoring ${position} scrolling position!!!`, elem, offset, updatedOffset);

			elem.scrollIntoView();

			// do offset scrolling (to eliminate some jank)
			window.scrollBy(0, -(updatedOffset || offset));
		}
	}, [pagination.page]);

	const loadMore = () => {
		console.log('LOADING MOOOARRRR!');
		setInfiniteButtonVisible(false);
		setInfiniteTimeout(null);

		const resultElems = document.querySelectorAll('.ss__result');
		const firstResultElem = resultElems[0];
		const lastResultElem = resultElems[resultElems.length - 1];

		const elem = position == 'next' ? lastResultElem : firstResultElem;
		const offset = elem.getBoundingClientRect().top;
		setinfiniteRestoreElem({ elem, offset });
		controller.log.debug(`Storing NEW ${position} positioning data!`, elem, offset);

		const directionParam = controller.settings?.infinite?.unload?.directionParm || 'dir';
		pagination[position].url.set(directionParam, position).go({ history: 'replace' });
	};

	if (pagination[position] && !loading && loaded && infiniteReady) {
		if (infiniteReached) {
			// the end has been reached - show the button
			setInfiniteButtonVisible(true);
			if (infiniteTimeout) {
				console.log('!!!!   CLEARING THE TIMEOUT!');
				clearTimeout(infiniteTimeout);
				setInfiniteTimeout(null);
			}
		} else if (infiniteApproaching && !infiniteTimeout && !infiniteButtonVisible) {
			// the end is coming up... load more results and hide the button
			const timeout = setTimeout(() => {
				if (pagination[position] && !loading && loaded) {
					loadMore();
				}
			}, infiniteDelayTime);
			console.log('SETTING THE TIMEOUT!');
			setInfiniteTimeout(timeout);
		}
	}

	return (
		<div ref={infiniteRef}>
			{pagination[position] && (
				<div style={{ textAlign: 'center', visibility: infiniteButtonVisible ? 'visible' : 'hidden' }}>
					<button disabled={loading} onClick={() => loadMore()}>
						Load More
					</button>
				</div>
			)}
		</div>
	);
};
