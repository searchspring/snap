export type UntilOptions = {
	checkMax: number;
	checkCount: number;
	checkTime: number;
	exponential: number;
	defer: boolean;
	executeFunction: boolean;
};

const defaultUntilOptions: UntilOptions = {
	checkMax: 25,
	checkCount: 0,
	checkTime: 60,
	exponential: 1.1,
	defer: false,
	executeFunction: true,
};

export const until = async (thing: unknown, customOptions?: Partial<UntilOptions>): Promise<unknown> => {
	const options: UntilOptions = {
		...defaultUntilOptions,
		...(customOptions || {}),
	};

	return new Promise(async (resolve, reject) => {
		const checkForThing = async (thing: unknown) => {
			switch (typeof thing) {
				case 'function': {
					if (options.executeFunction) {
						return thing();
					}
					return thing;
				}
				default: {
					if (thing) {
						return thing;
					}
				}
			}
		};
		const thingCheck = await checkForThing(thing);
		if (thingCheck && !options.defer) {
			resolve(thingCheck);
		} else {
			const waiting = () => {
				window?.setTimeout(async () => {
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
			};
			waiting();
		}
	});
};
