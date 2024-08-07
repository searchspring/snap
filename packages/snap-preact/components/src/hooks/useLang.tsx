export type LangAttributesObj = {
	[textId: string]: LangAttributes;
};

export type LangAttributes = {
	'ss-lang': string;
	dangerouslySetInnerHTML?: { __html: string };
	'aria-label'?: string;
	'aria-valuetext'?: string;
	title?: string;
	alt?: string;
};

export type LangType<P> = string | ((data?: P) => string);

export interface langObjType {
	[name: string]: lang<any>;
}

//make all the types uppercase
export interface lang<T> {
	value?: LangType<T>;
	attributes?: {
		'aria-label'?: LangType<T>;
		'aria-valuetext'?: LangType<T>;
		title?: LangType<T>;
		alt?: LangType<T>;
	};
}

export const useLang = (lang: langObjType, data?: any): LangAttributesObj => {
	const returnObj: LangAttributesObj = {};

	Object.keys(lang).forEach((key: string) => {
		const currentLangSettings = lang && lang[key as keyof typeof lang];

		const currentObj: LangAttributes = {
			'ss-lang': key,
		};

		if (currentLangSettings) {
			if (currentLangSettings?.value) {
				if (typeof currentLangSettings.value == 'function') {
					currentObj.dangerouslySetInnerHTML = { __html: currentLangSettings.value(data) };
				} else {
					currentObj.dangerouslySetInnerHTML = { __html: currentLangSettings.value };
				}
			}
			if (currentLangSettings?.attributes?.['aria-label']) {
				if (typeof currentLangSettings.attributes?.['aria-label'] == 'function') {
					currentObj['aria-label'] = currentLangSettings.attributes['aria-label']({ data });
				} else {
					currentObj['aria-label'] = currentLangSettings.attributes['aria-label'];
				}
			}
			if (currentLangSettings?.attributes?.['aria-valuetext']) {
				if (typeof currentLangSettings.attributes?.['aria-valuetext'] == 'function') {
					currentObj['aria-valuetext'] = currentLangSettings.attributes['aria-valuetext'](data);
				} else {
					currentObj['aria-valuetext'] = currentLangSettings.attributes['aria-valuetext'];
				}
			}
			if (currentLangSettings?.attributes?.title) {
				if (typeof currentLangSettings.attributes?.title == 'function') {
					currentObj['title'] = currentLangSettings.attributes['title'](data);
				} else {
					currentObj['title'] = currentLangSettings.attributes['title'];
				}
			}
			if (currentLangSettings?.attributes?.alt) {
				if (typeof currentLangSettings.attributes?.alt == 'function') {
					currentObj['alt'] = currentLangSettings.attributes['alt'](data);
				} else {
					currentObj['alt'] = currentLangSettings.attributes['alt'];
				}
			}
		}

		returnObj[key as keyof typeof returnObj] = currentObj;
	});

	return returnObj;
};
