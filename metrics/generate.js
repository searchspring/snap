import { promises as fsp } from 'fs';
import { exit } from 'process';

const COVERAGE_FILE = './coverage/coverage-summary.json';
const VERSION_FILE = './lerna.json';
const METRICS_DIR = './metrics/data';

(async function () {
	try {
		await prepare();

		const now = new Date();
		await Promise.all([generateVersion(now), generateCoverage(now)]);
	} catch (err) {
		console.error('unable to process coverage file');
		console.error(err);
		exit(1);
	}
})();

async function prepare() {
	// delete previous metrics (if exists)
	try {
		await fsp.stat(METRICS_DIR);
		await fsp.rm(METRICS_DIR, { recursive: true });
	} catch (err) {
		// file does not exist
	}

	// make metrics directory
	await fsp.mkdir(METRICS_DIR);
}

async function generateVersion(now) {
	try {
		await fsp.stat(VERSION_FILE);
	} catch (err) {
		throw 'no coverage data found!';
	}

	const lernaContents = await fsp.readFile(VERSION_FILE, 'utf8');
	const lernaData = JSON.parse(lernaContents);
	const version = lernaData.version;

	if (!version) {
		throw 'no version found!';
	}

	// generate metrics file to send to s3
	const filename = `SnapRelease-${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}${now.getMinutes()}.json`;
	const obj = {
		timestamp: now,
		type: 'snap-release',
		data: { version },
	};

	const contents = JSON.stringify(obj);

	console.log('Creating', filename, 'with contents', contents);
	await fsp.writeFile(`${METRICS_DIR}/${filename}`, contents);
}

async function generateCoverage(now) {
	try {
		await fsp.stat(COVERAGE_FILE);
	} catch (err) {
		throw 'no coverage data found!';
	}

	const coverage = {};
	const coverageContents = await fsp.readFile(COVERAGE_FILE, 'utf8');
	const coverageData = JSON.parse(coverageContents);

	// build out coverage data
	for (const key in coverageData) {
		const entryData = coverageData[key];
		let packageName = key.replace(/.*\/snap\/packages\/([^\/]*)\/.*/, '$1');

		if (packageName == 'total') {
			packageName = 'monorepo';
		}

		let packageCoverage = coverage[packageName];
		if (entryData.lines) {
			if (!packageCoverage) {
				coverage[packageName] = entryData.lines;
				packageCoverage = coverage[packageName];
			} else {
				packageCoverage.total += entryData.lines.total;
				packageCoverage.covered += entryData.lines.covered;
				packageCoverage.skipped += entryData.lines.skipped;
				packageCoverage.pct = +((packageCoverage.covered / packageCoverage.total) * 100).toFixed(2);
			}
		}
	}

	// generate metrics files to send to s3
	const writePromises = [];
	for (const key in coverage) {
		const packageData = coverage[key];
		const filename = `SnapCoverage[${key}]-${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}${now.getMinutes()}.json`;

		const obj = {
			timestamp: now,
			type: 'snap-coverage',
			data: { package: key, total: packageData.total, covered: packageData.covered, percentage: packageData.pct },
		};

		const contents = JSON.stringify(obj);

		writePromises.push(fsp.writeFile(`${METRICS_DIR}/${filename}`, contents));

		console.log('Creating', filename, 'with contents', contents);
	}

	await Promise.all(writePromises);
}
