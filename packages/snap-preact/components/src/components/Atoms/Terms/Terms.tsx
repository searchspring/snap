import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { AutocompleteController } from '@searchspring/snap-controller';
import type { AutocompleteTermStore } from '@searchspring/snap-store-mobx';
import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { createHoverProps } from '../../../toolbox';
import { mergeProps } from '../../../utilities';
import { Term } from '@searchspring/snap-store-mobx';
import { useLang } from '../../../hooks';
import type { lang } from '../../../hooks';
import deepmerge from 'deepmerge';

const CSS = {
	Terms: ({}: Partial<TermsProps>) => css({}),
};

export const Terms = observer((properties: TermsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<TermsProps> = {};

	const props = mergeProps('terms', globalTheme, defaultProps, properties);
	const { title, onTermClick, limit, previewOnHover, emIfy, disableStyles, style, className, controller, styleScript } = props;
	const currentInput = controller?.store?.state?.input;
	const terms = props.terms || controller?.store.terms;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.Terms(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const emIfyTerm = (term: string, search: string): string => {
		if (term && search) {
			const match = term.match(escapeRegExp(search));
			if (search && term && match && typeof match.index == 'number') {
				const beforeMatch = term.slice(0, match.index);
				const afterMatch = term.slice(match.index + search.length, term.length);
				// return (
				// 	<>
				// 		{beforeMatch ? <em>{beforeMatch}</em> : ''}
				// 		{search}
				// 		{afterMatch ? <em>{afterMatch}</em> : ''}
				// 	</>
				// );
				return `${beforeMatch ? `<em>${beforeMatch}</em>` : ''}${search}${afterMatch ? `<em>${afterMatch}</em>` : ''}`;
			}
		}

		// return (
		// 	<Fragment>
		// 		<em>{term}</em>
		// 	</Fragment>
		// );
		return `<em>${term}</em>`;
	};

	const termClickEvent = (e: React.MouseEvent<Element, MouseEvent>, term: Term) => {
		onTermClick && onTermClick(e, term);

		// remove focus from input (close the autocomplete)
		controller?.setFocused && controller?.setFocused();
	};

	const escapeRegExp = (string: string): string => {
		return string?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	const termsToShow = limit ? terms?.slice(0, limit) : terms;

	return termsToShow?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__terms', className)}>
				{title ? (
					<div className="ss__terms__title">
						<h5>{title}</h5>
					</div>
				) : null}
				<div className="ss__terms__options" role={'list'} aria-label={title}>
					{termsToShow?.map((term, idx) => {
						//initialize lang
						const defaultLang = {
							term: {
								value: `${emIfy ? emIfyTerm(term.value, currentInput || '') : term.value}`,
								attributes: {
									'aria-label': `item ${idx + 1} of ${termsToShow.length}, ${term.value}`,
								},
							},
						};

						//deep merge with props.lang
						const lang = deepmerge(defaultLang, props.lang || {});

						const mergedLang = useLang(lang as any, {
							idx: idx,
							numberOfTerms: termsToShow.length,
							term: term,
						});

						return (
							<div
								className={classnames('ss__terms__option', {
									'ss__terms__option--active': term.active,
								})}
							>
								<a
									onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => termClickEvent(e, term)}
									href={term.url.href}
									{...(previewOnHover ? createHoverProps(term.preview) : {})}
									role="link"
									{...mergedLang.term}
								></a>
							</div>
						);
					})}
				</div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface TermsProps extends ComponentProps {
	controller?: AutocompleteController;
	terms?: AutocompleteTermStore;
	title?: string;
	limit?: number;
	onTermClick?: (e: React.MouseEvent<Element, MouseEvent>, term: Term) => void;
	previewOnHover?: boolean;
	emIfy?: boolean;
	lang?: Partial<TermsLang>;
}

export interface TermsLang {
	term: lang<{
		idx: number;
		numberOfTerms: number;
		term: Term;
	}>;
}
