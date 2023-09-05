/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme } from '../../../providers';
import { cloneWithProps, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { handleize } from '@searchspring/snap-toolbox/dist/cjs/filters/handleize';
import { SearchController } from '@searchspring/snap-controller';

const CSS = {
	noresults: () => css({}),
};

export const NoResults = observer((properties: NoResultsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<NoResultsProps> = {
		dymText: `Did you mean <a href=${properties.controller?.store?.search?.didYouMean?.url.href}>${properties.controller?.store?.search?.didYouMean?.string}</a>?`,
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
		dymText,
		suggestionsList,
		hideContact,
		contactsTitleText,
		contactsList,
		controller,
		disableStyles,
		className,
		style,
	} = props;

	const dym = controller?.store?.search?.didYouMean;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.noresults(), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<div className={classnames('ss__no-results', className)}>
			{staticSlot ? (
				<Fragment>{cloneWithProps(staticSlot, { controller })}</Fragment>
			) : (
				<Fragment>
					{dym && <p className="ss__no-results__did-you-mean" dangerouslySetInnerHTML={{ __html: dymText! }}></p>}

					<div className="ss__no-results__content">
						{suggestionsList && (
							<>
								{suggestionsTitleText && <h4 className="ss__no-results__title">{suggestionsTitleText}</h4>}

								{suggestionsList && suggestionsList.length !== 0 ? (
									<ul className="ss__no-results__suggestion-list">
										{suggestionsList.map((suggestion: any) => (
											<li className="ss__no-results__suggestion-list__option">{suggestion}</li>
										))}
									</ul>
								) : null}
							</>
						)}
					</div>

					{!hideContact && contactsList && contactsList.length !== 0 && (
						<div className="ss__no-results__contact">
							{contactsTitleText && <p className="ss__no-results__contact__title">{contactsTitleText}</p>}

							{contactsList.map((contact: any) => (
								<div className={`ss__no-results__contact__detail ss__contact__detail--${handleize(contact.title)}`}>
									<h4 className="ss__no-results__contact__detail__title">{contact.title}</h4>

									<p dangerouslySetInnerHTML={{ __html: contact.content }}></p>
								</div>
							))}
						</div>
					)}
				</Fragment>
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
	dymText?: string;
	suggestionsTitleText?: string;
	suggestionsList?: string[];
	hideContact?: boolean;
	contactsTitleText?: string;
	contactsList?: contact[];
	controller?: SearchController;
}
