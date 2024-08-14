import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, useSnap } from '../../../providers';
import { cloneWithProps, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { filters } from '@searchspring/snap-toolbox';
import { useComponent } from '../../../hooks/useComponent';
import { useCreateController } from '../../../hooks/useCreateController';
import type { RecommendationController, RecommendationControllerConfig } from '@searchspring/snap-controller';
import type { ResultComponent } from '../../../';
import type { FunctionalComponent } from 'preact';
import type { SnapTemplates } from '../../../../../src';

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
		contactsTitleText: `Still can't find what you're looking for? <a href="/contact-us">Contact us</a>.`,
		contactsList: [
			{
				title: `Address`,
				content: `123 Street Address<br />City, State, Zipcode`,
			},
			{
				title: `Hours`,
				content: `Monday - Saturday, 00:00am - 00:00pm<br />Sunday, 00:00am - 00:00pm`,
			},
			{
				title: `Phone`,
				content: `<a href="tel:1234567890">123-456-7890</a>`,
			},
			{
				title: `Email`,
				content: `<a href="mailto:email@site.com">email@site.com</a>`,
			},
		],
	};

	const props = mergeProps('noResults', globalTheme, defaultProps, properties);

	const {
		contentSlot,
		suggestionsTitleText,
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
	} = props;

	const styling: { css?: StylingCSS } = {};
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
		const resultComponentName = templates?.recommendation?.resultComponent;
		const snap = useSnap() as SnapTemplates;
		const mergedConfig = Object.assign(
			{
				id: '',
				tag: 'no-results',
				branch: 'production',
			},
			templates.recommendation!.config
		);
		mergedConfig.id = mergedConfig.id || `search-${mergedConfig.tag}`;
		if (snap) {
			recsController = useCreateController<RecommendationController>(snap, 'recommendation', mergedConfig);
			if (!recsController?.store?.loaded && !recsController?.store?.loading && recsController?.store.error?.type !== 'error') {
				recsController?.search();
			}

			if (resultComponentName && snap?.templates?.library.import.component.result) {
				recommendationTemplateResultComponent = useComponent(snap?.templates?.library.import.component.result, resultComponentName);
			}

			if (componentName && snap?.templates?.library.import.component['recommendation.default']) {
				recommendationTemplateComponent = useComponent(snap?.templates?.library.import.component['recommendation.default'], componentName);
			}
		}
	}

	const RecommendationTemplateComponent = recommendationTemplateComponent as
		| FunctionalComponent<{ controller: RecommendationController; resultComponent?: ResultComponent; name: string }>
		| undefined;

	const RecommendationTemplateResultComponent = recommendationTemplateResultComponent as ResultComponent | undefined;

	return (
		<div className={classnames('ss__no-results', className)} {...styling}>
			{contentSlot &&
				(typeof contentSlot == 'string' ? (
					<div className="ss__no-results__slot" dangerouslySetInnerHTML={{ __html: contentSlot }}></div>
				) : (
					<div className="ss__no-results__slot">{cloneWithProps(contentSlot, { controller })}</div>
				))}

			{!hideSuggestions && (suggestionsTitleText || suggestionsExist) && (
				<div className="ss__no-results__suggestions">
					{suggestionsTitleText && (
						<h4 className="ss__no-results__suggestions__title" dangerouslySetInnerHTML={{ __html: suggestionsTitleText }}></h4>
					)}

					{suggestionsExist && (
						<ul className="ss__no-results__suggestions__list">
							{suggestionsList.map((suggestion: any) => (
								<li className="ss__no-results__suggestions__list__option" dangerouslySetInnerHTML={{ __html: suggestion }}></li>
							))}
						</ul>
					)}
				</div>
			)}

			{!hideContact && (contactsTitleText || contactsExist) && (
				<div className="ss__no-results__contact">
					{contactsTitleText && <h4 className="ss__no-results__contact__title" dangerouslySetInnerHTML={{ __html: contactsTitleText }}></h4>}

					{contactsExist &&
						contactsList.map((contact: NoResultsContact) => (
							<div className={`ss__no-results__contact__detail ss__no-results__contact__detail--${filters.handleize(contact.title)}`}>
								<h4 className="ss__no-results__contact__detail__title" dangerouslySetInnerHTML={{ __html: contact.title }}></h4>

								<p className="ss__no-results__contact__detail__content" dangerouslySetInnerHTML={{ __html: contact.content }}></p>
							</div>
						))}
				</div>
			)}

			{RecommendationTemplateComponent && recsController?.store?.loaded ? (
				<div className="ss__no-results__recommendations">
					<RecommendationTemplateComponent
						controller={recsController}
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
	suggestionsList?: string[];
	hideContact?: boolean;
	hideSuggestions?: boolean;
	contactsTitleText?: string;
	contactsList?: NoResultsContact[];

	templates?: {
		recommendation?: {
			enabled: boolean;
			component?: 'Recommendation'; // Need a type for allowed recommendation component names (that would exist in the library)
			resultComponent?: string;
			config?: Partial<RecommendationControllerConfig>;
		};
	};
}
