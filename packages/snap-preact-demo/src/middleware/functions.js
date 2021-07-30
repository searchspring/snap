export async function scrollToTop(search, next) {
	if (!search.controller.config.settings?.infinite || search.controller.store.pagination?.page == 1) {
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });
	}

	await next();
}

export async function timeout(microSeconds) {
	console.log(`...waiting ${microSeconds} μsecs...`);

	return new Promise((resolve, reject) => {
		setTimeout(resolve, microSeconds);
	});
}

export function ensure(func, callback, customOptions) {
	const options = {
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

export async function until(thing, customOptions) {
	const options = {
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

		function checkForThing(thing) {
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
