import { h } from 'preact';
import { useLang, LangObjType } from './useLang';

describe('useLang hook', () => {
	it('the hook returns empty', () => {
		const lang = {};
		const data = useLang(lang);
		expect(data).toEqual({});
	});

	it('the hook returns expected data', () => {
		const vals = {
			value: 'stringy',
			label: 'label',
			valueText: 'valueText',
			title: 'title',
			alt: 'alty',
		};
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				value: vals.value,
				attributes: {
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
				},
			},
		};
		const data = useLang(lang);
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: vals.value,
					},
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: vals.value,
					},
					'ss-lang': name,
				},
				attributes: {
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
					'ss-lang': name,
				},
			},
		});
	});

	it('the hook can handle multiple lang objs', () => {
		const vals = {
			value: 'stringy',
			label: 'label',
			valueText: 'valueText',
			title: 'title',
			alt: 'alty',
		};

		const vals2 = {
			value: 'stringy2',
			label: 'label2',
			valueText: 'valueText2',
			title: 'title2',
			alt: 'alty2',
		};

		const vals3 = {
			value: 'stringy3',
			label: 'label3',
			valueText: 'valueText3',
			title: 'title3',
			alt: 'alty3',
		};

		const name = 'thing';
		const name2 = 'thing2';
		const name3 = 'thing3';

		const lang: LangObjType = {
			[name]: {
				value: vals.value,
				attributes: {
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
				},
			},
			[name2]: {
				value: vals2.value,
				attributes: {
					'aria-label': vals2.label,
					alt: vals2.alt,
					'aria-valuetext': vals2.valueText,
					title: vals2.title,
				},
			},
			[name3]: {
				value: vals3.value,
				attributes: {
					'aria-label': vals3.label,
					alt: vals3.alt,
					'aria-valuetext': vals3.valueText,
					title: vals3.title,
				},
			},
		};
		const data = useLang(lang);
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: vals.value,
					},
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: vals.value,
					},
					'ss-lang': name,
				},
				attributes: {
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
					'ss-lang': name,
				},
			},
			[name2]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: vals2.value,
					},
					'aria-label': vals2.label,
					alt: vals2.alt,
					'aria-valuetext': vals2.valueText,
					title: vals2.title,
					'ss-lang': name2,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: vals2.value,
					},
					'ss-lang': name2,
				},
				attributes: {
					'aria-label': vals2.label,
					alt: vals2.alt,
					'aria-valuetext': vals2.valueText,
					title: vals2.title,
					'ss-lang': name2,
				},
			},
			[name3]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: vals3.value,
					},
					'aria-label': vals3.label,
					alt: vals3.alt,
					'aria-valuetext': vals3.valueText,
					title: vals3.title,
					'ss-lang': name3,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: vals3.value,
					},
					'ss-lang': name3,
				},
				attributes: {
					'aria-label': vals3.label,
					alt: vals3.alt,
					'aria-valuetext': vals3.valueText,
					title: vals3.title,
					'ss-lang': name3,
				},
			},
		});
	});

	it('the hook can handle functions', () => {
		const vals = {
			value: 'stringy',
			label: 'label',
			valueText: 'valueText',
			title: 'title',
			alt: 'alty',
		};
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				value: () => vals.value,
				attributes: {
					'aria-label': () => vals.label,
					alt: vals.alt,
					'aria-valuetext': () => vals.valueText,
					title: () => vals.title,
				},
			},
		};
		const data = useLang(lang);
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: vals.value,
					},
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: vals.value,
					},
					'ss-lang': name,
				},
				attributes: {
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
					'ss-lang': name,
				},
			},
		});
	});

	it('the hook can pass data to use in values', () => {
		const vals = {
			value: 'stringy',
			label: 'label',
			valueText: 'valueText',
			title: 'title',
			alt: 'alty',
		};
		const dataVal = 'stuff';
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				value: (data) => `${vals.value} + ${data.my_data}`,
				attributes: {
					'aria-label': (data) => `${vals.label} + ${data.my_data}`,
					alt: (data) => `${vals.alt} + ${data.my_data}`,
					'aria-valuetext': (data) => `${vals.valueText} + ${data.my_data}`,
					title: (data) => `${vals.title} + ${data.my_data}`,
				},
			},
		};
		const data = useLang(lang, { my_data: dataVal });
		expect(data).toEqual({
			[name]: {
				all: {
					dangerouslySetInnerHTML: {
						__html: `${vals.value} + ${dataVal}`,
					},
					'aria-label': `${vals.label} + ${dataVal}`,
					alt: `${vals.alt} + ${dataVal}`,
					'aria-valuetext': `${vals.valueText} + ${dataVal}`,
					title: `${vals.title} + ${dataVal}`,
					'ss-lang': name,
				},
				value: {
					dangerouslySetInnerHTML: {
						__html: `${vals.value} + ${dataVal}`,
					},
					'ss-lang': name,
				},
				attributes: {
					'aria-label': `${vals.label} + ${dataVal}`,
					alt: `${vals.alt} + ${dataVal}`,
					'aria-valuetext': `${vals.valueText} + ${dataVal}`,
					title: `${vals.title} + ${dataVal}`,
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
		const vals = {
			value: 'stringy',
			label: 'label',
			valueText: 'valueText',
			title: 'title',
			alt: 'alty',
		};
		const name = 'thing';
		const lang: LangObjType = {
			[name]: {
				attributes: {
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
				},
			},
		};
		const data = useLang(lang);
		expect(Object.keys(data[name])).not.toContain('value');
		expect(data).toEqual({
			[name]: {
				all: {
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
					'ss-lang': name,
				},
				attributes: {
					'aria-label': vals.label,
					alt: vals.alt,
					'aria-valuetext': vals.valueText,
					title: vals.title,
					'ss-lang': name,
				},
			},
		});
	});
});
