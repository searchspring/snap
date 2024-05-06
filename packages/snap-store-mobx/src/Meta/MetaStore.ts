import type { MetaResponseModel } from '@searchspring/snapi-types';

export class MetaStore {
	public data: MetaResponseModel;
	public badges: MetaBadges;

	constructor(metaData?: MetaResponseModel) {
		this.data = metaData ?? {};
		this.badges = new MetaBadges(this.data);
	}
}

class MetaBadges {
	public locations: { grid: string[][] } = { grid: [] };

	constructor(metaData?: MetaResponseModel) {
		const leftAreas = metaData?.badges?.locations?.left?.map((area: any) => area.tag) || [];
		const rightAreas = metaData?.badges?.locations?.right?.map((area: any) => area.tag) || [];
		const LCM = lcm(leftAreas.length, rightAreas.length);

		this.locations.grid = Array.from({ length: LCM }).map((_, index) => {
			const i = Math.floor(index / (LCM / leftAreas.length));
			return [leftAreas[i], rightAreas[i]];
		});
	}
}

function gcd(a: number, b: number): number {
	if (!b) {
		return a;
	}
	return gcd(b, a % b);
}

function lcm(a: number, b: number): number {
	const gcdValue = gcd(a, b);
	return (a * b) / gcdValue;
}
