import { exit } from 'process';
import { cmp, getCliArgs } from './utils/index.js';

(async function () {
	try {
		const args = getCliArgs(['tags']);

		if (!args.tags) {
			console.error('getTag.js did not recieve any tags');
			exit(1);
		}

		const tags = args.tags
			.split('\n')
			.map((tag) => tag.trim().replace(/^v/, ''))
			.filter((tag) => tag);

		tags.sort(cmp).reverse();

		const version = tags[0];

		if (version) {
			console.log(version);
			exit(0);
		} else {
			throw new Error('getTag.js did not locate a tag');
		}
	} catch (err) {
		console.error('Error during getTag.js');
		console.error(err);
		exit(1);
	}
})();
