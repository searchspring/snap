import type { ElementPositionObj } from '../types';
import { AbstractController } from '../Abstract/AbstractController';

export const restorePosition = (element: ElementPositionObj | undefined, controller: AbstractController): Promise<void> => {
	controller.log.debug('restorePosition: restoring position to element: ', element);
	return new Promise<void>(async (resolve) => {
		// wait for element to appear in DOM with retries
		const maxWaitAttempts = 20;
		const waitInterval = 50;
		let waitAttempts = 0;
		let elem: Element | null = null;

		while (!elem && waitAttempts < maxWaitAttempts) {
			elem = document.querySelector(element?.selector!);
			if (!elem) {
				waitAttempts++;
				await new Promise((res) => setTimeout(res, waitInterval));
			}
		}

		if (!elem) {
			controller.log.debug('restorePosition: element not found with selector: ', {
				waitedMs: waitAttempts * waitInterval,
				selector: element?.selector,
			});
			resolve();
			return;
		}

		// the target offset from the top of the viewport where we want the element
		const targetOffsetFromTop = element?.domRect?.top || 0;

		// for case where the element clicked on has no height, find a valid parent
		while (elem && !elem.getBoundingClientRect().height) {
			elem = elem.parentElement;
		}

		if (!elem) {
			controller.log.debug('restorePosition: element has no height and no valid parent found');
			resolve();
			return;
		}

		let lastScrollY = window.scrollY;
		let restorationAborted = false;

		// detect if user scrolls during restoration
		const userScrollHandler = () => {
			const currentScrollY = window.scrollY;
			// only flag as user scroll if it's not a micro-adjustment from our restoration
			if (Math.abs(currentScrollY - lastScrollY) > 50) {
				restorationAborted = true;
				controller.log.debug('restorePosition: user scrolled during restoration, aborting');
			}
		};

		window.addEventListener('wheel', userScrollHandler, { passive: true });
		window.addEventListener('touchmove', userScrollHandler, { passive: true });

		try {
			// use MutationObserver to detect layout changes from lazy loading
			const contentChanges: number[] = [];
			let mutationCount = 0;
			const maxMutations = 1000; // prevent infinite observation

			const observer = new MutationObserver(() => {
				if (restorationAborted) return;
				mutationCount++;
				contentChanges.push(Date.now());
			});

			// observe the entire document for layout-affecting changes
			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['style', 'class'], // only watch style/class changes that might affect layout
			});

			// use ResizeObserver to detect when elements change size (like images loading)
			const resizeObserver = new ResizeObserver(() => {
				if (restorationAborted) return;
				contentChanges.push(Date.now());
			});

			// TODO: need to only observe relevant elements to avoid performance hit
			// observe all images above the target element that might still be loading
			const images = Array.from(document.querySelectorAll('img')).filter((img) => {
				const rect = img.getBoundingClientRect();
				return rect.top < (element?.domRect?.top || 0);
			});

			images.forEach((img) => {
				if (!img.complete) {
					resizeObserver.observe(img);
				}
			});

			const maxAttempts = 100;
			const checkInterval = 100;
			let attempts = 0;
			let stableCheckCount = 0;
			const requiredStableChecks = 3; // require 3 consecutive stable checks

			const attemptScroll = async (): Promise<boolean> => {
				if (restorationAborted) {
					return true; // stop attempting
				}

				attempts++;

				// get current position of element relative to viewport
				const currentRect = elem!.getBoundingClientRect();
				const currentOffsetFromTop = currentRect.top;

				// calculate how far off we are from the target position
				const diff = Math.abs(currentOffsetFromTop - targetOffsetFromTop);

				// check if we've had recent content changes
				const now = Date.now();
				const recentChanges = contentChanges.filter((time) => now - time < 200).length;

				if (diff <= 1 && recentChanges === 0) {
					stableCheckCount++;
					if (stableCheckCount >= requiredStableChecks) {
						controller.log.debug('restorePosition: restored position to: ', elem, {
							targetOffset: targetOffsetFromTop,
							finalOffset: currentOffsetFromTop,
							diff,
						});
						return true; // successfully positioned
					}
				} else {
					stableCheckCount = 0; // reset stability counter

					if (diff > 1) {
						// scroll to position the element at the exact same offset from top of viewport
						lastScrollY = window.scrollY;
						const scrollAdjustment = currentOffsetFromTop - targetOffsetFromTop;
						window.scrollBy({ top: scrollAdjustment, left: 0, behavior: 'instant' });
					}
				}

				// stop if we've exceeded attempts or mutations
				if (attempts >= maxAttempts || mutationCount >= maxMutations) {
					controller.log.debug('restorePosition: restoration attempt limit reached', {
						attempts,
						mutationCount,
						finalDiff: diff,
					});
					return true;
				}

				// wait before next check
				await new Promise((res) => setTimeout(res, checkInterval));
				return attemptScroll(); // recursive call
			};

			await attemptScroll();

			// cleanup observers
			observer.disconnect();
			resizeObserver.disconnect();
		} finally {
			window.removeEventListener('wheel', userScrollHandler);
			window.removeEventListener('touchmove', userScrollHandler);
		}

		resolve();
	});
};
