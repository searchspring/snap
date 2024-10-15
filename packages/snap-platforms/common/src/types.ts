type ValueBackgroundFilter = {
	type: 'value';
	field: string;
	value: string | number;
};

type RangeBackgroundFilter = {
	type: 'range';
	field: string;
	value: { low: number; high: number };
};

export type PluginBackgroundFilter = ValueBackgroundFilter | RangeBackgroundFilter;
export type PluginBackgroundFilterGlobal = PluginBackgroundFilter & { background: true };
export type PluginControl = {
	controllerIds?: (string | RegExp)[];
	controllerTypes?: ('search' | 'autocomplete' | 'recommendation')[];
};
