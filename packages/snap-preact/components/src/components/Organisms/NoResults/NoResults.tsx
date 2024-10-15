import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, useSnap } from '../../../providers';
import { cloneWithProps, mergeProps } from '../../../utilities';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { filters } from '@searchspring/snap-toolbox';
import { useComponent } from '../../../hooks/useComponent';
import { useCreateController } from '../../../hooks/useCreateController';
import type { RecommendationController, RecommendationControllerConfig } from '@searchspring/snap-controller';
import type { RecommendationGridProps, RecommendationProps, ResultComponent } from '../../../';
import type { FunctionalComponent } from 'preact';
import type { SnapTemplates } from '../../../../../src';
import type { SearchController } from '@searchspring/snap-controller';
import deepmerge from 'deepmerge';
import { useLang } from '../../../hooks';
import type { Lang } from '../../../hooks';
import type { LibraryImports } from '../../../../../src/Templates/Stores/LibraryStore';

const CSS = {
	noResults: () => css({}),
};

export const NoResults = observer((properties: NoResultsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<NoResultsProps> = {
		suggestionsTitleText: `Suggestions`,
		suggestionsList: [
			`Check for misspellings.`,
			`Remove possible redundant keywords (ie. "products").`,
			`Use other words to describe what you are searching for.`,
		],
	};

	const props = mergeProps('noResults', globalTheme, defaultProps, properties);

	const {
		contentSlot,
		suggestionsTitleText,
		hideSuggestionsTitleText,
		hideContactsTitleText,
		suggestionsList,
		hideContact,
		contactsTitleText,
		hideSuggestions,
		contactsList,
		controller,
		templates,
		disableStyles,
		className,
		style,
		styleScript,
		treePath,
	} = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.noResults(), style];
	} else if (style) {
		styling.css = [style];
	}

	const suggestionsExist = suggestionsList && Array.isArray(suggestionsList) && suggestionsList.length !== 0;
	const contactsExist = contactsList && Array.isArray(contactsList) && contactsList.length !== 0;

	let recommendationTemplateComponent: FunctionalComponent<{ controller: RecommendationController; name: string }> | undefined;
	let recommendationTemplateResultComponent: ResultComponent | undefined;
	let recsController: RecommendationController | undefined;

	if (templates?.recommendation?.enabled) {
		const componentName = templates?.recommendation?.component || 'Recommendation';
		const snap = useSnap() as SnapTemplates;

		if (snap?.templates) {
			const themeName = properties.theme?.name;
			let defaultResultComponentFromTheme;
			if (themeName) {
				defaultResultComponentFromTheme = snap?.templates?.config.themes[themeName]?.resultComponent;
			}

			const resultComponentName = (templates?.recommendation?.resultComponent || defaultResultComponentFromTheme) as string;
			const mergedConfig = Object.assign(
				{
					id: '',
					tag: 'no-results',
					branch: 'production',
				},
				templates.recommendation!.config
			);
			mergedConfig.id = mergedConfig.id || `search-${mergedConfig.tag}`;

			recsController = useCreateController<RecommendationController>(snap, 'recommendation', mergedConfig);
			if (!recsController?.store?.loaded && !recsController?.store?.loading && recsController?.store.error?.type !== 'error') {
				recsController?.search();
			}

			if (resultComponentName && snap?.templates?.library.import.component.result) {
				recommendationTemplateResultComponent = useComponent(snap?.templates?.library.import.component.result, resultComponentName);
			}

			if (componentName && snap?.templates?.library.import.component.recommendation.default) {
				recommendationTemplateComponent = useComponent(snap?.templates?.library.import.component.recommendation.default, componentName);
			}
		}
	}

	const RecommendationTemplateComponent = recommendationTemplateComponent as
		| FunctionalComponent<RecommendationProps | RecommendationGridProps>
		| undefined;

	const RecommendationTemplateResultComponent = recommendationTemplateResultComponent as ResultComponent | undefined;

	//deep merge with props.lang
	const defaultLang: Partial<NoResultsLang> = {
		suggestionsTitleText: {
			value: suggestionsTitleText,
		},
		suggestionsList: {
			value: `${
				suggestionsList
					? suggestionsList.map((suggestion: any) => `<li class="ss__no-results__suggestions__list__option">${suggestion}</li>`).join('')
					: undefined
			}
			`,
		},
		contactsTitleText: {
			value: contactsTitleText,
		},
		contactsList: {
			value: `${
				contactsList
					? contactsList
							.map(
								(contact: NoResultsContact) =>
									`<div class='ss__no-results__contact__detail ss__no-results__contact__detail--${filters.handleize(
										contact.title
									)}'><h4 class="ss__no-results__contact__detail__title">${contact.title}</h4><p class="ss__no-results__contact__detail__content">${
										contact.content
									}</p></div>`
							)
							.join('')
					: undefined
			}`,
		},
	};

	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		controller: controller,
	});

	return (
		<div className={classnames('ss__no-results', className)} {...styling}>
			{contentSlot &&
				(typeof contentSlot == 'string' ? (
					<div className="ss__no-results__slot" dangerouslySetInnerHTML={{ __html: contentSlot }}></div>
				) : (
					<div className="ss__no-results__slot">{cloneWithProps(contentSlot, { controller, treePath })}</div>
				))}

			{!hideSuggestions && (suggestionsTitleText || suggestionsExist) && (
				<div className="ss__no-results__suggestions">
					{suggestionsTitleText && !hideSuggestionsTitleText && (
						<h3 className="ss__no-results__suggestions__title" {...mergedLang.suggestionsTitleText?.all}></h3>
					)}

					{suggestionsExist && <ul className="ss__no-results__suggestions__list" {...mergedLang.suggestionsList?.all}></ul>}
				</div>
			)}

			{!hideContact && (contactsTitleText || contactsExist) && (
				<div className="ss__no-results__contact">
					{contactsTitleText && !hideContactsTitleText && <h3 className="ss__no-results__contact__title" {...mergedLang.contactsTitleText?.all}></h3>}

					{contactsExist && <div {...mergedLang.contactsList?.all}></div>}
				</div>
			)}

			{RecommendationTemplateComponent && recsController?.store?.loaded ? (
				<div className="ss__no-results__recommendations">
					<RecommendationTemplateComponent
						controller={recsController}
						title={recsController.store?.profile?.display?.templateParameters?.title}
						resultComponent={RecommendationTemplateResultComponent}
						name={'noResultsRecommendations'}
					/>
				</div>
			) : null}
		</div>
	);
});

type NoResultsContact = {
	title: string;
	content: string;
};

export interface NoResultsProps extends ComponentProps {
	contentSlot?: string | JSX.Element;
	suggestionsTitleText?: string;
	hideSuggestionsTitleText?: boolean;
	suggestionsList?: string[];
	hideContact?: boolean;
	hideSuggestions?: boolean;
	contactsTitleText?: string;
	hideContactsTitleText?: boolean;
	contactsList?: NoResultsContact[];
	lang?: NoResultsLang;
	templates?: {
		recommendation?: {
			enabled: boolean;
			component?: keyof LibraryImports['component']['recommendation']['default'];
			resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
			config?: Partial<RecommendationControllerConfig>;
		};
	};
}

export interface NoResultsLang {
	suggestionsTitleText: Lang<{ controller: SearchController }>;
	suggestionsList: Lang<{ controller: SearchController }>;
	contactsTitleText?: Lang<{ controller: SearchController }>;
	contactsList?: Lang<{ controller: SearchController }>;
}
