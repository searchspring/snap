import deepmerge from 'deepmerge';

export async function timeout(microSeconds: number) {
	console.log(`...waiting ${microSeconds} μsecs...`);

	return new Promise((resolve, reject) => {
		setTimeout(resolve, microSeconds);
	});
}

type EnsureOptions = {
	checkMax: number;
	checkCount: number;
	checkTime: number;
	defer: boolean;
};

export function ensure(func: () => any, callback: () => any, customOptions?: Partial<EnsureOptions>) {
	const options: EnsureOptions = {
		checkMax: 600,
		checkCount: 0,
		checkTime: 50,
		defer: false,
		...customOptions,
	};

	if (func() && !options.defer) {
		callback();
	} else {
		const checkInterval = window.setInterval(() => {
			if (func()) {
				window.clearInterval(checkInterval);
				callback();
			}
			options.checkCount++;

			if (options.checkCount > options.checkMax) {
				window.clearInterval(checkInterval);
			}
		}, options.checkTime);
	}
}

type UntilOptions = {
	checkMax: number;
	checkCount: number;
	checkTime: number;
	exponential: number;
	defer: boolean;
};

export async function until(thing: any, customOptions?: Partial<UntilOptions>) {
	const options: UntilOptions = {
		checkMax: 20,
		checkCount: 0,
		checkTime: 50,
		exponential: 1.2,
		defer: false,
		...customOptions,
	};

	return new Promise(async (resolve, reject) => {
		const thingCheck = await checkForThing(thing);
		if (thingCheck && !options.defer) {
			resolve(thingCheck);
		} else {
			waiting();
		}

		function waiting() {
			window.setTimeout(async () => {
				const thingCheck = await checkForThing(thing);
				if (thingCheck) {
					return resolve(thingCheck);
				}
				options.checkCount++;
				options.checkTime *= options.exponential;

				if (options.checkCount < options.checkMax) {
					return waiting();
				}

				// timeout reached
				return reject();
			}, options.checkTime);
		}

		function checkForThing(thing: any) {
			switch (typeof thing) {
				case 'function': {
					return thing();
				}
				default:
					if (thing) {
						return thing;
					}
			}
		}
	});
}

export function combineMerge(target: any, source: any, options: any) {
	const destination = target.slice();

	source.forEach((item: any, index: number) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
		} else if (options.isMergeableObject(item)) {
			destination[index] = deepmerge(target[index], item, options);
		} else if (target.indexOf(item) === -1) {
			destination.push(item);
		}
	});
	return destination;
}
