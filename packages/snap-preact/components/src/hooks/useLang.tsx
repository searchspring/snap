export type LangAttributesObj = {
	[textId: string]: LangAttributesObjAttributes;
};

type ValType = {
	'ss-lang': string;
	dangerouslySetInnerHTML: { __html: string };
};

type AttType = {
	'ss-lang': string;
	'aria-label'?: string;
	'aria-valuetext'?: string;
	title?: string;
	alt?: string;
};
export type LangAttributesObjAttributes = {
	value?: ValType;
	attributes?: AttType;
	all?: Partial<ValType> & Partial<AttType> & { 'ss-lang': string };
};

export type LangType<P> = string | ((data: P) => string);

export interface LangObjType {
	[name: string]: Lang<any>;
}

//make all the types uppercase
export interface Lang<T> extends Partial<LangValue<T>>, Partial<LangAttributes<T>> {}

// TODO Future improvement to typing for translation definitions to require certain portions
/*
	type ExtLang<T, Required = {}> = Partial<LangValue<T>> & Partial<LangAttributes<T>> & Required;
	thing?: ExtLang<{controller: RecommendationController}, {
		value: LangType<{controller: RecommendationController}>,
		attributes: {		
			'aria-label': LangType<{controller: RecommendationController}>
		}
	}>
*/

export interface LangValue<T> {
	value: LangType<T>;
}

export interface LangAttributes<T> {
	attributes: {
		'aria-label'?: LangType<T>;
		'aria-valuetext'?: LangType<T>;
		title?: LangType<T>;
		alt?: LangType<T>;
	};
}

export const useLang = (lang: LangObjType, data?: any): LangAttributesObj => {
	const returnObj: LangAttributesObj = {};

	Object.keys(lang).forEach((key: string) => {
		const currentLangSettings = lang && lang[key as keyof typeof lang];

		const currentObj: LangAttributesObjAttributes = {};

		if (currentLangSettings) {
			if (currentLangSettings?.value) {
				if (typeof currentLangSettings.value == 'function') {
					currentObj.value = {
						'ss-lang': key,
						dangerouslySetInnerHTML: { __html: currentLangSettings.value(data) },
					};
				} else {
					currentObj.value = {
						'ss-lang': key,
						dangerouslySetInnerHTML: { __html: currentLangSettings.value },
					};
				}
			}

			if (currentLangSettings?.attributes && Object.keys(currentLangSettings?.attributes).length) {
				currentObj.attributes = {
					'ss-lang': key,
				};
				if (currentLangSettings?.attributes?.['aria-label']) {
					if (typeof currentLangSettings.attributes?.['aria-label'] == 'function') {
						currentObj.attributes!['aria-label'] = currentLangSettings.attributes['aria-label'](data);
					} else {
						currentObj.attributes!['aria-label'] = currentLangSettings.attributes['aria-label'];
					}
				}
				if (currentLangSettings?.attributes?.['aria-valuetext']) {
					if (typeof currentLangSettings.attributes?.['aria-valuetext'] == 'function') {
						currentObj.attributes!['aria-valuetext'] = currentLangSettings.attributes['aria-valuetext'](data);
					} else {
						currentObj.attributes!['aria-valuetext'] = currentLangSettings.attributes['aria-valuetext'];
					}
				}
				if (currentLangSettings?.attributes?.title) {
					if (typeof currentLangSettings.attributes?.title == 'function') {
						currentObj.attributes!['title'] = currentLangSettings.attributes['title'](data);
					} else {
						currentObj.attributes!['title'] = currentLangSettings.attributes['title'];
					}
				}
				if (currentLangSettings?.attributes?.alt) {
					if (typeof currentLangSettings.attributes?.alt == 'function') {
						currentObj.attributes!['alt'] = currentLangSettings.attributes['alt'](data);
					} else {
						currentObj.attributes!['alt'] = currentLangSettings.attributes['alt'];
					}
				}
			}

			currentObj.all = {
				...currentObj.value,
				...currentObj.attributes,
				'ss-lang': key,
			};
		}

		returnObj[key as keyof typeof returnObj] = currentObj;
	});

	return returnObj;
};
