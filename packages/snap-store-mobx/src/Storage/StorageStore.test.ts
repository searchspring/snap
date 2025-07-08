import { StorageStore, StorageType } from './StorageStore';

describe('Storage Store', () => {
	beforeEach(() => {
		expect.hasAssertions();
	});

	it('does not require any constructor params', () => {
		const storage = new StorageStore();
		expect(storage).toBeDefined();
	});

	it('starts with an empty state', () => {
		const storage = new StorageStore();

		expect(storage.state).toStrictEqual({});
	});

	describe('Storage Store using memory', () => {
		describe('set functionality', () => {
			it('does nothing when you pass undefined for both path and value', () => {
				const storage = new StorageStore();
				const path = undefined;
				const value = undefined;
				//  @ts-ignore
				storage.set(path, value);

				expect(storage.state).toStrictEqual({});
			});

			it('does nothing when you pass undefined for path', () => {
				const storage = new StorageStore();
				const path = undefined;
				const value = 'not undefined';
				//  @ts-ignore
				storage.set(path, value);

				expect(storage.state).toStrictEqual({});
			});

			it('stores undefined if you pass undefined for value', () => {
				const storage = new StorageStore();
				const path = 'undefined';
				const value = undefined;
				storage.set(path, value);

				expect(storage.state).toStrictEqual({
					undefined: undefined,
				});
			});

			it('does something when you pass an empty path', () => {
				const storage = new StorageStore();
				const path = '';
				const value = 'hello world';
				storage.set(path, value);

				expect(storage.state).toStrictEqual({
					'': value,
				});
			});

			it('can store an object', () => {
				const storage = new StorageStore();

				const key = 'storageKey';
				const dataValue = 'some weird stuff';
				const value = {
					level1: {
						level2: {
							level3: dataValue,
						},
					},
				};

				storage.set(key, value);

				const storedStuff = {
					[key]: {
						level1: {
							level2: {
								level3: dataValue,
							},
						},
					},
				};

				expect(storage.state).toStrictEqual(storedStuff);
			});

			it('can set a state using a path', () => {
				const storage = new StorageStore();

				const path = 'storageKey.pathKey';
				const value = 'storageValue';
				storage.set(path, value);

				const storedStuff = {
					storageKey: {
						pathKey: value,
					},
				};

				expect(storage.state).toStrictEqual(storedStuff);
			});

			it('can set a state using a deep path', () => {
				const storage = new StorageStore();

				const path = 'storageKey.level1.level2.level3';
				const value = 'storageValue';
				storage.set(path, value);

				const storedStuff = {
					storageKey: {
						level1: {
							level2: {
								level3: value,
							},
						},
					},
				};

				expect(storage.state).toStrictEqual(storedStuff);
			});

			it('can set storage on existing paths', () => {
				const storage = new StorageStore();

				const path = 'storageKey.level1.level2.level3';
				const value = 'storage at level 3';
				storage.set(path, value);

				const storedStuff = {
					storageKey: {
						level1: {
							level2: {
								level3: value,
							},
						},
					},
				};

				expect(storage.state).toStrictEqual(storedStuff);

				const secondPath = 'storageKey.level1.level2.level2property';
				const secondValue = 'storage at level 2';
				storage.set(secondPath, secondValue);

				const storedStuffAgain = {
					storageKey: {
						level1: {
							level2: {
								level3: value,
								level2property: secondValue,
							},
						},
					},
				};

				expect(storage.state).toStrictEqual(storedStuffAgain);
			});
		});

		describe('get functionality', () => {
			it('can get a state', () => {
				const storage = new StorageStore();
				const path = 'path';
				const value = 'value';
				storage.set(path, value);
				expect(storage.get(path)).toStrictEqual(value);
			});

			it('can get a deeply set state', () => {
				const storage = new StorageStore();
				const path = 'storageKey.level1.level2.level3';
				const value = 'value';
				storage.set(path, value);
				expect(storage.get(path)).toStrictEqual(value);
				expect(storage.get('storageKey')).toStrictEqual({
					level1: {
						level2: {
							level3: value,
						},
					},
				});
			});

			it('returns undefined when specifying an undefined path', () => {
				const storage = new StorageStore();
				const path = 'storageKey.level1.level2.level3';
				const value = 'value';
				storage.set(path, value);
				expect(storage.get(path)).toStrictEqual(value);

				expect(storage.get('storageKey.level1.dne')).toBeUndefined();
			});
		});

		describe('clear functionality', () => {
			it('state has been cleared', () => {
				const storage = new StorageStore();
				const path = 'path';
				const value = 'value';
				storage.set(path, value);
				expect(storage.get(path)).toStrictEqual(value);
				storage.clear();
				expect(storage.state).toStrictEqual({});
				expect(storage.get(path)).toBeUndefined();
			});
		});
	});

	describe('Storage Store sets custom config', () => {
		const config = {
			type: StorageType.session,
			cookie: {
				expiration: 100000,
				sameSite: 'sameSite',
			},
			key: 'ss-custom-key',
		};
		it('contains custom config', () => {
			const storage = new StorageStore(config);
			// @ts-ignore - private property
			expect(storage.type).toBe(config.type);
			// @ts-ignore - private property
			expect(storage.expiration).toBe(config.cookie.expiration);
			// @ts-ignore - private property
			expect(storage.sameSite).toBe(config.cookie.sameSite);
			// @ts-ignore - private property
			expect(storage.key).toBe(config.key);
		});
	});

	[StorageType.session, StorageType.local, StorageType.cookie].forEach((storageType) => {
		describe(`Storage Store using ${storageType} storage`, () => {
			describe('set functionality', () => {
				it('does nothing when you pass undefined for both path and value', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					const path = undefined;
					const value = undefined;
					//  @ts-ignore
					storage.set(path, value);

					expect(storage.state).toStrictEqual({});
					//  @ts-ignore
					expect(storage.get(path)).toBeUndefined();
					storage.clear();
				});

				it('does nothing when you pass undefined for path', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					const path = undefined;
					const value = 'not undefined';
					//  @ts-ignore
					storage.set(path, value);

					expect(storage.state).toStrictEqual({});
					//  @ts-ignore
					expect(storage.get(path)).toBeUndefined();
					storage.clear();
				});

				it('stores undefined if you pass undefined for value', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					const path = 'undefined';
					const value = undefined;
					storage.set(path, value);

					expect(storage.state).toStrictEqual({
						undefined: undefined,
					});
					expect(storage.get(path)).toStrictEqual(value);
					storage.clear();
				});

				it('does something when you pass an empty path', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					const path = '';
					const value = 'hello world';
					storage.set(path, value);

					expect(storage.state).toStrictEqual({
						'': value,
					});
					expect(storage.get(path)).toStrictEqual(value);
					storage.clear();
				});

				it('can store an object', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });

					const key = 'storageKey';
					const dataValue = 'some weird stuff';
					const value = {
						level1: {
							level2: {
								level3: dataValue,
							},
						},
					};

					storage.set(key, value);

					const storedStuff = {
						[key]: {
							level1: {
								level2: {
									level3: dataValue,
								},
							},
						},
					};

					expect(storage.state).toStrictEqual(storedStuff);
					expect(storage.get(key)).toStrictEqual(value);
					storage.clear();
				});

				it('can set a state using a path', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });

					const path = 'storageKey.pathKey';
					const value = 'storageValue';
					storage.set(path, value);

					const storedStuff = {
						storageKey: {
							pathKey: value,
						},
					};

					expect(storage.state).toStrictEqual(storedStuff);
					expect(storage.get(path)).toStrictEqual(value);
					storage.clear();
				});

				it('can set a state using a deep path', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });

					const path = 'storageKey.level1.level2.level3';
					const value = 'storageValue';
					storage.set(path, value);

					const storedStuff = {
						storageKey: {
							level1: {
								level2: {
									level3: value,
								},
							},
						},
					};

					expect(storage.state).toStrictEqual(storedStuff);
					expect(storage.get(path)).toStrictEqual(value);
					storage.clear();
				});

				it('can set storage on existing paths', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });

					const path = 'storageKey.level1.level2.level3';
					const value = 'storage at level 3';
					storage.set(path, value);

					const storedStuff = {
						storageKey: {
							level1: {
								level2: {
									level3: value,
								},
							},
						},
					};

					expect(storage.state).toStrictEqual(storedStuff);
					expect(storage.get(path)).toStrictEqual(value);

					const secondPath = 'storageKey.level1.level2.level2property';
					const secondValue = 'storage at level 2';
					storage.set(secondPath, secondValue);

					const storedStuffAgain = {
						storageKey: {
							level1: {
								level2: {
									level3: value,
									level2property: secondValue,
								},
							},
						},
					};

					expect(storage.state).toStrictEqual(storedStuffAgain);
					expect(storage.get(secondPath)).toStrictEqual(secondValue);
					storage.clear();
				});

				const itif = (condition: boolean) => (condition ? it : it.skip);
				itif(storageType !== StorageType.cookie)('can fail gracefully if storage is full', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });

					const consoleSpy = jest.spyOn(console, 'warn');
					const maxStorage = 5 * 1000 * 1000; // typically 5MB
					const almostFiveMB = 'a'.repeat(maxStorage - 100);

					storage.set('path1', almostFiveMB);
					expect(storage.get('path1')).toBe(almostFiveMB);
					expect(consoleSpy).not.toHaveBeenCalled();

					const data = 'a'.repeat(100); // 100 bytes of data
					storage.set('path2', data);
					expect(storage.get('path2')).toBe(undefined);
					expect(consoleSpy).toHaveBeenCalledTimes(1);

					consoleSpy.mockClear();

					const smallData = 'a'.repeat(10); // 10 bytes of data
					storage.set('path3', smallData);
					expect(storage.get('path3')).toBe(smallData);
					expect(consoleSpy).not.toHaveBeenCalled();

					consoleSpy.mockRestore();
				});
			});

			describe('get functionality', () => {
				it('can get a state', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					const path = 'path';
					const value = 'value';
					storage.set(path, value);
					expect(storage.get(path)).toStrictEqual(value);
					storage.clear();
				});

				it('can get a deeply set state', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					const path = 'storageKey.level1.level2.level3';
					const value = 'value';
					storage.set(path, value);
					expect(storage.get(path)).toStrictEqual(value);
					expect(storage.get('storageKey')).toStrictEqual({
						level1: {
							level2: {
								level3: value,
							},
						},
					});
					storage.clear();
				});

				it('returns undefined when specifying an undefined path', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					const path = 'storageKey.level1.level2.level3';
					const value = 'value';
					storage.set(path, value);
					expect(storage.get(path)).toStrictEqual(value);

					expect(storage.get('storageKey.level1.dne')).toBeUndefined();
					storage.clear();
				});
			});

			describe(`${storageType}Storage clear functionality`, () => {
				it('state has been cleared', () => {
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					const path = 'path';
					const value = 'value';
					storage.set(path, value);
					expect(storage.state).toStrictEqual({ path: value });
					expect(storage.get(path)).toStrictEqual(value);
					storage.clear();
					expect(storage.state).toStrictEqual({});
					expect(storage.get(path)).toBeUndefined();
					storage.clear();
				});
			});

			describe(`${storageType}Storage persisting data functionality`, () => {
				it('sets a state and that state is set on next instantiation', () => {
					const path = 'path';
					const value = 'value';
					const storage = new StorageStore({ type: storageType, key: 'ss-key' });
					storage.set(path, value);
					expect(storage.get(path)).toStrictEqual(value);
					expect(storage.state).toStrictEqual({ [path]: value });

					const newStorage = new StorageStore({ type: storageType, key: 'ss-key' });
					expect(newStorage.state).toStrictEqual({ [path]: value });
				});
			});
		});
	});
});
