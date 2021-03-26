import { Profiler } from './Profiler';

describe('Profiler', () => {
	it('does not require a namespace in the constructor', () => {
		const profiler = new Profiler();

		expect(profiler.namespace).toBeUndefined();
		expect(profiler.profiles).toHaveLength(0);
	});

	it('takes a namespace in the constructor', () => {
		const namespace = 'spacey';
		const profiler = new Profiler(namespace);

		expect(profiler.namespace).toBe(namespace);
		expect(profiler.profiles).toHaveLength(0);
	});

	it('exposes a function to change the namespace', () => {
		const profiler = new Profiler();

		expect(profiler.namespace).toBeUndefined();

		const namespace = 'spacey';
		profiler.setNamespace(namespace);

		expect(profiler.namespace).toBe(namespace);
	});

	it('does not allow a change in the namespace once set', () => {
		const profiler = new Profiler();

		expect(profiler.namespace).toBeUndefined();

		const namespace = 'spacey';
		profiler.setNamespace(namespace);

		expect(profiler.namespace).toBe(namespace);

		const newNamespace = 'spacier';
		profiler.setNamespace(newNamespace);

		expect(profiler.namespace).toBe(namespace);
	});

	it('can create new profiles', () => {
		const namespace = 'spacey';
		const profiler = new Profiler(namespace);

		expect(profiler.profiles).toHaveLength(0);

		const type = 'new';
		const name = 'testProfile';
		const context = {};

		const profile = profiler.create({ type, name, context });
		expect(profiler.profiles).toHaveLength(1);

		expect(profile).toHaveProperty('namespace', namespace);
		expect(profile).toHaveProperty('type', type);
		expect(profile).toHaveProperty('name', name);
		expect(profile).toHaveProperty('context', context);
		expect(profile).toHaveProperty('status', 'pending');
		expect(profile).toHaveProperty('time', { date: undefined, begin: undefined, end: undefined, run: undefined });
	});

	it('can create many new profiles', () => {
		const namespace = 'spacey';
		const profiler = new Profiler(namespace);

		expect(profiler.profiles).toHaveLength(0);

		for (let i = 1; i <= 10; i++) {
			const profile = profiler.create({ type: `type${i}`, name: `name${i}`, context: { value: i } });

			expect(profile).toHaveProperty('namespace', namespace);
			expect(profile).toHaveProperty('type', `type${i}`);
			expect(profile).toHaveProperty('name', `name${i}`);
			expect(profile).toHaveProperty('context', { value: i });
			expect(profile).toHaveProperty('time', { date: undefined, begin: undefined, end: undefined, run: undefined });
		}

		expect(profiler.profiles).toHaveLength(10);
	});

	it('throws an error when creating a profile with no name', () => {
		const namespace = 'spacey';
		const profiler = new Profiler(namespace);

		expect(profiler.profiles).toHaveLength(0);

		const type = 'new';
		const name = '';
		const context = {};

		expect(() => {
			profiler.create({ type, name, context });
		}).toThrow();
	});

	it('can start and stop timers of profile objects', () => {
		const namespace = 'spacey';
		const profiler = new Profiler(namespace);

		const type = 'new';
		const name = 'testProfile';
		const context = {};

		const profile = profiler.create({ type, name, context });

		// testing start
		expect(profile).toHaveProperty('start');

		const dateBeforeStart = Date.now();
		const timeBeforeStart = window.performance.now();

		const returnedStartProfile = profile.start();

		const timeAfterStart = window.performance.now();
		const dateAfterStart = Date.now();

		expect(profile).toEqual(returnedStartProfile);

		expect(profile.time.begin).toBeGreaterThanOrEqual(timeBeforeStart);
		expect(profile.time.begin).toBeLessThanOrEqual(timeAfterStart);

		expect(profile.time.date).toBeGreaterThanOrEqual(dateBeforeStart);
		expect(profile.time.date).toBeLessThanOrEqual(dateAfterStart);

		// testing stop
		expect(profile).toHaveProperty('stop');

		const timeBeforeStop = window.performance.now();

		const returnedStopProfile = profile.stop();

		const timeAfterStop = window.performance.now();

		expect(profile).toEqual(returnedStopProfile);

		expect(profile.time.end).toBeGreaterThanOrEqual(timeBeforeStop);
		expect(profile.time.end).toBeLessThanOrEqual(timeAfterStop);

		// testing run time
		const runTime = +(profile.time.end - profile.time.begin).toFixed(3);
		expect(profile.time.run).toBe(runTime);
	});

	it('cannot re-start profile object timers', () => {
		const namespace = 'spacey';
		const profiler = new Profiler(namespace);

		const profile = profiler.create({ type: 'test', name: 'restart', context: {} });

		const startTime = profile.time.begin;

		const reStartTime = profile.time.begin;

		expect(startTime).toBe(reStartTime);
	});

	it('cannot re-stop profile object timers', () => {
		const namespace = 'spacey';
		const profiler = new Profiler(namespace);

		const profile = profiler.create({ type: 'test', name: 'restop', context: {} });

		profile.start();

		const stopTime = profile.time.begin;

		const reStopTime = profile.time.begin;

		expect(stopTime).toBe(reStopTime);
	});
});
