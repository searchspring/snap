/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { parseProps } from '../../../utilities';

const CSS = {
	String: () => css({}),
};

export const String = observer((properties: StringProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: StringProps = {
		// default props
		// global theme
		...globalTheme?.components?.string,
		// props
		...properties,
		...properties.theme?.components?.string,
	};

	const parsedProps = parseProps(props.controller!, props);

	const { content, disableStyles, className, style } = parsedProps;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.String(), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__string', className)}>
				{content}
			</div>
		</CacheProvider>
	);
});

export interface StringProps extends ComponentProps {
	content?: string;
}
