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

type DomQuery = (selector: string) => Array<Element>;

export class DomTargeter {
	private targets: Array<Target> = [];
	private onTarget: OnTarget;
	private document: Document;
	private styleBlockRefs = [];

	constructor(targets: Array<Target>, onTarget: OnTarget, document?: Document) {
		this.document = document || window.document;

		this.targets = targets;

		this.onTarget = onTarget;

		this.retarget();

		document.addEventListener('DOMContentLoaded', () => {
			this.retarget();
			//clean up the style blocks we added earlier
			if (this.styleBlockRefs.length) {
				for (let i = 0; i < this.styleBlockRefs.length; i++) {
					document.head.removeChild(this.styleBlockRefs[i]);
				}
			}
		});
	}

	retarget(): void {
		const targetElemPairs = this.targets.flatMap((target) => {
			const elems = this.domQuery(target.selector).filter((elem) => !targetedElems.find((e) => e == elem));

			targetedElems = targetedElems.concat(elems);

			return elems.map((elem) => ({ target, elem }));
		});

		targetElemPairs.forEach(({ target, elem }) => {
			if (!target.inject) {
				if (target.hideTarget) {
					this.addHideTargetStyle(target);
				}
				//empty target selector by default
				while (elem.firstChild && elem.removeChild(elem.firstChild));
				this.onTarget(target, elem);
			} else {
				if (target.inject.action == 'replace' && target.hideTarget) {
					this.addHideTargetStyle(target);
				}
				const injectedElem = this.inject(elem, target);
				this.onTarget(target, injectedElem, elem);
			}
		});
	}

	//occasionally, our scripts excute before the element exists, In these cases we rerun this code after document ready,
	//however, this can cause a slight delay in our display being rendered, thus causing a 'flash' of the native display showing briefly
	//followed by us emptying it. To prevent this, we add a style block that will visibly hide the native display before it ever gets a chance to show
	addHideTargetStyle = (target: Target) => {
		/* Set the style */
		var styles = `${target.selector} { visibility: hidden }`;
		/* Create style document */
		var css = window.document.createElement('style');
		css.type = 'text/css';
		css.appendChild(window.document.createTextNode(styles));
		/* Append style to the tag name */
		window.document.head.appendChild(css);
		this.styleBlockRefs.push(css);
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
				elem.parentNode!.replaceChild(injectedElem, elem);
				break;
		}

		return injectedElem;
	}
}
