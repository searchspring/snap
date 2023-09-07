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
	noresults: () => css({}),
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
		staticSlot,
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
	} = props;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.noresults(), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<div className={classnames('ss__no-results', className)}>
			{staticSlot &&
				(typeof staticSlot == 'string' ? (
					<div className="ss__no-results__static" dangerouslySetInnerHTML={{ __html: staticSlot }}></div>
				) : (
					<div className="ss__no-results__static">{cloneWithProps(staticSlot, { controller })}</div>
				))}

			{!hideSuggestions && suggestionsList && suggestionsList.length !== 0 && (
				<div className="ss__no-results__suggestions">
					{suggestionsTitleText && (
						<h4 className="ss__no-results__suggestions__title" dangerouslySetInnerHTML={{ __html: suggestionsTitleText }}></h4>
					)}

					<ul className="ss__no-results__suggestions__list">
						{suggestionsList.map((suggestion: any) => (
							<li className="ss__no-results__suggestions__list__option" dangerouslySetInnerHTML={{ __html: suggestion }}></li>
						))}
					</ul>
				</div>
			)}

			{!hideContact && contactsList && contactsList.length !== 0 && (
				<div className="ss__no-results__contact">
					{contactsTitleText && <p className="ss__no-results__contact__title" dangerouslySetInnerHTML={{ __html: contactsTitleText }}></p>}

					{contactsList.map((contact: any) => (
						<div className={`ss__no-results__contact__detail ss__contact__detail--${handleize(contact.title)}`}>
							<h4 className="ss__no-results__contact__detail__title" dangerouslySetInnerHTML={{ __html: contact.title }}></h4>

							<p className="ss__no-results__contact__detail__content" dangerouslySetInnerHTML={{ __html: contact.content }}></p>
						</div>
					))}
				</div>
			)}
		</div>
	);
});

interface contact {
	title: string;
	content: string;
}

export interface NoResultsProps extends ComponentProps {
	staticSlot?: any;
	suggestionsTitleText?: string;
	suggestionsList?: string[];
	hideContact?: boolean;
	hideSuggestions?: boolean;
	contactsTitleText?: string;
	contactsList?: contact[];
}
