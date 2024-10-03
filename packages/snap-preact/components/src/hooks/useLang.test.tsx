import { h } from 'preact';
import { useLang, LangObjType } from './useLang';

describe('useLang hook', () => {
	it('the hook returns empty', () => {
		const lang = {};
		const data = useLang(lang);
		expect(data).toEqual({});
	});

	it('the hook returns expected data', () => {
		const val = 'stringy';
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				value: val,
				attributes: {
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
				},
			},
		};
		const data = useLang(lang);
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: val,
					},
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: val,
					},
					'ss-lang': name,
				},
				attributes: {
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
					'ss-lang': name,
				},
			},
		});
	});

	it('the hook can handle multiple lang objs', () => {
		const val = 'stringy';
		const val2 = 'stringy2';
		const val3 = 'stringy3';

		const name = 'thing';
		const name2 = 'thing2';
		const name3 = 'thing3';

		const lang: LangObjType = {
			[name]: {
				value: val,
				attributes: {
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
				},
			},
			[name2]: {
				value: val2,
				attributes: {
					'aria-label': val2,
					alt: val2,
					'aria-valuetext': val2,
					title: val2,
				},
			},
			[name3]: {
				value: val3,
				attributes: {
					'aria-label': val3,
					alt: val3,
					'aria-valuetext': val3,
					title: val3,
				},
			},
		};
		const data = useLang(lang);
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: val,
					},
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: val,
					},
					'ss-lang': name,
				},
				attributes: {
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
					'ss-lang': name,
				},
			},
			[name2]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: val2,
					},
					'aria-label': val2,
					alt: val2,
					'aria-valuetext': val2,
					title: val2,
					'ss-lang': name2,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: val2,
					},
					'ss-lang': name2,
				},
				attributes: {
					'aria-label': val2,
					alt: val2,
					'aria-valuetext': val2,
					title: val2,
					'ss-lang': name2,
				},
			},
			[name3]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: val3,
					},
					'aria-label': val3,
					alt: val3,
					'aria-valuetext': val3,
					title: val3,
					'ss-lang': name3,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: val3,
					},
					'ss-lang': name3,
				},
				attributes: {
					'aria-label': val3,
					alt: val3,
					'aria-valuetext': val3,
					title: val3,
					'ss-lang': name3,
				},
			},
		});
	});

	it('the hook can handle functions', () => {
		const val = 'stringy';
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				value: () => val,
				attributes: {
					'aria-label': () => val,
					alt: val,
					'aria-valuetext': () => val,
					title: () => val,
				},
			},
		};
		const data = useLang(lang);
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: val,
					},
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: val,
					},
					'ss-lang': name,
				},
				attributes: {
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
					'ss-lang': name,
				},
			},
		});
	});

	it('the hook can pass data to use in values', () => {
		const val = 'stringy';
		const dataVal = 'stuff';
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				value: (data) => `${val} + ${data.my_data}`,
				attributes: {
					'aria-label': (data) => `${val} + ${data.my_data}`,
					alt: (data) => `${val} + ${data.my_data}`,
					'aria-valuetext': (data) => `${val} + ${data.my_data}`,
					title: (data) => `${val} + ${data.my_data}`,
				},
			},
		};
		const data = useLang(lang, { my_data: dataVal });
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: `${val} + ${dataVal}`,
					},
					'aria-label': `${val} + ${dataVal}`,
					alt: `${val} + ${dataVal}`,
					'aria-valuetext': `${val} + ${dataVal}`,
					title: `${val} + ${dataVal}`,
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: `${val} + ${dataVal}`,
					},
					'ss-lang': name,
				},
				attributes: {
					'aria-label': `${val} + ${dataVal}`,
					alt: `${val} + ${dataVal}`,
					'aria-valuetext': `${val} + ${dataVal}`,
					title: `${val} + ${dataVal}`,
					'ss-lang': name,
				},
			},
		});
	});

	it('the hook can return only values', () => {
		const val = 'stringy';
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				value: () => val,
			},
		};
		const data = useLang(lang);
		expect(Object.keys(data[name])).not.toContain('attributes');
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: val,
					},
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: val,
					},
					'ss-lang': name,
				},
			},
		});
	});

	it('the hook can return only attributes', () => {
		const val = 'stringy';
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				attributes: {
					'aria-label': () => val,
					alt: val,
					'aria-valuetext': () => val,
					title: () => val,
				},
			},
		};
		const data = useLang(lang);
		expect(Object.keys(data[name])).not.toContain('value');
		expect(data).toEqual({
			[name]: {
				all: {
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
					'ss-lang': name,
				},
				attributes: {
					'aria-label': val,
					alt: val,
					'aria-valuetext': val,
					title: val,
					'ss-lang': name,
				},
			},
		});
	});
});
