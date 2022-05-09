export function mergeParams(...args: any[]): any {
	const ret: any = {};

	args.reverse().forEach((params) => {
		Object.keys(params).forEach((key) => {
			const values = params[key] instanceof Array ? params[key] : [params[key]];

			ret[key] = (ret[key] || []).concat(values);
		});
	});

	return ret;
}
