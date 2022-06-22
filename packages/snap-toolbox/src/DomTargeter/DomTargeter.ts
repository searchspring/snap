export type Target = {
	selector: string;
	inject?: {
		action: 'before' | 'after' | 'append' | 'prepend' | 'replace';
		element: Element | ((target: Target, element: Element) => Element);
	};
	emptyTarget?: boolean;
	hideTarget?: boolean;
	autoRetarget?: boolean;
	[any: string]: unknown;
};

export type OnTarget = (target: Target, elem: Element, originalElem?: Element) => void;

let targetedElems: Array<Element> = [];
export class DomTargeter {
	private targets: Array<Target> = [];
	private onTarget: OnTarget;
	private document: Document;
	private styleBlockRefs: Record<string, Node> = {};
	private autoRetarget: boolean = false;
	private timeoutTime: number = 100;

	constructor(targets: Array<Target>, onTarget: OnTarget, document?: Document) {
		this.document = document || window.document;

		this.targets = targets;

		this.onTarget = onTarget;

		this.retarget();

		//find out if we are auto retargeting
		this.targets.forEach((target) => {
			if (target.autoRetarget) {
				this.autoRetarget = true;
			}
		});

		if (this.autoRetarget) {
			this.targets.forEach((target) => {
				const checker = () => {
					//lets not just keep trying forever
					if (this.timeoutTime < 1000) {
						//increase the time till next check
						this.timeoutTime = this.timeoutTime + 200;
						const elems = this.domQuery(target.selector);
						//did we find any targets?
						if (elems && elems.length) {
							//has this target been targeted already?
							const foundOne = elems.filter((elem) => {
								if (!targetedElems.find((e) => e == elem)) {
									return true;
								}
							});
							//got anything worth doing the thing for?
							if (foundOne) {
								this.doTheThing();
							} else {
								//try again soon
								setTimeout(checker, this.timeoutTime);
							}
						} else {
							//try again soon
							setTimeout(checker, this.timeoutTime);
						}
					}
				};
				checker();
			});
		} else {
			if (/complete|loaded/.test(this.document.readyState)) {
				// DOMContent has loaded - unhide targets
				this.targets.forEach((target) => target.hideTarget && this.unhideTarget(target.selector));
			} else {
				// attempt retarget on DOMContentLoaded
				this.document.addEventListener('DOMContentLoaded', () => {
					this.doTheThing();
				});
			}
		}
	}

	doTheThing(): void {
		this.retarget();
		// unhide targets after re-target attempt;
		this.targets.forEach((target) => target.hideTarget && this.unhideTarget(target.selector));
	}

	getTargets(): Array<Target> {
		return this.targets;
	}

	retarget(): void {
		const targetElemPairs = this.targets.flatMap((target) => {
			// hide targets before found
			if (target.hideTarget) {
				this.hideTarget(target.selector);
			}

			const elems = this.domQuery(target.selector).filter((elem) => {
				if (!targetedElems.find((e) => e == elem)) {
					return true;
				} else {
					// unhide retarget attempts
					this.unhideTarget(target.selector);
				}
			});

			targetedElems = targetedElems.concat(elems);

			return elems.map((elem) => ({ target, elem }));
		});

		const errors: string[] = [];

		targetElemPairs.forEach(({ target, elem }) => {
			if (target.inject) {
				try {
					const injectedElem = this.inject(elem, target);
					this.onTarget(target, injectedElem, elem);
				} catch (e) {
					errors.push(String(e));
				}
			} else {
				// empty target selector by default
				target.emptyTarget = target.emptyTarget ?? true;
				if (target.emptyTarget) while (elem.firstChild && elem.removeChild(elem.firstChild));

				this.onTarget(target, elem);
			}

			// unhide target
			this.unhideTarget(target.selector);
		});

		if (errors.length) {
			throw new Error(errors.reduce((acc, err) => (acc += err + '\n'), '\n'));
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
