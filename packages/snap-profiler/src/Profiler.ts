type ProfileDetails<T> = { type: string; name: string; context: T };

export class Profiler {
	public namespace: string;
	public profiles: Profile<any>[];

	constructor(namespace?: string) {
		this.namespace = namespace;
		this.profiles = [];
	}

	public setNamespace(namespace: string): void {
		if (!this.namespace) {
			this.namespace = namespace;
		}
	}

	public create<T>({ type, name, context }: ProfileDetails<T>): Profile<T> {
		if (!name) {
			throw new Error('Profile name is required.');
		}

		const profile = new Profile<T>(this.namespace, { type, name, context });
		this.profiles.push(profile);

		return profile;
	}
}

type ProfileTime = {
	date: number;
	begin: number;
	end: number;
	run: number;
};

class Profile<T> {
	public namespace: string;
	public type: string;
	public name: string;
	public context: T;
	public status = 'pending';
	public time: ProfileTime = {
		date: undefined,
		begin: undefined,
		end: undefined,
		run: undefined,
	};

	constructor(namespace: string, { type, name, context }: ProfileDetails<T>) {
		this.namespace = namespace;
		this.type = type;
		this.name = name;
		this.context = context;
	}

	public start(): Profile<T> {
		if (!this.time.begin) {
			this.time.date = Date.now();
			this.time.begin = window.performance.now();

			this.status = 'started';
		}

		return this;
	}

	public stop(): Profile<T> {
		if (!this.time.end) {
			this.time.date = Date.now();
			this.time.end = window.performance.now();
			this.time.run = +(this.time.end - this.time.begin).toFixed(3);

			this.status = 'finished';
		}

		return this;
	}
}
