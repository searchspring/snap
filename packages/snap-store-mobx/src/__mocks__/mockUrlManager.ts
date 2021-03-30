export const mockUrlManager = {
	lastUrl: '',
	localState: {},
	mergedState: {},
	omissions: [],
	prevState: {},
	translator: {
		config: {
			queryParameter: 'q',
		},
	},
	urlState: {},
	watcherPool: {
		callbacks: [null],
	},
	set: function () {
		return mockUrlManager;
	},
	remove: function () {
		return mockUrlManager;
	},
	merge: function () {
		return mockUrlManager;
	},
	go: function () {
		return mockUrlManager;
	},
	detach: function () {
		return mockUrlManager;
	},
};
