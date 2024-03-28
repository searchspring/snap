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
	public locations: { gridProperties: Record<string, string> } = { gridProperties: {} };

	constructor(metaData?: MetaResponseModel) {
		const leftAreas = metaData?.badges?.locations?.overlay?.left?.map((area: any) => area.name) || [];
		const rightAreas = metaData?.badges?.locations?.overlay?.right?.map((area: any) => area.name) || [];
		const LCM = lcm(leftAreas.length, rightAreas.length);
		const leftAreasLCM = Array.from({ length: LCM }).map((_, index) => leftAreas[Math.floor(index / (LCM / leftAreas.length))]);
		const rightAreasLCM = Array.from({ length: LCM }).map((_, index) => rightAreas[Math.floor(index / (LCM / rightAreas.length))]);
		const gridTemplateAreas = leftAreasLCM.map((left, index) => `"${left} ${rightAreasLCM[index]}"`).join(' ');
		const columns = Object.keys(metaData?.badges?.locations?.overlay || {}).length;

		this.locations.gridProperties = {
			gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : '',
			gridTemplateAreas,
		};
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
