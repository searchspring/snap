/** @jsx jsx */
import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme } from '../../../providers';
import { cloneWithProps, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { handleize } from '@searchspring/snap-toolbox/dist/cjs/filters/handleize';

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
		disableStyles,
		className,
		style,
		styleScript,
	} = props;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.noResults(), style];
	} else if (style) {
		styling.css = [style];
	}

	const suggestionsExist = suggestionsList && Array.isArray(suggestionsList) && suggestionsList.length !== 0;
	const contactsExist = contactsList && Array.isArray(contactsList) && contactsList.length !== 0;

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
							<div className={`ss__no-results__contact__detail ss__no-results__contact__detail--${handleize(contact.title)}`}>
								<h4 className="ss__no-results__contact__detail__title" dangerouslySetInnerHTML={{ __html: contact.title }}></h4>

								<p className="ss__no-results__contact__detail__content" dangerouslySetInnerHTML={{ __html: contact.content }}></p>
							</div>
						))}
				</div>
			)}
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
}
