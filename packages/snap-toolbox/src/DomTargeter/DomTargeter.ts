export type Target = {
	selector: string;
	inject?: {
		action: 'before' | 'after' | 'append' | 'prepend' | 'replace';
		element: Element | ((target: Target, element: Element) => Element);
	};
	emptyTarget?: boolean;
	hideTarget?: boolean;
	autoRetarget?: boolean;
	unsetTargetMinHeight?: boolean;
	clickRetarget?: boolean | string;
	[any: string]: unknown;
};

export type OnTarget = (target: Target, elem: Element, originalElem?: Element) => void | Promise<void>;

let globallyTargetedElems: Array<Element> = [];
export class DomTargeter {
	private targets: Array<Target> = [];
	private onTarget: OnTarget;
	private document: Document;
	private styleBlockRefs: Record<string, Node> = {};
	private targetedElems: Array<Element> = [];

	constructor(targets: Array<Target>, onTarget: OnTarget, document?: Document) {
		this.document = document || window.document;

		this.targets = targets;

		this.onTarget = onTarget;

		this.retarget();

		this.targets.forEach((target) => {
			let timeoutTime = 100;
			const checker = () => {
				// lets not just keep trying forever - this waits roughly 12 seconds before giving up.
				if (timeoutTime < 2000) {
					// increase the time till next check
					timeoutTime = timeoutTime + 200;
					this.retarget();
					setTimeout(checker, timeoutTime);
				} else {
					// timed out, lets unhide the target
					target.hideTarget && this.unhideTarget(target.selector);
				}
			};

			// add click event to restart retargeting check
			if (target.clickRetarget) {
				let clickElems: (Element | Document)[] = [];

				if (typeof target.clickRetarget == 'boolean') {
					clickElems.push(this.document);
				} else {
					clickElems = Array.from(this.document.querySelectorAll(target.clickRetarget));
				}

				clickElems.map((elem) => {
					elem.addEventListener('click', () => {
						timeoutTime = 100;
						checker();
					});
				});
			}

			if (target.autoRetarget) {
				// do initial retargeting check
				checker();
			} else if (/complete|interactive|loaded/.test(this.document.readyState)) {
				// DOMContent has loaded - unhide targets
				target.hideTarget && this.unhideTarget(target.selector);
			} else {
				// attempt retarget on DOMContentLoaded
				this.document.addEventListener('DOMContentLoaded', () => {
					this.retarget();
					target.hideTarget && this.unhideTarget(target.selector);
				});
			}
		});
	}

	getTargets(): Array<Target> {
		return this.targets;
	}

	retarget(): void {
		const targetElemPairs = this.targets.flatMap((target) => {
			// hide targets before found
			target.hideTarget && this.hideTarget(target.selector);

			const elems = this.domQuery(target.selector).filter((elem) => {
				if (!globallyTargetedElems.find((e) => e == elem) && !this.targetedElems.find((e) => e == elem)) {
					return true;
				} else {
					// unhide retarget attempts
					target.hideTarget && this.unhideTarget(target.selector);
				}
			});

			if (!target.inject?.element) {
				globallyTargetedElems = globallyTargetedElems.concat(elems);
			}

			return elems.map((elem) => ({ target, elem }));
		});

		for (const { target, elem } of targetElemPairs) {
			try {
				if (target.inject) {
					const injectedElem = this.inject(elem, target);
					this.targetedElems = this.targetedElems.concat(elem);

					// handle both sync and async onTarget functions
					const result = this.onTarget(target, injectedElem, elem);
					if (result && typeof result.then === 'function') {
						// async function - handle promise
						result.catch((error) => {
							console.error('DomTargeter onTarget async failure:', error);
						});
					}
				} else {
					// empty target selector by default
					target.emptyTarget = target.emptyTarget ?? true;
					if (target.emptyTarget) while (elem.firstChild && elem.removeChild(elem.firstChild));

					// handle both sync and async onTarget functions
					const result = this.onTarget(target, elem);
					if (result && typeof result.then === 'function') {
						// async function - handle promise
						result.catch((error) => {
							console.error('DomTargeter onTarget async failure:', error);
						});
					}
				}

				// unhide target
				target.hideTarget && this.unhideTarget(target.selector);

				// remove styles by default
				target.unsetTargetMinHeight = target.unsetTargetMinHeight ?? true;
				if (target.unsetTargetMinHeight && (elem as HTMLElement).style.minHeight) {
					(elem as HTMLElement).style.minHeight = '';
				}
			} catch (err) {
				// log the retarget failure but continue with other elements
				console.error('DomTargeter retarget failure:', err);
			}
		}
	}

	unhideTarget = (selector: string): void => {
		if (this.styleBlockRefs[selector]) {
			try {
				this.document.head.removeChild(this.styleBlockRefs[selector]);
				delete this.styleBlockRefs[selector];
			} catch (err) {
				// do nothing
			}
		}
	};

	hideTarget = (selector: string): void => {
		if (this.styleBlockRefs[selector]) return;

		const styles = `${selector} { visibility: hidden !important }`;
		const styleBlock = this.document.createElement('style');
		styleBlock.setAttribute('type', 'text/css');
		styleBlock.appendChild(this.document.createTextNode(styles));
		this.document.head.appendChild(styleBlock);
		this.styleBlockRefs[selector] = styleBlock;
	};

	private domQuery(selector: string) {
		return Array.from(this.document.querySelectorAll(selector));
	}

	private inject(elem: Element, target: Target): Element {
		if (!target || !target.inject) {
			throw new Error('DomTargeter::inject: Injected element unspecified');
		}

		const injectedElem = target.inject.element instanceof Function ? target.inject.element(target, elem) : target.inject.element;

		if (!injectedElem) {
			throw new Error('DomTargeter::inject: Injected element unspecified');
		}

		if (!elem.parentNode) {
			throw new Error('DomTargeter::inject: Provided element has no parent element');
		}

		switch (target?.inject?.action) {
			case 'before':
				elem.parentNode.insertBefore(injectedElem, elem);
				break;
			case 'after':
				if (elem.nextSibling) {
					elem.parentNode.insertBefore(injectedElem, elem.nextSibling);
				} else {
					elem.parentNode.appendChild(injectedElem);
				}
				break;
			case 'append':
				elem.appendChild(injectedElem);
				break;
			case 'prepend':
				if (elem.firstChild) {
					elem.insertBefore(injectedElem, elem.firstChild);
				} else {
					elem.appendChild(injectedElem);
				}
				break;
			case 'replace':
				elem.parentNode.replaceChild(injectedElem, elem);
				break;
		}

		return injectedElem;
	}
}
