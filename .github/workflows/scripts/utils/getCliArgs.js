export const getCliArgs = (params) => {
	const output = {};
	try {
		const args = process.argv.slice(2);
		params.forEach((param) => {
			const index = args.indexOf(`--${param}`);
			const value = args[index + 1];
			output[param] = value;
		});
	} catch (e) {
		return '';
	}
	return output;
};
