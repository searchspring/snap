import type { MetaResponseModel } from '@searchspring/snapi-types';

type MetaStoreConfig = {
	data: {
		meta: MetaResponseModel;
	};
};
export class MetaStore {
	public data: MetaResponseModel;
	public badges: MetaBadges;

	constructor(params: MetaStoreConfig) {
		const { meta } = params.data;
		this.data = meta ?? {};
		this.badges = new MetaBadges(this.data);
	}
}

class MetaBadges {
	public groups: Record<string, { sections: string[]; grid: string[][] }> = {};

	constructor(metaData: MetaResponseModel) {
		// 'overlay' group is created by default - could support additional groups via config in the future
		const groups = { overlay: { sections: ['left', 'right'] } };

		// process groups - create the grid for each group
		Object.keys(groups).map((name) => {
			const group = groups[name as keyof typeof groups];
			const sections: { areas: string[]; grid: string[] }[] = group.sections.map((section) => ({
				areas: metaData?.badges?.locations?.[section as keyof typeof metaData.badges.locations]?.map((area) => area.tag) || [],
				grid: [],
			}));

			// find lcm of sections
			const lcmSections = sections.map((section) => section.areas.length).reduce(lcm);

			sections.forEach((section) => {
				section.grid = Array.from({ length: lcmSections }).map((_, index) => section.areas[Math.floor(index / (lcmSections / section.areas.length))]);
			});

			// set the grid by creating rows of columns
			const grid = Array.from({ length: lcmSections }).map((_, i) => {
				return sections.map((section) => section.grid[i]);
			});

			this.groups[name] = {
				sections: group.sections,
				grid,
			};
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
