/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { BannerContent, BannerType, ComponentProps } from '../../../types';
import { Theme, useTheme } from '../../../providers';

const CSS = {
	banner: ({ style }) =>
		css({
			'& iframe': {
				maxWidth: '100%',
			},
			...style,
		}),
};

export function Banner(properties: BannerProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: BannerProps = {
		// default props
		content: [],
		type: '',
		// global theme
		...globalTheme?.components?.banner,
		// props
		...properties,
		...properties.theme?.components?.banner,
	};

	const { content, type, disableStyles, className, style } = props;

	if (type === BannerType.INLINE) {
		console.warn(`BannerType '${BannerType.INLINE}' is not supported in <Banner /> component`);
		return;
	}

	return (
		content &&
		content[type]?.length && (
			<div
				className={classnames('ss__banner', `ss__banner--${type}`, className)}
				css={!disableStyles && CSS.banner({ style })}
				dangerouslySetInnerHTML={{
					__html: content[props.type].join(''),
				}}
			/>
		)
	);
}

export interface BannerProps extends ComponentProps {
	content: BannerContent | [];
	type: BannerType;
}
