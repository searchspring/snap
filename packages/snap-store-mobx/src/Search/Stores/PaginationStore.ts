import { observable, action, computed, makeObservable } from 'mobx';

export class PaginationStore {
	private controller;
	page: number;
	pageSize: number;
	pageSizeOptions: {
		label: string;
		value: number;
	}[];
	defaultPageSize: number;
	totalResults: number;

	constructor(controller, paginationData = { page: undefined, pageSize: undefined, totalResults: undefined, defaultPageSize: 24 }) {
		this.controller = controller;

		this.page = paginationData.page;
		this.pageSize = paginationData.pageSize;
		this.totalResults = paginationData.totalResults;
		this.defaultPageSize = paginationData.defaultPageSize;

		this.pageSizeOptions = [
			{
				label: `Show ${this.defaultPageSize}`,
				value: this.defaultPageSize,
			},
			{
				label: `Show ${this.defaultPageSize * 2}`,
				value: this.defaultPageSize * 2,
			},
			{
				label: `Show ${this.defaultPageSize * 3}`,
				value: this.defaultPageSize * 3,
			},
		];

		makeObservable(this, {
			page: observable,
			pageSize: observable,
			totalResults: observable,
			begin: computed,
			end: computed,
			totalPages: computed,
			multiplePages: computed,
			current: computed,
			first: computed,
			last: computed,
			next: computed,
			previous: computed,
			getPages: action,
			setPageSize: action,
		});
	}

	get begin(): number {
		return this.pageSize * (this.page - 1) + 1;
	}

	get end(): number {
		if (this.pageSize * this.page > this.totalResults) {
			return this.totalResults;
		}

		return this.pageSize * this.page;
	}

	get totalPages(): number {
		return Math.ceil(this.totalResults / this.pageSize);
	}

	get multiplePages(): boolean {
		return this.pageSize < this.totalResults;
	}

	get current(): Page {
		return new Page(this.controller, {
			number: this.page,
			active: true,
		});
	}

	get first(): Page {
		return new Page(this.controller, {
			number: 1,
			active: this.page == 1,
		});
	}

	get last(): Page {
		return new Page(this.controller, {
			number: this.totalPages,
			active: this.totalPages == this.page,
		});
	}

	get next(): Page {
		if (this.page < this.totalPages) {
			return new Page(this.controller, {
				number: this.page + 1,
			});
		}
	}

	get previous(): Page {
		if (this.page > 1) {
			return new Page(this.controller, {
				number: this.page - 1,
			});
		}
	}

	getPages(min?: number, max?: number): Page[] {
		if (!Number.isInteger(min)) {
			return [];
		}

		if (!Number.isInteger(max)) {
			const surrounding = min - 1;

			let from = this.page;
			let to = this.page;
			let last = to - from;

			do {
				last = to - from;

				if (to < this.totalPages) {
					to++;
				}

				if (to - from >= surrounding) {
					break;
				}

				if (from > 1) {
					from--;
				}
			} while (last != to - from && to - from < surrounding);

			min = from - this.page;
			max = to - this.page;
		} else {
			min = -Math.abs(min);
			max = Math.abs(max);
		}

		const pages = [];

		for (let i = this.page + min; i <= this.page + max; i++) {
			if (i > 0 && i <= this.totalPages) {
				pages.push(
					new Page(this.controller, {
						number: i,
						active: i == this.page,
					})
				);
			}
		}

		return pages;
	}

	setPageSize(num: number): void {
		if (num) {
			this.controller.urlManager.set('pageSize', num).go();
		}
	}
}

export class Page {
	controller;
	number: number;
	active: boolean;
	url;
	key: string;

	constructor(
		controller,
		page: {
			number: number;
			active?: boolean;
		}
	) {
		this.controller = controller;
		this.number = page.number;
		this.active = page.active || false;
		this.url = this.controller?.urlManager?.set('page', this.number);
		this.key = this.url.href;
	}
}
