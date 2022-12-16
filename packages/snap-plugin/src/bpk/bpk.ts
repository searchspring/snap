import type { AbstractController } from '@searchspring/snap-controller';
import type { SearchRequestModel } from '@searchspring/snapi-types';
import type { Next } from '@searchspring/snap-event-manager';

export const bpkFn = (): string =>
	Math.floor(new Date().getTime() / 86400000)
		.toString()
		.split('')
		.reverse()
		.join('');
export const bpk = (controller: AbstractController, ...params: any) => {
	controller.on('beforeSearch', async ({ request }: { request: Partial<SearchRequestModel> }, next: Next): Promise<void> => {
		// @ts-ignore
		request.bpk = request.bpk || bpkFn();
		next();
	});
};
