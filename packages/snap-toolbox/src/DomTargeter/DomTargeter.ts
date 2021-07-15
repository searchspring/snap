export type Target = {
	selector: string;
	inject?: {
		action: 'before' | 'after' | 'append' | 'prepend' | 'replace';
		element: Element | ((target: Target, element: Element) => Element);
	};
	hideTarget?: boolean;
	[any: string]: unknown;
};

export type OnTarget = (target: Target, elem: Element, originalElem?: Element) => void;

let targetedElems: Array<Element> = [];
export class DomTargeter {
	private targets: Array<Target> = [];
	private onTarget: OnTarget;
	private document: Document;
	private styleBlockRefs = {};

	constructor(targets: Array<Target>, onTarget: OnTarget, document?: Document) {
		this.document = document || window.document;

		this.targets = targets;

		this.onTarget = onTarget;

		this.retarget();

		this.document.addEventListener('DOMContentLoaded', () => {
			this.retarget();
		});
	}

	retarget(): void {
		const targetElemPairs = this.targets.flatMap((target) => {
			const elems = this.domQuery(target.selector).filter((elem) => {
				if (!targetedElems.find((e) => e == elem)) {
					// only add style blocks to newly targeted elements
					if (target.hideTarget) {
						this.hideTarget(target.selector);
					}
					return true;
				}
			});

			targetedElems = targetedElems.concat(elems);

			return elems.map((elem) => ({ target, elem }));
		});

		const errors = [];

		targetElemPairs.forEach(({ target, elem }) => {
			// remove style block we added earlier
			if (target.hideTarget) {
				this.unhideTarget(target.selector);
			}

			if (target.inject) {
				try {
					const injectedElem = this.inject(elem, target);
					this.onTarget(target, injectedElem, elem);
				} catch (e) {
					errors.push(e);
				}
			} else {
				// empty target selector by default
				while (elem.firstChild && elem.removeChild(elem.firstChild));
				this.onTarget(target, elem);
			}
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
