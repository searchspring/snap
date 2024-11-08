import { ComponentProps, RootNodeProperties, StyleScript } from '../types';

export function mergeStyles<Props>(stylingProps: Props, defaultStyles: StyleScript<Props>): RootNodeProperties {
	const { name, style, styleScript, themeStyleScript, disableStyles } = stylingProps as ComponentProps;

	const styling: RootNodeProperties = {
		'ss-name': name,
		css: [],
	};

	if (!disableStyles) {
		styling.css!.push(defaultStyles(stylingProps));
	}

	if (themeStyleScript) {
		styling.css!.push(themeStyleScript(stylingProps));
	}

	if (styleScript) {
		styling.css!.push(styleScript(stylingProps));
	}

	if (style) {
		styling.css!.push(style);
	}

	if (styling.css?.length == 0) {
		delete styling.css;
	}

	return styling;
}
