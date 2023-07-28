/** @jsx jsx */
import { h } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { parseProps } from '../../../utilities';

const CSS = {
	HTML: () => css({}),
};

export const HTML = observer((properties: HTMLProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: HTMLProps = {
		// default props
		// global theme
		...globalTheme?.components?.HTML,
		// props
		...properties,
		...properties.theme?.components?.HTML,
	};

	const parsedProps = parseProps(props.controller!, props);

	const { content, disableStyles, className, style } = parsedProps;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.HTML(), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__HTML', className)} dangerouslySetInnerHTML={{ __html: content }}></div>
		</CacheProvider>
	);
});

export interface HTMLProps extends ComponentProps {
	content: string;
}
