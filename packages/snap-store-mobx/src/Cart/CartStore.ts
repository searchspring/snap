import { observable, computed, makeObservable } from 'mobx';
import { EventManager } from '@searchspring/snap-event-manager';
import type { Middleware } from '@searchspring/snap-event-manager';
import type { Product } from '../Search/Stores';

export class CartStore {
	public items: Product[] = [];
	private eventManager;
	constructor() {
		makeObservable(this, {
			items: observable,
			price: computed,
			count: computed,
			msrp: computed,
		});

		this.eventManager = new EventManager();
	}

	public on<T>(event: string, ...func: Middleware<T>[]): void {
		this.eventManager.on(event, ...func);
	}

	get count(): number {
		let count = 0;
		this.items.forEach((item) => {
			count += item.quantity;
		});
		return count;
	}

	get price(): number {
		let newPrice = 0;
		this.items.forEach((item) => {
			// account for string prices, and floating 0s.
			newPrice = (newPrice * 100 + +(+((item.display.mappings.core?.price || 0) * 100) * item.quantity)) / 100 || 0;
		});
		return newPrice;
	}

	get msrp(): number {
		let newPrice = 0;
		this.items.forEach((item) => {
			// account for string prices, and floating 0s.
			newPrice =
				(newPrice * 100 +
					+((+((item.display.mappings.core?.msrp || 0) * 100) || +((item.display.mappings.core?.price || 0) * 100) || 0) * item.quantity)) /
					100 || 0;
		});
		return newPrice;
	}

	public addItems(items: Product[]): void {
		items.forEach((item) => {
			const idx = this.items.findIndex((result) => result.id == item.id);

			//is it in the items list?
			if (idx == -1) {
				this.items.push(item);
			}
		});

		this.eventManager.fire('addItems', { cart: this, items });
	}

	public removeItems(items: Product[]): void {
		const newIds = [...this.items];

		items.forEach((item) => {
			const idx = newIds.findIndex((result) => result.id == item.id);

			//is it in the selected items?
			if (idx > -1) {
				// remove it entirely
				newIds.splice(idx, 1);
				// when emptied fire empty event
				if (newIds.length == 0) {
					this.eventManager.fire('emptied', { cart: this });
				}
			}
		});

		this.items = newIds;

		this.eventManager.fire('removeItems', { cart: this, items });
	}

	public reset(): void {
		this.items = [];
		this.eventManager.fire('reset', { cart: this });
	}
}
