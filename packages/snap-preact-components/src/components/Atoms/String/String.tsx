/** @jsx jsx */
import { Fragment, h } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { mergeProps } from '../../../utilities';

const CSS = {
	String: () => css({}),
};

export const String = observer((properties: StringProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<StringProps> = {};

	const props = mergeProps('string', globalTheme, defaultProps, properties);

	const { content, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.String(), style];
	} else if (style) {
		styling.css = [style];
	}

	return content ? (
		<CacheProvider>
			<span {...styling} className={classnames('ss__string', className)}>
				{content}
			</span>
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface StringProps extends ComponentProps {
	content?: string;
}
