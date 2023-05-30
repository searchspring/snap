import { exit } from 'process';
import { getCliArgs } from './utils/index.js';
import { promises as fsp } from 'fs';

(async function () {
	try {
		const args = getCliArgs(['version', 'framework']);

		if (!args.version) {
			console.error('generatePatchFile.js did not recieve any version');
			exit(1);
		}

		if (!args.framework) {
			console.error('generatePatchFile.js did not recieve any framework');
			exit(1);
		}

		const fileContents = `
version: ${args.version}
description: 'release ${args.version}'

steps:
    - files:
        package.json:
            action: edit-json
            changes:
                - update:
                    properties:
                        "dependencies": {
                            "@searchspring/snap-${args.framework}": "${args.version}",
                            "@searchspring/snap-${args.framework}-components": "${args.version}"
                        }
`.trim();

		await fsp.writeFile(`patch.${args.framework}.${args.version}.yml`, fileContents, 'utf8');
		exit(0);
	} catch (err) {
		console.error('Error during generatePatchFile.js');
		console.error(err);
		exit(1);
	}
})();
