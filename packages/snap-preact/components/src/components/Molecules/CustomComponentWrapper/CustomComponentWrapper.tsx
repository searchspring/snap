import { h } from 'preact';
import { css } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import { cloneWithProps, mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useTreePath } from '../../../providers/treePath';

const defaultStyles: StyleScript<CustomComponentWrapperProps> = () => {
	return css({});
};

export const CustomComponentWrapper = observer((properties: CustomComponentWrapperProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const componentType = properties.type.charAt(0).toUpperCase() + properties.type.slice(1).toLowerCase();

	const defaultProps: Partial<CustomComponentWrapperProps> = {
		treePath: properties.children.props.treePath || globalTreePath || undefined,
	};

	const props = mergeProps(`customComponent-${componentType}`, globalTheme, defaultProps, properties);

	const { children } = props;

	const styling = mergeStyles<CustomComponentWrapperProps>(props, defaultStyles);

	const path = styling['ss-path'];

	return (
		<CacheProvider>
			<div {...styling}>{cloneWithProps(children, { treePath: path, theme: globalTheme })}</div>
		</CacheProvider>
	);
});

export interface CustomComponentWrapperProps extends ComponentProps {
	type: string;
	name: string;
	children: any;
}
