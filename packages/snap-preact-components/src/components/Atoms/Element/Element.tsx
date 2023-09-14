/** @jsx jsx */
import { Fragment, h } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { mergeProps } from '../../../utilities';

const CSS = {
	Element: ({}: Partial<ElementProps>) => css({}),
};

export const Element = observer((properties: ElementProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<ElementProps> = {};

	const props = mergeProps('element', globalTheme, defaultProps, properties);

	const { type, content, attributes, disableStyles, className, style, styleScript } = props;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.Element(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const args = {
		...styling,
		...attributes,
		className: classnames('ss__element', className),
		children: content,
		onClick: undefined,
	};

	return type ? (
		<CacheProvider>
			{type == 'div' && <div {...args}></div>}

			{type == 'span' && <span {...args}></span>}

			{type == 'p' && <p {...args}></p>}

			{type == 'label' && <label {...args}></label>}
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface ElementProps extends ComponentProps {
	type: 'div' | 'span' | 'p' | 'label';
	content?: string;
	attributes?: {
		[name: string]: string | number | undefined;
		//no onclicks allowed
		onClick?: undefined;
	};
}
